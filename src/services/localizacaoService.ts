import { apiClient } from "@/api/axiosConfig";

export interface Localizacao {
	id: number;
	cep?: string;
	logradouro?: string;
	bairro?: string;
	cidade?: string;
	estado?: string;
	latitude?: number;
	longitude?: number;
}

export interface CreateLocalizacaoData {
	cep?: string;
	logradouro?: string;
	bairro?: string;
	cidade?: string;
	estado?: string;
	latitude?: number;
	longitude?: number;
}

export interface ViaCepResponse {
	cep: string;
	logradouro: string;
	complemento: string;
	unidade: string;
	bairro: string;
	localidade: string;
	uf: string;
	estado: string;
	regiao: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
	erro?: boolean;
}

export type UpdateLocalizacaoData = Partial<CreateLocalizacaoData>;

class LocalizacaoService {
	static async createLocalizacao(data: CreateLocalizacaoData): Promise<Localizacao> {
		const response = await apiClient.post<Localizacao>("/localizacoes", data);
		return response.data;
	}

	static async getAllLocalizacoes(): Promise<Localizacao[]> {
		const response = await apiClient.get<Localizacao[]>("/localizacoes");
		return response.data;
	}

	static async getLocalizacaoById(id: number): Promise<Localizacao> {
		const response = await apiClient.get<Localizacao>(`/localizacoes/${id}`);
		return response.data;
	}

	static async getLocalizacoesByGuia(guiaId: string): Promise<Localizacao[]> {
		const response = await apiClient.get<Localizacao[]>(`/localizacoes?guiaId=${guiaId}`);
		return response.data;
	}

	static async getLocalizacoesByCidade(cidade: string): Promise<Localizacao[]> {
		const response = await apiClient.get<Localizacao[]>(`/localizacoes?cidade=${cidade}`);
		return response.data;
	}

	static async updateLocalizacao(id: number, data: UpdateLocalizacaoData): Promise<Localizacao> {
		const response = await apiClient.patch<Localizacao>(`/localizacoes/${id}`, data);
		return response.data;
	}

	static async deleteLocalizacao(id: number): Promise<void> {
		await apiClient.delete(`/localizacoes/${id}`);
	}

	// Métodos para integração com ViaCEP
	static async buscarCep(cep: string): Promise<ViaCepResponse | null> {
		try {
			// Remove caracteres não numéricos do CEP
			const cepLimpo = cep.replace(/\D/g, "");
			
			// Verifica se o CEP tem 8 dígitos
			if (cepLimpo.length !== 8) {
				throw new Error("CEP deve ter 8 dígitos");
			}

			const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
			
			if (!response.ok) {
				throw new Error("Erro na requisição ao ViaCEP");
			}

			const data: ViaCepResponse = await response.json();
			
			// Verifica se o CEP foi encontrado
			if (data.erro) {
				throw new Error("CEP não encontrado");
			}

			return data;
		} catch (error) {
			console.error("Erro ao buscar CEP:", error);
			return null;
		}
	}

	static formatarCep(cep: string): string {
		// Remove caracteres não numéricos
		const cepLimpo = cep.replace(/\D/g, "");
		
		// Aplica a máscara 00000-000
		if (cepLimpo.length >= 5) {
			return cepLimpo.replace(/(\d{5})(\d{0,3})/, "$1-$2");
		}
		
		return cepLimpo;
	}
}

export default LocalizacaoService;
