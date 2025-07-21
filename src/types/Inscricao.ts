export interface BaseEntity {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}
export enum InscricaoStatus {
	ATIVA = "ATIVA",
	PENDENTE = "PENDENTE",
	CANCELADA = "CANCELADA",
	EXPIRADA = "EXPIRADA",
	SUSPENSA = "SUSPENSA",
}

export enum PaymentStatus {
	PENDING = "pending",
	SUCCEEDED = "succeeded",
	FAILED = "failed",
	CANCELED = "canceled",
	REFUNDED = "refunded",
}

export enum UserRole {
	CLIENTE = "CLIENTE",
	GUIA = "GUIA",
	ADMIN = "ADMIN",
}

export interface Plan extends BaseEntity {
	nome: string;
	descricao: string;
	preco: number | string;
	duracao_dias: number;
	role: UserRole | string;
	ativo: boolean;
	stripe_product_id?: string;
	stripe_price_id?: string;
	recursos?: string[];
	metadata?: Record<string, unknown>;
}

export interface User extends BaseEntity {
	email: string;
	role: UserRole | string;
	ativo: boolean;
	emailVerificado?: boolean;
}

export interface Subscription extends BaseEntity {
	data_inicio: string | Date;
	data_fim?: string | Date;
	data_renovacao?: string | Date;
	auto_renovavel: boolean;
	status: InscricaoStatus | string;

	usuario?: User;
	planoAssinatura?: Plan;
	pagamentos?: Payment[];

	stripe_subscription_id?: string;
	stripe_customer_id?: string;
	stripe_subscription_status?: string;
	stripe_current_period_start?: string | Date;
	stripe_current_period_end?: string | Date;

	metadata?: Record<string, unknown>;
}

export interface Payment extends BaseEntity {
	valor: number | string;
	data_pagamento: string | Date;
	status: PaymentStatus | string;
	metodo_pagamento?: string;

	inscricao?: Subscription;

	stripe_payment_intent_id?: string;
	stripe_invoice_id?: string;
	stripe_charge_id?: string;
	stripe_metadata?: string | Record<string, unknown>;

	data_reembolso?: string | Date;
	valor_reembolsado?: number | string;
	stripe_refund_id?: string;
}

export interface CreateCheckoutRequest {
	id_plano_assinatura: string;
	id_usuario: string;
	success_url?: string;
	cancel_url?: string;
}

export interface CheckoutSession {
	checkout_url: string;
	session_id: string;
}

export interface CreateSubscriptionRequest {
	id_usuario: string;
	id_plano_assinatura: string;
	status?: InscricaoStatus | string;
	auto_renovavel?: boolean;
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
}

export interface UpdateSubscriptionRequest {
	status?: InscricaoStatus | string;
	auto_renovavel?: boolean;
	data_fim?: string | Date;
	metadata?: Record<string, unknown>;
}

export interface CreatePaymentRequest {
	id_inscricao: string;
	valor: number;
	data_pagamento?: string | Date;
	status?: PaymentStatus | string;
	metodo_pagamento?: string;
	stripe_invoice_id?: string;
	stripe_payment_intent_id?: string;
	stripe_metadata?: string | Record<string, unknown>;
}

export interface SubscriptionStats {
	total_assinaturas: number;
	assinaturas_ativas: number;
	assinaturas_canceladas: number;
	receita_total: number;
	receita_mensal: number;
	crescimento_mensal?: number;
}

export interface PaymentStats {
	total_pagamentos: number;
	valor_total: number;
	pagamentos_sucessosos: number;
	pagamentos_pendentes: number;
	pagamentos_falharam: number;
	ultimo_pagamento?: string;
}

export interface DashboardStats {
	subscriptions: SubscriptionStats;
	payments: PaymentStats;
	plans: {
		total_planos: number;
		planos_ativos: number;
		plano_mais_popular?: string;
	};
}

export interface SubscriptionFilters {
	status?: InscricaoStatus | string;
	planId?: string;
	userId?: string;
	startDate?: string;
	endDate?: string;
	active?: boolean;
}

export interface PaymentFilters {
	status?: PaymentStatus | string;
	subscriptionId?: string;
	userId?: string;
	startDate?: string;
	endDate?: string;
	minAmount?: number;
	maxAmount?: number;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface WebhookEvent {
	id: string;
	type: string;
	data: Record<string, unknown>;
	created: number;
}

export interface StripeWebhookData {
	eventType: string;
	eventId: string;
	objectId: string;
	status?: string;
	customerId?: string;
	subscriptionId?: string;
	invoiceId?: string;
	paymentIntentId?: string;
}

// Componentes UI
export interface SubscriptionCardProps {
	subscription: Subscription;
	showActions?: boolean;
	onCancel?: (id: string) => void;
	onReactivate?: (id: string) => void;
	onViewPayments?: (id: string) => void;
}

export interface PlanCardProps {
	plan: Plan;
	isCurrentPlan?: boolean;
	isPopular?: boolean;
	onSubscribe?: (planId: string) => void;
	onEdit?: (plan: Plan) => void;
	disabled?: boolean;
}

export interface PaymentTableProps {
	payments: Payment[];
	showSubscriptionInfo?: boolean;
	showUserInfo?: boolean;
	onRefund?: (paymentId: string) => void;
	onViewDetails?: (payment: Payment) => void;
}

// Hooks
export interface UseSubscriptionReturn {
	subscription: Subscription | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	cancel: () => Promise<void>;
	reactivate: () => Promise<void>;
}

export interface UsePaymentsReturn {
	payments: Payment[];
	loading: boolean;
	error: string | null;
	stats: PaymentStats | null;
	refresh: () => Promise<void>;
	refund: (paymentId: string) => Promise<void>;
}

export interface UsePlansReturn {
	plans: Plan[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	subscribe: (planId: string) => Promise<void>;
}

// Validação
export interface ValidationError {
	field: string;
	message: string;
}

export interface FormErrors {
	[key: string]: string;
}

// Notificações
export interface NotificationSettings {
	paymentSuccess: boolean;
	paymentFailed: boolean;
	subscriptionExpiring: boolean;
	subscriptionCanceled: boolean;
	subscriptionRenewed: boolean;
}

// Configurações
export interface AppConfig {
	stripe: {
		publishableKey: string;
		webhookSecret: string;
	};
	features: {
		multipleSubscriptions: boolean;
		automaticRetry: boolean;
		prorationEnabled: boolean;
	};
	notifications: NotificationSettings;
}

// Funções utilitárias de tipo
export function isActiveSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "ativa" || status === "active";
}

export function isCanceledSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "cancelada" || status === "canceled" || status === "cancelled";
}

export function isPendingSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "pendente" || status === "pending";
}

export function isExpiredSubscription(subscription: Subscription): boolean {
	const status = String(subscription.status || "").toLowerCase();
	return status === "expirada" || status === "expired";
}

export function formatSubscriptionPrice(price: number | string): string {
	const numPrice = typeof price === "string" ? parseFloat(price) : price;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(numPrice);
}

export function formatSubscriptionDate(date: string | Date): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export function calculateDaysRemaining(endDate: string | Date): number {
	const end = typeof endDate === "string" ? new Date(endDate) : endDate;
	const now = new Date();
	const diff = end.getTime() - now.getTime();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export const SUBSCRIPTION_STATUSES = {
	ATIVA: "ATIVA",
	PENDENTE: "PENDENTE",
	CANCELADA: "CANCELADA",
	EXPIRADA: "EXPIRADA",
	SUSPENSA: "SUSPENSA",
} as const;

export const PAYMENT_STATUSES = {
	PENDING: "pending",
	SUCCEEDED: "succeeded",
	FAILED: "failed",
	CANCELED: "canceled",
	REFUNDED: "refunded",
} as const;

export const USER_ROLES = {
	CLIENTE: "CLIENTE",
	GUIA: "GUIA",
	ADMIN: "ADMIN",
} as const;
