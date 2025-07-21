import { apiClient } from "@/api/axiosConfig";

export interface Avaliacao {
	id: string;
	nota: number;
	comentario: string;
	createdAt: string;
	cliente: {
		id: string;
		perfil: {
			nome: string;
			foto: string | null;
		};
	};
}

export interface CreateAvaliacaoData {
	id_cliente: string;
	id_passeio: string;
	nota: number;
	comentario?: string;
}

class AvaliacaoService {
	async create(data: CreateAvaliacaoData): Promise<Avaliacao> {
		const response = await apiClient.post<Avaliacao>("/avaliacoes", data);
		return response.data;
	}
}

export default new AvaliacaoService();
