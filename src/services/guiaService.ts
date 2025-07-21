import { apiClient } from "./authService";

export class GuiaService {
	static async getGuiaById(guiaId: string) {
		const response = await apiClient.get(`/guias/${guiaId}`);
		return response.data;
	}
}
