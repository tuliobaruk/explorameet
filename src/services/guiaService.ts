import { apiClient } from "@/api/axiosConfig";

export interface Guia {
  id: string;
  cpf_cnpj: string;
  num_cadastro: string;
  cadasturStatus: boolean;
  createdAt: string;
  updatedAt: string;
  perfil: {
    id: string;
    nome: string;
    celular: string;
    usuario: {
      id: string;
      email: string;
      createdAt: string;
    };
  };
}

export interface UpdateGuiaStatusData {
  cadasturStatus: boolean;
}

export class GuiaService {
	static async getGuiaById(guiaId: string): Promise<Guia> {
		try {
			const response = await apiClient.get(`/guias/${guiaId}`);
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar guia:", error);
			throw new Error("Não foi possível buscar o guia.");
		}
	}

	static async getGuiasPendentes(): Promise<Guia[]> {
		try {
			const response = await apiClient.get("/guias/cadastur");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar guias pendentes:", error);
			throw new Error("Não foi possível buscar os guias pendentes.");
		}
	}

	static async updateGuiaStatus(id: string, data: UpdateGuiaStatusData): Promise<Guia> {
		try {
			const response = await apiClient.patch(`/guias/${id}`, data);
			return response.data;
		} catch (error) {
			console.error("Erro ao atualizar status do guia:", error);
			throw new Error("Não foi possível atualizar o status do guia.");
		}
	}
}
