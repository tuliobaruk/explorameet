import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvaliacaoFormData, avaliacaoSchema } from "@/schemas/avaliacaoSchemas";
import { Star } from "lucide-react";
import { useState } from "react";

interface AvaliacaoFormProps {
	onSubmit: (data: AvaliacaoFormData) => void;
	loading: boolean;
}

export default function AvaliacaoForm({ onSubmit, loading }: AvaliacaoFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AvaliacaoFormData>({
		resolver: zodResolver(avaliacaoSchema),
		defaultValues: {
			nota: 0,
			comentario: "",
		},
	});

	const [hoverRating, setHoverRating] = useState(0);
	const currentRating = watch("nota");

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-[rgba(137,143,41,0.1)]"
		>
			<h3 className="text-xl font-bold" style={{ color: "var(--verde-oliva)" }}>
				Deixe sua avaliação
			</h3>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Sua nota *</label>
				<div className="flex items-center gap-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							size={24}
							className="cursor-pointer"
							style={{
								color:
									star <= (hoverRating || currentRating)
										? "var(--amarelo-estrela, #facc15)"
										: "#d1d5db",
							}}
							fill={
								star <= (hoverRating || currentRating)
									? "var(--amarelo-estrela, #facc15)"
									: "transparent"
							}
							onMouseEnter={() => setHoverRating(star)}
							onMouseLeave={() => setHoverRating(0)}
							onClick={() => setValue("nota", star, { shouldValidate: true })}
						/>
					))}
				</div>
				{errors.nota && <p className="text-red-500 text-sm mt-1">{errors.nota.message}</p>}
			</div>
			<div>
				<label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
					Seu comentário
				</label>
				<textarea
					id="comentario"
					rows={4}
					className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-verde-vibrante"
					placeholder="Compartilhe sua experiência..."
					{...register("comentario")}
				></textarea>
				{errors.comentario && (
					<p className="text-red-500 text-sm mt-1">{errors.comentario.message}</p>
				)}
			</div>
			<button
				type="submit"
				disabled={loading}
				className="w-full text-white font-bold py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
				style={{ backgroundColor: "var(--verde-vibrante)" }}
			>
				{loading ? "Enviando..." : "Enviar Avaliação"}
			</button>
		</form>
	);
}
