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

export const registerStep2ClienteSchema = z.object({
	celular: z
		.string()
		.regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato de celular inválido: (XX) XXXXX-XXXX")
		.min(1, "Celular é obrigatório."),
	genero: z.string().min(1, "Gênero é obrigatório."),
	idade: z.coerce.number().min(18, "Você deve ter pelo menos 18 anos.").max(120, "Idade inválida."),
	foto: z.string().optional().or(z.literal("")),
	cpf: z
		.string()
		.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido: XXX.XXX.XXX-XX")
		.min(1, "CPF é obrigatório."),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "Você deve aceitar os Termos de Serviço.",
	}),
});

export const registerStep2GuiaSchema = z.object({
	celular: z
		.string()
		.regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato de celular inválido: (XX) XXXXX-XXXX")
		.min(1, "Celular é obrigatório."),
	genero: z.string().min(1, "Gênero é obrigatório."),
	idade: z.coerce.number().min(18, "Você deve ter pelo menos 18 anos.").max(120, "Idade inválida."),
	foto: z.string().optional().or(z.literal("")),
	cpfCnpj: z
		.string()
		.regex(
			/^((\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}))$/,
			"Formato de CPF/CNPJ inválido.",
		)
		.min(1, "CPF/CNPJ é obrigatório."),
	numCadastro: z
		.string({ required_error: "Número de Cadastro Cadastur é obrigatório." })
		.regex(/^\d{2}\.\d{6}\.\d{2}-\d{1}$/, "Formato de Cadastur inválido: XX.XXXXXX.XX-X")
		.min(1, "Número de Cadastro Cadastur é obrigatório."),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "Você deve aceitar os Termos de Serviço.",
	}),
});

export const createRegisterStep2Schema = (userType: "CLIENTE" | "GUIA") => {
	return userType === "CLIENTE" ? registerStep2ClienteSchema : registerStep2GuiaSchema;
};

const baseGoogleRegistrationSchema = z.object({
	celular: z
		.string()
		.regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato de celular inválido: (XX) XXXXX-XXXX")
		.min(1, "Celular é obrigatório"),
	genero: z.string().min(1, "Gênero é obrigatório"),
	idade: z.coerce.number().min(16, "Idade mínima é 16 anos").max(120, "Idade máxima é 120 anos"),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "Você deve aceitar os termos de serviço",
	}),
});

const clienteGoogleSchema = baseGoogleRegistrationSchema.extend({
	userType: z.literal("CLIENTE"),
	cpf: z
		.string()
		.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido: XXX.XXX.XXX-XX")
		.min(1, "CPF é obrigatório"),
	cpfCnpj: z.string().optional(),
	numCadastro: z.string().optional(),
});

const guiaGoogleSchema = baseGoogleRegistrationSchema.extend({
	userType: z.literal("GUIA"),
	cpf: z.string().optional(),
	cpfCnpj: z
		.string()
		.regex(
			/^((\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}))$/,
			"Formato de CPF/CNPJ inválido.",
		)
		.min(1, "CPF/CNPJ é obrigatório"),
	numCadastro: z
		.string({ required_error: "Número de Cadastro Cadastur é obrigatório." })
		.regex(/^\d{2}\.\d{6}\.\d{2}-\d{1}$/, "Formato de Cadastur inválido: XX.XXXXXX.XX-X")
		.min(1, "Número de Cadastro Cadastur é obrigatório."),
});

export const completeGoogleRegistrationSchema = z.discriminatedUnion("userType", [
	clienteGoogleSchema,
	guiaGoogleSchema,
]);

export type CompleteGoogleRegistrationData = z.infer<typeof completeGoogleRegistrationSchema>;

export const confirmationSchema = z.object({
	email: z.string().email("Email inválido"),
	code: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
});

export type ConfirmationFormData = z.infer<typeof confirmationSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({
		email: z.string().email("Email inválido"),
		code: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
		newPassword: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const loginSchema = z.object({
	email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
	password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
