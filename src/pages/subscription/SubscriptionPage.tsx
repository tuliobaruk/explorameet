import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUser } from "@/hooks/useAuth";
import SubscriptionService from "@/services/subscriptionService";
import {
	Plan,
	Subscription,
	formatSubscriptionPrice,
	formatSubscriptionDate,
} from "@/types/Inscricao";
import {
	Calendar,
	Check,
	CreditCard,
	RefreshCw,
	X,
	AlertTriangle,
	Clock,
	AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./SubscriptionPage.css";

function isActiveSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "ativa" || status === "active";
}

function isCanceledSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "cancelada" || status === "canceled" || status === "cancelled";
}

function isPendingCancellation(subscription: Subscription): boolean {
	return (
		isActiveSubscription(subscription) &&
		subscription.stripe_subscription_status === "active" &&
		subscription.auto_renovavel === false
	);
}

interface SubscriptionDetailsProps {
	subscription: Subscription;
	onCancel: () => void;
	onReactivate?: () => void;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
	subscription,
	onCancel,
	onReactivate,
}) => {
	const getStatusBadge = (status: string, isPendingCancel: boolean = false) => {
		if (isPendingCancel) {
			return (
				<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium bg-orange-500">
					<Clock size={14} />
					Cancelamento Agendado
				</span>
			);
		}

		const normalizedStatus = String(status || "").toLowerCase();
		const statusMap = {
			ativa: { text: "Ativa", color: "bg-green-500", icon: Check },
			active: { text: "Ativa", color: "bg-green-500", icon: Check },
			pendente: { text: "Pendente", color: "bg-yellow-500", icon: RefreshCw },
			pending: { text: "Pendente", color: "bg-yellow-500", icon: RefreshCw },
			cancelada: { text: "Cancelada", color: "bg-red-500", icon: X },
			canceled: { text: "Cancelada", color: "bg-red-500", icon: X },
			cancelled: { text: "Cancelada", color: "bg-red-500", icon: X },
			expirada: { text: "Expirada", color: "bg-gray-500", icon: AlertTriangle },
			expired: { text: "Expirada", color: "bg-gray-500", icon: AlertTriangle },
		};

		const statusInfo = statusMap[normalizedStatus] || {
			text: status || "Desconhecido",
			color: "bg-gray-500",
			icon: RefreshCw,
		};
		const Icon = statusInfo.icon;

		return (
			<span
				className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${statusInfo.color}`}
			>
				<Icon size={14} />
				{statusInfo.text}
			</span>
		);
	};

	const formatDateWithTime = (date: string | Date) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleString("pt-BR", {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (!subscription || !subscription.planoAssinatura) {
		return (
			<div className="bg-white rounded-lg shadow-lg border-2 border-red-500 p-6 mb-8">
				<div className="text-center">
					<h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar assinatura</h2>
					<p className="text-gray-600">Dados da assinatura incompletos ou não encontrados.</p>
				</div>
			</div>
		);
	}

	const isActive = isActiveSubscription(subscription);
	const isCanceled = isCanceledSubscription(subscription);
	const isPendingCancel = isPendingCancellation(subscription);

	return (
		<div
			className={`bg-white rounded-lg shadow-lg border-2 p-6 mb-8 ${
				isPendingCancel ? "border-orange-500" : isActive ? "border-green-500" : "border-red-500"
			}`}
		>
			<div className="flex justify-between items-start mb-4">
				<div>
					<h2 className="text-2xl font-bold text-verde-oliva mb-2">
						{isPendingCancel ? "Assinatura em Cancelamento" : "Sua Assinatura Atual"}
					</h2>
					<div className="flex items-center gap-3">
						{getStatusBadge(subscription.status as string, isPendingCancel)}
						{subscription.auto_renovavel && isActive && !isPendingCancel && (
							<span className="text-sm text-gray-600 flex items-center gap-1">
								<RefreshCw size={14} />
								Renovação automática
							</span>
						)}
					</div>
				</div>
				<div className="text-right">
					<div className="text-3xl font-bold text-marrom-dourado">
						{formatSubscriptionPrice(subscription.planoAssinatura.preco)}
					</div>
					<div className="text-gray-600">
						/
						{subscription.planoAssinatura.duracao_dias === 30
							? "mês"
							: `${subscription.planoAssinatura.duracao_dias || 0} dias`}
					</div>
				</div>
			</div>

			{isPendingCancel && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<h4 className="font-semibold text-orange-800 mb-1">Cancelamento Agendado</h4>
							<p className="text-orange-700 text-sm mb-2">
								Sua assinatura foi cancelada, mas permanecerá ativa até o final do período já pago.
							</p>
							<p className="text-orange-700 text-sm font-medium">
								<strong>Cancelamento efetivo:</strong>{" "}
								{formatDateWithTime(
									subscription.data_fim || subscription.stripe_current_period_end,
								)}
							</p>
							{onReactivate && (
								<button
									onClick={onReactivate}
									className="mt-3 text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
								>
									Reativar Assinatura
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<div className="bg-gray-50 p-4 rounded-lg">
					<h3 className="font-semibold text-verde-oliva mb-2">
						{subscription.planoAssinatura.nome || "Plano sem nome"}
					</h3>
					<p className="text-gray-600 text-sm">
						{subscription.planoAssinatura.descricao || "Sem descrição disponível"}
					</p>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-gray-600 flex items-center gap-2">
							<Calendar size={16} />
							Data de início:
						</span>
						<span className="font-medium">{formatSubscriptionDate(subscription.data_inicio)}</span>
					</div>

					{subscription.data_fim && (
						<div className="flex items-center justify-between">
							<span className="text-gray-600 flex items-center gap-2">
								<Calendar size={16} />
								{isPendingCancel ? "Cancela em:" : isActive ? "Próxima cobrança:" : "Data de fim:"}
							</span>
							<span className={`font-medium ${isPendingCancel ? "text-orange-600" : ""}`}>
								{formatSubscriptionDate(subscription.data_fim)}
							</span>
						</div>
					)}

					{subscription.stripe_current_period_end && (
						<div className="flex items-center justify-between">
							<span className="text-gray-600 flex items-center gap-2">
								<CreditCard size={16} />
								Período atual até:
							</span>
							<span className="font-medium">
								{formatSubscriptionDate(subscription.stripe_current_period_end)}
							</span>
						</div>
					)}
				</div>
			</div>

			{isActive && !isPendingCancel && (
				<div className="flex justify-end">
					<button
						onClick={onCancel}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
					>
						Cancelar Assinatura
					</button>
				</div>
			)}

			{isCanceled && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-700 text-sm">
						<strong>Assinatura cancelada.</strong> Você pode escolher um novo plano abaixo.
					</p>
				</div>
			)}
		</div>
	);
};

export default function SubscriptionPage() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);
	const [subscribing, setSubscribing] = useState<string | null>(null);
	const [cancelling, setCancelling] = useState<string | null>(null);
	const [reactivating, setReactivating] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState<{
		show: boolean;
		planId: string;
		planName: string;
	}>({ show: false, planId: "", planName: "" });

	const { user, isLoading, role } = useUser();

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			toast.error("Você precisa estar logado para acessar esta página.");
			return;
		}

		if (!role) {
			toast.info("Carregando informações do usuário...");
			return;
		}

		const loadData = async () => {
			try {
				setLoading(true);

				if (role !== "GUIA" && role !== "CLIENTE") {
					toast.error("Tipo de usuário inválido para assinaturas.");
					return;
				}

				const [plansData, activeSubData] = await Promise.all([
					SubscriptionService.getActivePlansByRole(role as "GUIA" | "CLIENTE").catch(() => []),
					SubscriptionService.getMyActiveSubscription().catch(() => null),
				]);

				setPlans(Array.isArray(plansData) ? plansData : []);
				setActiveSubscription(activeSubData);
			} catch (error: unknown) {
				console.error("❌ Erro ao carregar dados:", error);
				const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
				toast.error("Erro ao carregar dados da página: " + errorMessage);
				setActiveSubscription(null);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [role, isLoading, user]);

	const handleSubscribe = async (planId: string, planName: string) => {
		if (!user) {
			toast.error("Você precisa estar logado para assinar um plano.");
			return;
		}

		if (!planId || !planName) {
			toast.error("Dados do plano inválidos.");
			return;
		}

		if (
			activeSubscription &&
			isActiveSubscription(activeSubscription) &&
			activeSubscription.planoAssinatura?.id !== planId
		) {
			setShowConfirmModal({ show: true, planId, planName });
			return;
		}

		await processSubscription(planId);
	};

	const handleCancelSubscription = async (planId: string) => {
		if (!activeSubscription) {
			toast.error("Nenhuma assinatura ativa encontrada");
			return;
		}

		if (
			window.confirm(
				"Tem certeza que deseja cancelar sua assinatura? Ela permanecerá ativa até o fim do período já pago.",
			)
		) {
			setCancelling(planId);
			try {
				const canceledSubscription = await SubscriptionService.cancelSubscription(
					activeSubscription.id,
				);
				toast.success("Assinatura cancelada com sucesso. Permanecerá ativa até o fim do período.");
				setActiveSubscription(canceledSubscription);
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
				toast.error("Erro ao cancelar assinatura: " + errorMessage);
			} finally {
				setCancelling(null);
			}
		}
	};

	const handleReactivateSubscription = async () => {
		if (!activeSubscription) return;

		setReactivating(true);
		try {
			const reactivatedSubscription = await SubscriptionService.reactivateSubscription(
				activeSubscription.id,
			);
			toast.success("Assinatura reativada com sucesso!");
			setActiveSubscription(reactivatedSubscription);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
			toast.error("Erro ao reativar assinatura: " + errorMessage);
		} finally {
			setReactivating(false);
		}
	};

	const processSubscription = async (planId: string) => {
		if (!user) return;

		setSubscribing(planId);
		try {
			const checkoutRequest = {
				id_plano_assinatura: planId,
				id_usuario: user.sub,
				success_url: `${window.location.origin}/assinatura/sucesso`,
				cancel_url: `${window.location.origin}/assinatura/cancelado`,
			};

			const session = await SubscriptionService.createCheckoutSession(checkoutRequest);

			if (session?.checkout_url) {
				window.location.href = session.checkout_url;
			} else {
				throw new Error("URL de checkout não recebida");
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
			toast.error("Erro ao iniciar o processo de assinatura: " + errorMessage);
			setSubscribing(null);
		}
	};

	const handleConfirmPlanChange = async () => {
		setShowConfirmModal({ show: false, planId: "", planName: "" });
		await processSubscription(showConfirmModal.planId);
	};

	const getButtonText = (planId: string) => {
		if (subscribing === planId) return "Processando...";
		if (cancelling === planId) return "Cancelando...";

		if (activeSubscription && isActiveSubscription(activeSubscription)) {
			const isPendingCancel = isPendingCancellation(activeSubscription);

			if (activeSubscription.planoAssinatura?.id === planId) {
				if (isPendingCancel) {
					return "Cancelamento Agendado";
				}
				return "Cancelar Plano";
			}
			return "Trocar para este Plano";
		}

		return "Assinar Agora";
	};

	const getButtonAction = (planId: string, planName: string) => {
		if (
			activeSubscription &&
			isActiveSubscription(activeSubscription) &&
			activeSubscription.planoAssinatura?.id === planId
		) {
			const isPendingCancel = isPendingCancellation(activeSubscription);

			if (isPendingCancel) {
				return () => toast.info("Esta assinatura já está agendada para cancelamento.");
			}

			return () => handleCancelSubscription(planId);
		}

		return () => handleSubscribe(planId, planName);
	};

	const isButtonDisabled = (planId: string) => {
		if (subscribing === planId || cancelling === planId || reactivating) {
			return true;
		}

		if (
			activeSubscription &&
			isActiveSubscription(activeSubscription) &&
			activeSubscription.planoAssinatura?.id === planId &&
			isPendingCancellation(activeSubscription)
		) {
			return true;
		}

		return false;
	};

	const getButtonClass = (planId: string) => {
		const isCurrentPlan =
			activeSubscription &&
			isActiveSubscription(activeSubscription) &&
			activeSubscription.planoAssinatura?.id === planId;

		if (isCurrentPlan) {
			const isPendingCancel = isPendingCancellation(activeSubscription);

			if (isPendingCancel) {
				return "bg-gray-400 text-white cursor-not-allowed";
			}

			return "bg-red-500 hover:bg-red-600 text-white";
		}

		return "subscribe-button text-white hover:shadow-lg";
	};

	if (loading || isLoading) {
		return (
			<div className="subscription-container flex flex-col min-h-screen">
				<Header />
				<main className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-verde-oliva">Carregando planos...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="subscription-container flex flex-col min-h-screen">
				<Header />
				<main className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
						<p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="subscription-container flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold" style={{ color: "var(--verde-oliva)" }}>
						Nossos Planos de Assinatura
					</h1>
					<p className="text-lg text-gray-600 mt-2">
						Escolha o plano que melhor se adapta à sua jornada.
					</p>
				</div>

				{activeSubscription && (
					<SubscriptionDetails
						subscription={activeSubscription}
						onCancel={() => handleCancelSubscription(activeSubscription.planoAssinatura?.id || "")}
						onReactivate={handleReactivateSubscription}
					/>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{plans && plans.length > 0 ? (
						plans.map((plan) => {
							if (!plan || !plan.id) {
								return null;
							}

							const isCurrentPlan =
								activeSubscription &&
								isActiveSubscription(activeSubscription) &&
								activeSubscription.planoAssinatura?.id === plan.id;

							const isPendingCancel = isCurrentPlan && isPendingCancellation(activeSubscription);

							return (
								<div
									key={plan.id}
									className={`plan-card rounded-lg shadow-lg p-8 flex flex-col transition-all duration-300 ${
										isCurrentPlan
											? isPendingCancel
												? "border-2 border-orange-500 bg-orange-50"
												: "border-2 border-green-500 bg-green-50"
											: "hover:shadow-xl"
									}`}
								>
									{isCurrentPlan && (
										<div
											className={`text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start mb-4 ${
												isPendingCancel ? "bg-orange-500" : "bg-green-500"
											}`}
										>
											{isPendingCancel ? "Cancelamento Agendado" : "Plano Atual"}
										</div>
									)}

									<h2 className="text-2xl font-bold mb-2" style={{ color: "var(--verde-oliva)" }}>
										{plan.nome || "Plano sem nome"}
									</h2>

									<p
										className="text-4xl font-extrabold mb-4"
										style={{ color: "var(--marrom-dourado)" }}
									>
										{formatSubscriptionPrice(plan.preco)}
										<span className="text-lg font-medium text-gray-500">
											/ {plan.duracao_dias === 30 ? "mês" : `${plan.duracao_dias || 0} dias`}
										</span>
									</p>

									<p className="text-gray-600 mb-6 flex-grow">
										{plan.descricao || "Sem descrição disponível"}
									</p>

									<button
										onClick={getButtonAction(plan.id, plan.nome || "Plano")}
										disabled={isButtonDisabled(plan.id)}
										className={`w-full font-bold py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass(plan.id)}`}
									>
										{getButtonText(plan.id)}
									</button>
								</div>
							);
						})
					) : (
						<div className="col-span-full text-center py-12">
							<h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum plano disponível</h3>
							<p className="text-gray-500">
								Não há planos de assinatura disponíveis para o seu tipo de usuário no momento.
							</p>
						</div>
					)}
				</div>

				{/* Modal de confirmação para troca de plano */}
				{showConfirmModal.show && (
					<div
						className="modal-overlay"
						onClick={() => setShowConfirmModal({ show: false, planId: "", planName: "" })}
					>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<h3 className="text-lg font-bold text-verde-oliva mb-4">Confirmar Troca de Plano</h3>
							<p className="text-gray-600 mb-6">
								Você possui uma assinatura ativa para o plano "
								<strong>{activeSubscription?.planoAssinatura?.nome}</strong>". Ao trocar para o
								plano "<strong>{showConfirmModal.planName}</strong>", sua assinatura atual será
								cancelada automaticamente. Deseja continuar?
							</p>
							<div className="flex justify-between w-full mt-2">
								<button
									onClick={() => setShowConfirmModal({ show: false, planId: "", planName: "" })}
									className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-2/5"
								>
									Cancelar
								</button>
								<button
									onClick={handleConfirmPlanChange}
									className="px-3 py- rounded-lg font-bold text-white modal-confirm-btn w-2/5"
								>
									Confirmar Troca
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
