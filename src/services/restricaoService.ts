import { apiClient } from "@/api/axiosConfig";

export interface Restricao {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	descricao: string;
}

class RestricaoService {
	async getAllRestricoes(): Promise<Restricao[]> {
		try {
			const response = await apiClient.get("/restricoes");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar restrições:", error);
			throw new Error("Não foi possível buscar as restrições.");
		}
	}

	async getRestricaoById(id: string): Promise<Restricao> {
		const response = await apiClient.get<Restricao>(`/restricoes/${id}`);
		return response.data;
	}

	async createRestricao(data: { descricao: string }): Promise<Restricao> {
		const response = await apiClient.post<Restricao>("/restricoes", data);
		return response.data;
	}

	async updateRestricao(id: string, data: { descricao: string }): Promise<Restricao> {
		const response = await apiClient.patch<Restricao>(`/restricoes/${id}`, data);
		return response.data;
	}

	async deleteRestricao(id: string): Promise<void> {
		await apiClient.delete(`/restricoes/${id}`);
	}

	async findByDescricao(descricao: string): Promise<Restricao[]> {
		const response = await apiClient.get<Restricao[]>(
			`/restricoes?descricao=${encodeURIComponent(descricao)}`,
		);
		return response.data;
	}
}

export default new RestricaoService();
