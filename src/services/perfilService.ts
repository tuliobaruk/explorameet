import { apiClient } from "@/api/axiosConfig";

export interface UserProfile {
	id: string;
	nome: string;
	celular: string;
	genero: string;
	idade: number;
	foto: string;
}

export interface PerfilResponse {
	perfil: UserProfile;
}

export class PerfilService {
	static async getMeuPerfil(): Promise<PerfilResponse> {
		const response = await apiClient.get<PerfilResponse>("/perfil/me");
		return response.data;
	}
}

export default PerfilService;
