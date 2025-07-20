import { apiClient } from "@/api/axiosConfig";

export interface Passeio {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	titulo: string;
	descricao: string;
	duracao_passeio: number;
	valor: string;
	status: string | null;
	qtd_pessoas: number | null;
	nivel_dificuldade: number | null;
	guia: {
		id: string;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
		cpf_cnpj: string;
		num_cadastro: string;
		cadasturStatus: boolean;
		perfil: {
			id: string;
			createdAt: string;
			updatedAt: string;
			deletedAt: string | null;
			nome: string;
			celular: string;
			genero: string;
			idade: number;
			foto: string | null;
		};
	};
	horariosDisponiveis: Array<{
		id: string;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
		data_hora: string;
		vagas_disponiveis: number;
	}>;
	imagens: Array<{
		id: string;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
		url_imagem: string;
		descricao: string;
	}>;
	restricoes: Array<{
		id: string;
		descricao: string;
	}>;
	categorias: Array<{
		id: string;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
		nome: string;
		descricao: string;
	}>;
	mediaAvaliacoes: number;
	quantidadeAvaliacoes: number;
	avaliacoes?: Array<{
		id: string;
		nota: number;
		comentario: string;
		createdAt: string;
		cliente: unknown;
	}>;
}

export interface PasseiosResponse {
	data: Passeio[];
	currentPage: number;
	totalPages: number;
	next: string | null;
	previous: string | null;
}

export interface CreatePasseioData {
	titulo: string;
	descricao: string;
	duracao_passeio: number;
	valor?: number;
	qtd_pessoas?: number;
	nivel_dificuldade?: number;
	categorias?: string;
	restricoes?: string;
	descricoes_imagens?: string[];
}

export interface UpdatePasseioData extends CreatePasseioData {
	imagens_remover?: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	status?: string;
	categorias?: string;
	disponiveis?: boolean;
}

class PasseioService {
	async getAllPasseios(params: PaginationParams = {}): Promise<PasseiosResponse> {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.append("page", params.page.toString());
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.status) queryParams.append("status", params.status);
		if (params.categorias) queryParams.append("categorias", params.categorias);
		if (params.disponiveis) queryParams.append("disponiveis", params.disponiveis.toString());

		const response = await apiClient.get<PasseiosResponse>(`/passeios?${queryParams.toString()}`);
		return response.data;
	}

	async getPasseioById(id: string): Promise<Passeio> {
		try {
			const response = await apiClient.get<Passeio>(`/passeios/${id}`);
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar passeio:", error);
			throw new Error("Não foi possível buscar o passeio.");
		}
	}

	async createPasseio(data: CreatePasseioData, imagens?: File[]): Promise<Passeio> {
		const formData = new FormData();

		// Adicionar dados do passeio
		formData.append("titulo", data.titulo);
		formData.append("descricao", data.descricao);
		formData.append("duracao_passeio", data.duracao_passeio.toString());

		if (data.valor !== undefined) {
			formData.append("valor", data.valor.toString());
		}
		if (data.qtd_pessoas !== undefined) {
			formData.append("qtd_pessoas", data.qtd_pessoas.toString());
		}
		if (data.nivel_dificuldade !== undefined) {
			formData.append("nivel_dificuldade", data.nivel_dificuldade.toString());
		}
		if (data.categorias) {
			formData.append("categorias", data.categorias);
		}
		if (data.restricoes) {
			formData.append("restricoes", data.restricoes);
		}

		// Adicionar descrições das imagens
		if (data.descricoes_imagens && data.descricoes_imagens.length > 0) {
			data.descricoes_imagens.forEach((descricao, index) => {
				formData.append(`descricoes_imagens[${index}]`, descricao);
			});
		}

		// Adicionar arquivos de imagem
		if (imagens && imagens.length > 0) {
			imagens.forEach((imagem) => {
				formData.append("imagens", imagem);
			});
		}

		const response = await apiClient.post<Passeio>("/passeios", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	}

	async updatePasseio(id: string, data: UpdatePasseioData, imagens?: File[]): Promise<Passeio> {
		try {
			const formData = new FormData();

			// Adicionar dados básicos do passeio
			formData.append("titulo", data.titulo);
			formData.append("descricao", data.descricao);
			formData.append("duracao_passeio", data.duracao_passeio.toString());

			if (data.valor !== undefined) {
				formData.append("valor", data.valor.toString());
			}
			if (data.qtd_pessoas !== undefined) {
				formData.append("qtd_pessoas", data.qtd_pessoas.toString());
			}
			if (data.nivel_dificuldade !== undefined) {
				formData.append("nivel_dificuldade", data.nivel_dificuldade.toString());
			}
			if (data.categorias) {
				formData.append("categorias", data.categorias);
			}
			if (data.restricoes) {
				formData.append("restricoes", data.restricoes);
			}

			// Adicionar IDs das imagens a serem removidas
			if (data.imagens_remover) {
				formData.append("imagens_remover", data.imagens_remover);
			}

			// Adicionar descrições das novas imagens
			if (data.descricoes_imagens && data.descricoes_imagens.length > 0) {
				data.descricoes_imagens.forEach((descricao, index) => {
					formData.append(`descricoes_imagens[${index}]`, descricao);
				});
			}

			// Adicionar arquivos de novas imagens
			if (imagens && imagens.length > 0) {
				imagens.forEach((imagem) => {
					formData.append("imagens", imagem);
				});
			}

			const response = await apiClient.put<Passeio>(`/passeios/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (error) {
			console.error("Erro ao atualizar passeio:", error);
			throw new Error("Não foi possível atualizar o passeio.");
		}
	}

	async deletePasseio(id: string): Promise<void> {
		await apiClient.delete(`/passeios/${id}`);
	}

	async getPasseiosDoGuia(): Promise<PasseiosResponse> {
		const response = await apiClient.get<PasseiosResponse>("/passeios/guia");
		return response.data;
	}

	async searchPasseios(
		searchTerm: string,
		params: PaginationParams = {},
	): Promise<PasseiosResponse> {
		// Implementar busca quando o backend suportar
		// Por enquanto, filtrar localmente
		const allPasseios = await this.getAllPasseios(params);

		if (!searchTerm.trim()) {
			return allPasseios;
		}

		const filteredData = allPasseios.data.filter(
			(passeio) =>
				passeio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
				passeio.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
				passeio.guia.perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		return {
			...allPasseios,
			data: filteredData,
		};
	}
}

export default new PasseioService();