export enum Genero {
	Masculino = "Masculino",
	Feminino = "Feminino",
	Outro = "Outro",
	PrefiroNaoDizer = "Prefiro não dizer",
}

export interface UserProfile {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	nome: string;
	celular: string;
	genero: string;
	idade: number;
	foto: string | null;
	cliente: Cliente | null;
	guia: Guia | null;
}

export interface Cliente {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	cpf: string;
}

export interface Guia {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	cpf_cnpj: string;
	num_cadastro?: string;
	verificado: boolean;
}

export interface UserProfileResponse {
	user: UserProfile;
	authenticated: boolean;
}
