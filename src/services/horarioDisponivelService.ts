import { apiClient } from "@/api/axiosConfig";

export interface HorarioDisponivel {
	id: string;
	data_hora: string;
	vagas_disponiveis: number;
	passeio: {
		id: string;
		titulo: string;
		qtd_pessoas?: number;
	};
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface CreateHorarioDisponivelData {
	data_hora: string;
	vagas_disponiveis?: number;
	id_passeio: string;
}

class HorarioDisponivelService {
	async getAllHorarios(): Promise<HorarioDisponivel[]> {
		try {
			const response = await apiClient.get("/horarios-disponiveis");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar horários:", error);
			throw new Error("Não foi possível buscar os horários.");
		}
	}

	async getHorarioById(id: string): Promise<HorarioDisponivel> {
		const response = await apiClient.get<HorarioDisponivel>(`/horarios-disponiveis/${id}`);
		return response.data;
	}

	async getHorariosByPasseio(passeioId: string): Promise<HorarioDisponivel[]> {
		try {
			const response = await apiClient.get(`/horarios-disponiveis?passeioId=${passeioId}`);
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar horários do passeio:", error);
			throw new Error("Não foi possível buscar os horários do passeio.");
		}
	}

	async getHorariosDisponiveis(): Promise<HorarioDisponivel[]> {
		try {
			const response = await apiClient.get("/horarios-disponiveis?disponiveis=true");
			return response.data;
		} catch (error) {
			console.error("Erro ao buscar horários disponíveis:", error);
			throw new Error("Não foi possível buscar os horários disponíveis.");
		}
	}

	async createHorario(data: CreateHorarioDisponivelData): Promise<HorarioDisponivel> {
		const response = await apiClient.post<HorarioDisponivel>("/horarios-disponiveis", data);
		return response.data;
	}

	async updateHorario(
		id: string,
		data: Partial<CreateHorarioDisponivelData>,
	): Promise<HorarioDisponivel> {
		const response = await apiClient.patch<HorarioDisponivel>(`/horarios-disponiveis/${id}`, data);
		return response.data;
	}

	async deleteHorario(id: string): Promise<void> {
		await apiClient.delete(`/horarios-disponiveis/${id}`);
	}
}

export default new HorarioDisponivelService();
