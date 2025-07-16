export interface Passeio {
	id: string;
	titulo: string;
	descricao: string;
	duracao_passeio: number;
	valor: number;
	qtd_pessoas: number;
	nivel_dificuldade: number;
	status: StatusPasseio;
	createdAt: string;
	updatedAt: string;
	guia: {
		id: string;
		nome: string;
		avatarUrl?: string;
	};
	imagens: ImagemPasseio[];
	categorias: Categoria[];
	restricoes: Restricao[];
	horariosDisponiveis?: HorarioDisponivel[];
	avaliacoes?: Avaliacao[];
}

export interface ImagemPasseio {
	id: string;
	url_imagem: string;
	descricao: string;
}

export interface Categoria {
	id: string;
	nome: string;
	descricao?: string;
}

export interface Restricao {
	id: string;
	nome: string;
	descricao?: string;
}

export interface HorarioDisponivel {
	id: string;
	data_hora: string;
	vagas_disponiveis: number;
}

export interface Avaliacao {
	id: string;
	nota: number;
	comentario?: string;
	usuario: {
		id: string;
		nome: string;
	};
	createdAt: string;
}

export enum StatusPasseio {
	ATIVO = "ativo",
	SUSPENSO = "suspenso",
	LOTADO = "lotado",
	EM_ANDAMENTO = "em_andamento",
	CONCLUIDO = "concluido",
	CANCELADO = "cancelado",
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export interface PasseioFilters {
	page?: number;
	limit?: number;
	guiaId?: string;
	status?: StatusPasseio;
	categorias?: string;
	disponiveis?: boolean;
}
