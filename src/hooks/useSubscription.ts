import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SubscriptionService from "@/services/subscriptionService";
import { useUser } from "./useAuth";

interface Subscription {
	id: string;
	status: "ATIVA" | "PENDENTE" | "CANCELADA" | "EXPIRADA";
	data_inicio: string;
	data_fim?: string;
	auto_renovavel: boolean;
	stripe_current_period_end?: string;
	planoAssinatura?: {
		id: string;
		nome: string;
		preco: number;
		descricao: string;
		duracao_dias: number;
	};
}

interface Plan {
	id: string;
	nome: string;
	preco: string | number;
	descricao: string;
	duracao_dias: number;
	role: string;
	ativo: boolean;
}

export function useSubscription() {
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user, isLoading } = useUser();

	const fetchSubscription = useCallback(async () => {
		if (isLoading || !user) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const activeSubscription = await SubscriptionService.getMyActiveSubscription();

			if (activeSubscription && typeof activeSubscription === "object") {
				setSubscription(activeSubscription as Subscription);
			} else {
				setSubscription(null);
			}
		} catch (err: unknown) {
			console.error("Erro ao carregar assinatura:", err);

			const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
			if (error.response?.status === 404) {
				setSubscription(null);
				setError(null);
			} else {
				const errorMessage =
					error.response?.data?.message || error.message || "Erro ao carregar assinatura";
				setError(errorMessage);
				setSubscription(null);
			}
		} finally {
			setLoading(false);
		}
	}, [user, isLoading]);

	const cancelSubscription = useCallback(
		async (subscriptionId?: string) => {
			const targetId = subscriptionId || subscription?.id;
			if (!targetId) {
				toast.error("ID da assinatura não encontrado");
				return false;
			}

			try {
				setLoading(true);
				const canceled = await SubscriptionService.cancelSubscription(targetId);

				if (canceled && typeof canceled === "object") {
					setSubscription(canceled as Subscription);
					toast.success("Assinatura cancelada com sucesso!");
					return true;
				} else {
					throw new Error("Resposta inválida do servidor");
				}
			} catch (err: unknown) {
				console.error("Erro ao cancelar assinatura:", err);
				const error = err as { response?: { data?: { message?: string } }; message?: string };
				const errorMessage =
					error.response?.data?.message || error.message || "Erro ao cancelar assinatura";
				setError(errorMessage);
				toast.error(errorMessage);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[subscription],
	);

	const subscribe = useCallback(
		async (planId: string) => {
			if (!user) {
				toast.error("Você precisa estar logado para assinar um plano");
				return false;
			}

			if (!planId) {
				toast.error("ID do plano é obrigatório");
				return false;
			}

			try {
				setLoading(true);
				setError(null);

				const checkoutRequest = {
					id_plano_assinatura: planId,
					id_usuario: user.sub,
					success_url: `${window.location.origin}/assinatura/sucesso`,
					cancel_url: `${window.location.origin}/assinatura/cancelado`,
				};

				const session = await SubscriptionService.createCheckoutSession(checkoutRequest);

				if (session?.checkout_url) {
					window.location.href = session.checkout_url;
					return true;
				} else {
					throw new Error("URL de checkout não recebida");
				}
			} catch (err: unknown) {
				console.error("Erro ao criar checkout:", err);
				const error = err as { response?: { data?: { message?: string } }; message?: string };
				const errorMessage =
					error.response?.data?.message || error.message || "Erro ao iniciar processo de assinatura";
				setError(errorMessage);
				toast.error(errorMessage);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[user],
	);

	useEffect(() => {
		fetchSubscription();
	}, [fetchSubscription]);

	const isActive = subscription?.status === "ATIVA";
	const isCanceled = subscription?.status === "CANCELADA";
	const isPending = subscription?.status === "PENDENTE";
	const isExpired = subscription ? isSubscriptionExpired(subscription) : false;
	const daysRemaining = subscription?.data_fim ? calculateDaysRemaining(subscription.data_fim) : 0;

	return {
		subscription,
		loading,
		error,
		isActive,
		isCanceled,
		isPending,
		isExpired,
		daysRemaining,
		refresh: fetchSubscription,
		cancel: cancelSubscription,
		subscribe,
		clearError: () => setError(null),
	};
}

export function usePlans(role?: "GUIA" | "CLIENTE") {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { role: userRole } = useUser();

	const targetRole = role || userRole;

	const fetchPlans = useCallback(async () => {
		if (!targetRole) {
			setLoading(false);
			return;
		}

		if (targetRole !== "GUIA" && targetRole !== "CLIENTE") {
			setError("Tipo de usuário inválido para assinaturas");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const plansData = await SubscriptionService.getActivePlansByRole(targetRole);

			const validPlans = Array.isArray(plansData)
				? plansData.filter((plan) => plan && plan.id && plan.nome)
				: [];

			setPlans(validPlans);
		} catch (err: unknown) {
			console.error("Erro ao carregar planos:", err);
			const error = err as { response?: { data?: { message?: string } }; message?: string };
			const errorMessage = error.response?.data?.message || error.message || "Erro ao carregar planos";
			setError(errorMessage);
			setPlans([]);
		} finally {
			setLoading(false);
		}
	}, [targetRole]);

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	return {
		plans,
		loading,
		error,
		refresh: fetchPlans,
		clearError: () => setError(null),
	};
}

// Hook para notificações de assinatura
export function useSubscriptionNotifications() {
	const { subscription } = useSubscription();
	const [notifications, setNotifications] = useState<string[]>([]);

	useEffect(() => {
		if (!subscription) {
			setNotifications([]);
			return;
		}

		const newNotifications: string[] = [];

		try {
			if (subscription.data_fim) {
				const daysRemaining = calculateDaysRemaining(subscription.data_fim);

				if (daysRemaining <= 7 && daysRemaining > 0 && subscription.status === "ATIVA") {
					newNotifications.push(
						`Sua assinatura expira em ${daysRemaining} dias. Renove para continuar aproveitando os benefícios.`,
					);
				}

				if (daysRemaining <= 3 && daysRemaining > 0 && subscription.status === "ATIVA") {
					newNotifications.push(`URGENTE: Sua assinatura expira em ${daysRemaining} dias!`);
				}
			}

			if (subscription.status === "CANCELADA" && subscription.data_fim) {
				const daysRemaining = calculateDaysRemaining(subscription.data_fim);
				if (daysRemaining > 0) {
					newNotifications.push(
						`Sua assinatura foi cancelada mas permanece ativa até ${formatDate(subscription.data_fim)}.`,
					);
				}
			}

			if (isSubscriptionExpired(subscription)) {
				newNotifications.push(
					"Sua assinatura expirou. Renove para continuar aproveitando os benefícios.",
				);
			}

			if (subscription.status === "PENDENTE") {
				newNotifications.push(
					"Sua assinatura está pendente de pagamento. Verifique seu email ou complete o pagamento.",
				);
			}
		} catch (error) {
			console.error("Erro ao processar notificações:", error);
		}

		setNotifications(newNotifications);
	}, [subscription]);

	return { notifications };
}

// Funções utilitárias com verificações de segurança
function calculateDaysRemaining(endDate: string | Date): number {
	try {
		if (!endDate) return 0;
		const end = new Date(endDate);
		const now = new Date();

		// Verificar se a data é válida
		if (isNaN(end.getTime())) return 0;

		const diff = end.getTime() - now.getTime();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	} catch (error) {
		console.error("Erro ao calcular dias restantes:", error);
		return 0;
	}
}

function isSubscriptionExpired(subscription: Subscription): boolean {
	try {
		if (!subscription || !subscription.data_fim) return false;
		const endDate = new Date(subscription.data_fim);

		// Verificar se a data é válida
		if (isNaN(endDate.getTime())) return false;

		return new Date() > endDate;
	} catch (error) {
		console.error("Erro ao verificar expiração:", error);
		return false;
	}
}

function formatDate(date: string | Date): string {
	try {
		if (!date) return "Data não disponível";
		const dateObj = new Date(date);

		if (isNaN(dateObj.getTime())) return "Data inválida";

		return dateObj.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} catch (error) {
		console.error("Erro ao formatar data:", error);
		return "Erro na data";
	}
}

export function useCanSubscribe() {
	const { subscription } = useSubscription();

	return useCallback(
		async (planId: string): Promise<{ canSubscribe: boolean; reason?: string }> => {
			try {
				if (!planId) {
					return { canSubscribe: false, reason: "ID do plano é obrigatório" };
				}

				if (!subscription) {
					return { canSubscribe: true };
				}

				if (subscription.planoAssinatura?.id === planId) {
					return {
						canSubscribe: false,
						reason: "Você já possui uma assinatura ativa para este plano",
					};
				}

				if (subscription.status === "ATIVA") {
					return {
						canSubscribe: true,
						reason: "Sua assinatura atual será cancelada automaticamente",
					};
				}

				return { canSubscribe: true };
			} catch (error) {
				console.error("Erro ao verificar se pode assinar:", error);
				return { canSubscribe: true };
			}
		},
		[subscription],
	);
}
