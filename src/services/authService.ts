import { apiClient, ApiError } from "@/api/axiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterClienteData {
	cpf: string;
	perfil: {
		nome: string;
		celular: string;
		genero: string;
		idade: number;
		foto?: string;
	};
	usuario: {
		email: string;
		password: string;
		termsAccepted: boolean;
	};
}

export interface RegisterGuiaData {
	cpf_cnpj: string;
	num_cadastro?: string;
	verificado?: boolean;
	perfil: {
		nome: string;
		celular: string;
		genero: string;
		idade: number;
		foto?: string;
	};
	usuario: {
		email: string;
		password: string;
		termsAccepted: boolean;
	};
}

export interface RegisterClienteWithGoogleData {
	cpf: string;
	googleId: string;
	perfil: {
		nome: string;
		celular: string;
		genero: string;
		idade: number;
		foto?: string;
	};
	usuario: {
		email: string;
		termsAccepted: boolean;
	};
}

export interface RegisterGuiaWithGoogleData {
	cpf_cnpj: string;
	num_cadastro: string;
	googleId: string;
	perfil: {
		nome: string;
		celular: string;
		genero: string;
		idade: number;
		foto?: string;
	};
	usuario: {
		email: string;
		termsAccepted: boolean;
	};
}

export interface AuthUser {
	id: string;
	email: string;
	role: string;
	roleHash: string;
}

export interface AuthResponse {
	message: string;
	user?: AuthUser;
}

export interface ConfirmEmailData {
	email: string;
	code: string;
}

export interface ResetPasswordData {
	email: string;
	code: string;
	newPassword: string;
}

export class AuthService {
	static async login(credentials: LoginData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
		return response.data;
	}

	static async logout(): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/logout");
		return response.data;
	}

	static async getMe(): Promise<AuthUser> {
		const response = await apiClient.get<AuthUser>("/auth/me");
		return response.data;
	}

	static async refreshTokens(): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/refresh");
		return response.data;
	}

	static async registerCliente(data: RegisterClienteData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/register/cliente", data);
		return response.data;
	}

	static async registerGuia(data: RegisterGuiaData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/register/guia", data);
		return response.data;
	}

	static async registerClienteWithGoogle(
		data: RegisterClienteWithGoogleData,
	): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/google/register/cliente", data);
		return response.data;
	}

	static async registerGuiaWithGoogle(data: RegisterGuiaWithGoogleData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/google/register/guia", data);
		return response.data;
	}

	static async confirmEmail(data: ConfirmEmailData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/confirm-email", data);
		return response.data;
	}

	static async resendConfirmation(email: string): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/resend-confirmation", { email });
		return response.data;
	}

	static async forgotPassword(email: string): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/forgot-password", { email });
		return response.data;
	}

	static async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/reset-password", data);
		return response.data;
	}

	static getGoogleLoginUrl(): string {
		return `${API_BASE_URL}/auth/google`;
	}

	static async checkAuthenticationStatus(): Promise<boolean> {
		try {
			await this.getMe();
			return true;
		} catch (error) {
			return false;
		}
	}

	static async authenticatedRequest<T>(
		method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
		url: string,
		data?: any,
		config?: any,
	): Promise<T> {
		const response = await apiClient.request<T>({
			method,
			url,
			data,
			...config,
		});
		return response.data;
	}

	static handleError(error: unknown): string {
		if (error instanceof ApiError) {
			return error.message;
		}

		if (error instanceof Error) {
			return error.message;
		}

		return "Erro desconhecido ocorreu";
	}
}

export { apiClient, ApiError };
export default AuthService;
