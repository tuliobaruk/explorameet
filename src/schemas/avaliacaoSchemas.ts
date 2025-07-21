import { z } from "zod";

export const avaliacaoSchema = z.object({
	nota: z.number().min(1, "A nota é obrigatória.").max(5, "A nota máxima é 5."),
	comentario: z
		.string()
		.min(10, "O comentário deve ter pelo menos 10 caracteres.")
		.max(500, "O comentário deve ter no máximo 500 caracteres.")
		.optional()
		.or(z.literal("")),
});

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;
