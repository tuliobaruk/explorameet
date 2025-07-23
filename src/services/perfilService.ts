import { apiClient } from "@/api/axiosConfig";

export interface UserProfile {
	sub: string;
	nome: string;
	celular: string;
	genero: string;
	idade: number;
	foto: string;
  guia: unknown;
  cliente: unknown;
}

export interface UpdatePerfilData {
	nome: string;
	celular: string;
	idade: number;
}

export class PerfilService {
	static async getMeuPerfil(): Promise<UserProfile> {
		const response = await apiClient.get<UserProfile>("/perfil/me");
		return response.data;
	}

	static async updateMyProfile(data: UpdatePerfilData, foto?: File): Promise<UserProfile> {
		const formData = new FormData();
		formData.append("nome", data.nome);
		formData.append("celular", data.celular);
		formData.append("idade", data.idade.toString());

		if (foto) {
			formData.append("foto", foto);
		}

		const response = await apiClient.patch<UserProfile>("/perfil/me", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	}
}

export default PerfilService;
