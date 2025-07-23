import { apiClient, ApiError } from "@/api/axiosConfig";
import { Plan, Subscription, CheckoutSession, CreateCheckoutRequest } from "@/types/Inscricao";

export type CreatePlanData = Omit<
	Plan,
	"id" | "stripe_product_id" | "stripe_price_id" | "ativo" | "createdAt" | "updatedAt"
>;
export type UpdatePlanData = Partial<CreatePlanData> & { ativo?: boolean };

class SubscriptionService {
	private validatePlan(plan: Plan) {
		return (
			plan &&
			typeof plan === "object" &&
			plan.id &&
			plan.nome &&
			(typeof plan.preco === "number" || typeof plan.preco === "string") &&
			typeof plan.duracao_dias === "number"
		);
	}

	private validateSubscription(subscription: Subscription) {
		return (
			subscription && typeof subscription === "object" && subscription.id && subscription.status
		);
	}

	private normalizePrice(price: unknown): number {
		if (typeof price === "number") return price;
		if (typeof price === "string") return parseFloat(price) || 0;
		return 0;
	}

	async getAllPlans(): Promise<Plan[]> {
		try {
			const response = await apiClient.get<Plan[]>("/planos-assinatura");

			if (!Array.isArray(response.data)) {
				console.warn("Resposta de planos não é um array:", response.data);
				return [];
			}

			return response.data.filter(this.validatePlan);
		} catch (error) {
			console.error("Erro ao buscar todos os planos:", error);
			throw new Error("Falha ao carregar planos");
		}
	}

	async getActivePlansByRole(role: "GUIA" | "CLIENTE"): Promise<Plan[]> {
		try {
			if (!role || (role !== "GUIA" && role !== "CLIENTE")) {
				throw new Error("Role inválido fornecido");
			}

			console.log(`Buscando planos para role: ${role}`);

			const response = await apiClient.get<Plan[]>(`/planos-assinatura/role/${role}`);

			console.log("Resposta da API para planos:", response.data);

			if (!Array.isArray(response.data)) {
				console.warn("Resposta de planos por role não é um array:", response.data);
				return [];
			}

			const validPlans = response.data.filter(this.validatePlan);
			console.log("Planos válidos filtrados:", validPlans);

			return validPlans;
		} catch (error: unknown) {
			console.error("Erro ao buscar planos por role:", error);

			if ((error as ApiError).status === 404) {
				console.log("Nenhum plano encontrado para o role:", role);
				return [];
			}

			console.warn("Retornando array vazio devido ao erro:", (error as ApiError).message);
			return [];
		}
	}

	async getPlan(id: string): Promise<Plan> {
		try {
			if (!id) {
				throw new Error("ID do plano é obrigatório");
			}

			const response = await apiClient.get<Plan>(`/planos-assinatura/${id}`);

			if (!this.validatePlan(response.data)) {
				throw new Error("Dados do plano são inválidos");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao buscar plano:", error);
			throw new Error((error as ApiError).message || "Falha ao carregar plano");
		}
	}

	async createPlan(data: CreatePlanData): Promise<Plan> {
		try {
			if (!data.nome || !data.preco || !data.duracao_dias || !data.role) {
				throw new Error("Dados obrigatórios do plano estão faltando");
			}

			const response = await apiClient.post<Plan>("/planos-assinatura", data);

			if (!this.validatePlan(response.data)) {
				throw new Error("Resposta inválida ao criar plano");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao criar plano:", error);
			throw new Error((error as ApiError).message || "Falha ao criar plano");
		}
	}

	async updatePlan(id: string, data: UpdatePlanData): Promise<Plan> {
		try {
			if (!id) {
				throw new Error("ID do plano é obrigatório");
			}

			const response = await apiClient.patch<Plan>(`/planos-assinatura/${id}`, data);

			if (!this.validatePlan(response.data)) {
				throw new Error("Resposta inválida ao atualizar plano");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao atualizar plano:", error);
			throw new Error((error as ApiError).message || "Falha ao atualizar plano");
		}
	}

	async createCheckoutSession(data: CreateCheckoutRequest): Promise<CheckoutSession> {
		try {
			if (!data.id_plano_assinatura || !data.id_usuario) {
				throw new Error("ID do plano e do usuário são obrigatórios");
			}

			console.log("Criando checkout session com dados:", data);

			const response = await apiClient.post<CheckoutSession>(
				"/inscricoes-usuario/checkout-session",
				data,
			);

			console.log("Resposta do checkout session:", response.data);

			if (!response.data?.checkout_url || !response.data?.session_id) {
				throw new Error("Resposta inválida do checkout");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao criar sessão de checkout:", error);
			throw new Error((error as ApiError).message || "Falha ao criar sessão de checkout");
		}
	}

	async getMyActiveSubscription(): Promise<Subscription | null> {
		try {
			console.log("Buscando assinatura ativa do usuário...");

			const response = await apiClient.get<Subscription>("/inscricoes-usuario/me/ativa");

			console.log("Resposta da assinatura ativa:", response.data);

			if (!response.data) {
				return null;
			}

			if (!this.validateSubscription(response.data)) {
				console.warn("Dados da assinatura são inválidos:", response.data);
				return null;
			}

			return response.data;
		} catch (error: unknown) {
			console.log("Erro ao buscar assinatura ativa:", error);

			if ((error as ApiError).status === 404) {
				console.log("Nenhuma assinatura ativa encontrada (404)");
				return null;
			}

			console.warn("Retornando null devido ao erro:", (error as ApiError).message);
			return null;
		}
	}

	async getAllSubscriptions(): Promise<Subscription[]> {
		try {
			const response = await apiClient.get<Subscription[]>("/inscricoes-usuario");

			if (!Array.isArray(response.data)) {
				console.warn("Resposta de assinaturas não é um array:", response.data);
				return [];
			}

			return response.data.filter(this.validateSubscription);
		} catch (error: unknown) {
			console.error("Erro ao buscar todas as assinaturas:", error);
			throw new Error(
				(error as ApiError).message || "Falha ao carregar assinaturas",
			);
		}
	}

	async getSubscription(id: string): Promise<Subscription> {
		try {
			if (!id) {
				throw new Error("ID da assinatura é obrigatório");
			}

			const response = await apiClient.get<Subscription>(`/inscricoes-usuario/${id}`);

			if (!this.validateSubscription(response.data)) {
				throw new Error("Dados da assinatura são inválidos");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao buscar assinatura:", error);
			throw new Error((error as ApiError).message || "Falha ao carregar assinatura");
		}
	}

	async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
		try {
			if (!userId) {
				throw new Error("ID do usuário é obrigatório");
			}

			const response = await apiClient.get<Subscription[]>(`/inscricoes-usuario/usuario/${userId}`);

			if (!Array.isArray(response.data)) {
				console.warn("Resposta de assinaturas do usuário não é um array:", response.data);
				return [];
			}

			return response.data.filter(this.validateSubscription);
		} catch (error: unknown) {
			console.error("Erro ao buscar assinaturas do usuário:", error);
			throw new Error((error as ApiError).message || "Falha ao carregar assinaturas do usuário");
		}
	}

	async cancelSubscription(id: string): Promise<Subscription> {
		try {
			if (!id) {
				throw new Error("ID da assinatura é obrigatório");
			}

			console.log("Cancelando assinatura:", id);

			const response = await apiClient.patch<Subscription>(`/inscricoes-usuario/${id}/cancel`);

			console.log("Resposta do cancelamento:", response.data);

			if (!this.validateSubscription(response.data)) {
				throw new Error("Resposta inválida ao cancelar assinatura");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao cancelar assinatura:", error);
			throw new Error((error as ApiError).message || "Falha ao cancelar assinatura");
		}
	}

	async reactivateSubscription(id: string): Promise<Subscription> {
		try {
			if (!id) {
				throw new Error("ID da assinatura é obrigatório");
			}

			const response = await apiClient.patch<Subscription>(`/inscricoes-usuario/${id}/reactivate`);

			if (!this.validateSubscription(response.data)) {
				throw new Error("Resposta inválida ao reativar assinatura");
			}

			return response.data;
		} catch (error: unknown) {
			console.error("Erro ao reativar assinatura:", error);
			throw new Error((error as ApiError).message || "Falha ao reativar assinatura");
		}
	}

	async canSubscribeToPlan(planId: string): Promise<{ canSubscribe: boolean; reason?: string }> {
		try {
			if (!planId) {
				return { canSubscribe: false, reason: "ID do plano é obrigatório" };
			}

			const activeSubscription = await this.getMyActiveSubscription();

			if (!activeSubscription) {
				return { canSubscribe: true };
			}

			if (activeSubscription.planoAssinatura?.id === planId) {
				return {
					canSubscribe: false,
					reason: "Você já possui uma assinatura ativa para este plano",
				};
			}

			if (activeSubscription.status === "ATIVA") {
				return {
					canSubscribe: true,
					reason: "Sua assinatura atual será cancelada automaticamente",
				};
			}

			return { canSubscribe: true };
		} catch (error) {
			console.error("Erro ao verificar se pode assinar plano:", error);
			return { canSubscribe: true };
		}
	}

	formatCurrency(value: number | string): string {
		try {
			const numValue = this.normalizePrice(value);

			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(numValue);
		} catch (error) {
			console.error("Erro ao formatar moeda:", error);
			return `R$ ${this.normalizePrice(value).toFixed(2)}`;
		}
	}

	formatDate(date: string | Date): string {
		try {
			if (!date) return "Data não disponível";

			const dateObj = typeof date === "string" ? new Date(date) : date;
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

	calculateDaysRemaining(endDate: string | Date): number {
		try {
			if (!endDate) return 0;

			const end = typeof endDate === "string" ? new Date(endDate) : endDate;
			if (isNaN(end.getTime())) return 0;

			const now = new Date();
			const diff = end.getTime() - now.getTime();
			return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
		} catch (error) {
			console.error("Erro ao calcular dias restantes:", error);
			return 0;
		}
	}

	isSubscriptionExpired(subscription: Subscription): boolean {
		try {
			if (!subscription?.data_fim) return false;

			const endDate =
				typeof subscription.data_fim === "string"
					? new Date(subscription.data_fim)
					: subscription.data_fim;

			if (isNaN(endDate.getTime())) return false;

			return new Date() > endDate;
		} catch (error) {
			console.error("Erro ao verificar expiração:", error);
			return false;
		}
	}

	getSubscriptionStatusText(status: string): string {
		const statusMap: Record<string, string> = {
			ATIVA: "Ativa",
			PENDENTE: "Pendente",
			CANCELADA: "Cancelada",
			EXPIRADA: "Expirada",
			SUSPENSA: "Suspensa",
		};
		return statusMap[status] || status || "Desconhecido";
	}

	getSubscriptionStatusColor(status: string): string {
		const colorMap: Record<string, string> = {
			ATIVA: "text-green-600 bg-green-100",
			PENDENTE: "text-yellow-600 bg-yellow-100",
			CANCELADA: "text-red-600 bg-red-100",
			EXPIRADA: "text-gray-600 bg-gray-100",
			SUSPENSA: "text-orange-600 bg-orange-100",
		};
		return colorMap[status] || "text-gray-600 bg-gray-100";
	}
}

export default new SubscriptionService();
