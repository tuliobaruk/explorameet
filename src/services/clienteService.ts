import { apiClient } from "@/api/axiosConfig";

export interface ClienteProfile {
	id: string;
	perfil: {
		nome: string;
		foto: string | null;
	};
}

class ClienteService {
	async getClienteById(id: string): Promise<ClienteProfile> {
		const response = await apiClient.get<ClienteProfile>(`/clientes/${id}`);
		return response.data;
	}
}

export default new ClienteService();
