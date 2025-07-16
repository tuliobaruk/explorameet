import { apiClient } from "@/api/axiosConfig";

export interface Categoria {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	nome: string;
	descricao: string;
}

class CategoriaService {
	async getAllCategorias(): Promise<Categoria[]> {
		try {
			const response = await apiClient.get("/categorias");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar categorias:", error);
      throw new Error("Não foi possível buscar as categorias.");
		}
	}

	async getCategoriaById(id: string): Promise<Categoria> {
		const response = await apiClient.get<Categoria>(`/categorias/${id}`);
		return response.data;
	}

	async createCategoria(data: { nome: string; descricao: string }): Promise<Categoria> {
		const response = await apiClient.post<Categoria>("/categorias", data);
		return response.data;
	}

	async updateCategoria(id: string, data: { nome: string; descricao: string }): Promise<Categoria> {
		const response = await apiClient.put<Categoria>(`/categorias/${id}`, data);
		return response.data;
	}

	async deleteCategoria(id: string): Promise<void> {
		await apiClient.delete(`/categorias/${id}`);
	}
}

export default new CategoriaService();
