import { z } from "zod";

export const registerStep1Schema = z
	.object({
		fullName: z.string().min(3, "Nome completo é obrigatório e deve ter pelo menos 3 caracteres."),
		email: z.string().email("Email inválido.").min(1, "Email é obrigatório."),
		password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
		confirmPassword: z.string().min(8, "A confirmação da senha deve ter pelo menos 8 caracteres."),
		userType: z.enum(["CLIENTE", "GUIA"], {
			errorMap: () => ({ message: "Selecione um tipo de usuário." }),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem.",
		path: ["confirmPassword"],
	});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z.object({
	celular: z
		.string()
		.regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato de celular inválido: (XX) XXXXX-XXXX")
		.min(1, "Celular é obrigatório."),
	genero: z.string().min(1, "Gênero é obrigatório."),
	idade: z.coerce.number().min(18, "Você deve ter pelo menos 18 anos.").max(120, "Idade inválida."),
	foto: z.string().url("URL da foto inválida.").optional().or(z.literal("")),
	cpf: z
		.string()
		.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido: XXX.XXX.XXX-XX")
		.optional(),
	cpfCnpj: z
		.string()
		.regex(
			/^((\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}))$/,
			"Formato de CPF/CNPJ inválido.",
		)
		.optional(),
	numCadastro: z.string().optional(),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "Você deve aceitar os Termos de Serviço.",
	}),
});

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
