import { useEffect, useState } from "react";
import ClienteService, { ClienteProfile } from "@/services/clienteService";
import { Star } from "lucide-react";
import { Passeio } from "@/services/passeioService";

const StarRating = ({ rating }: { rating: number }) => {
	const totalStars = 5;
	return (
		<div className="flex items-center">
			{[...Array(totalStars)].map((_, index) => (
				<Star
					key={index}
					size={18}
					fill={index < Math.round(rating) ? "var(--amarelo-estrela, #facc15)" : "transparent"}
					style={{
						color: index < Math.round(rating) ? "var(--amarelo-estrela, #facc15)" : "#d1d5db",
					}}
				/>
			))}
		</div>
	);
};

interface AvaliacaoListProps {
	avaliacoes?: Passeio["avaliacoes"];
}

export default function AvaliacaoList({ avaliacoes }: AvaliacaoListProps) {
	const [clientes, setClientes] = useState<Record<string, ClienteProfile>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchClientes = async () => {
			if (!avaliacoes || avaliacoes.length === 0) {
				setLoading(false);
				return;
			}

			const clienteIds = [
				...new Set(avaliacoes.map((a) => a.cliente?.id).filter(Boolean) as string[]),
			];

			if (clienteIds.length === 0) {
				setLoading(false);
				return;
			}

			try {
				const clientePromises = clienteIds.map((id) => ClienteService.getClienteById(id));
				const clientesData = await Promise.all(clientePromises);

				const clientesMap = clientesData.reduce(
					(acc, cliente) => {
						if (cliente && cliente.id) {
							acc[cliente.id] = cliente;
						}
						return acc;
					},
					{} as Record<string, ClienteProfile>,
				);

				setClientes(clientesMap);
			} catch (error) {
				console.error("Erro ao buscar dados dos clientes:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchClientes();
	}, [avaliacoes]);

	if (loading) {
		return <p>Carregando avaliações...</p>;
	}

	if (!avaliacoes || avaliacoes.length === 0) {
		return (
			<div className="bg-white p-8 rounded-lg shadow-sm border text-center">
				<p className="text-gray-600">
					Este passeio ainda não tem avaliações. Seja o primeiro a avaliar!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{avaliacoes.map((avaliacao) => {
				const cliente = avaliacao.cliente ? clientes[avaliacao.cliente.id] : null;
				const nomeAvaliador = cliente?.perfil?.nome || "Anônimo";
				const fotoAvaliador = cliente?.perfil?.foto || null;

				return (
					<div
						key={avaliacao.id}
						className="bg-white p-5 rounded-lg shadow-sm"
						style={{ borderLeft: "4px solid var(--verde-vibrante)" }}
					>
						<div className="flex items-start gap-4">
							<img
								src={
									fotoAvaliador ||
									`https://ui-avatars.com/api/?name=${nomeAvaliador.replace(" ", "+")}&background=898f29&color=fff`
								}
								alt={nomeAvaliador}
								className="w-12 h-12 rounded-full object-cover"
							/>
							<div className="flex-1">
								<div className="flex justify-between items-start mb-2">
									<div>
										<h4 className="font-bold text-gray-800">{nomeAvaliador}</h4>
										<p className="text-sm text-gray-500">
											{new Date(avaliacao.createdAt).toLocaleDateString("pt-BR")}
										</p>
									</div>
									<StarRating rating={avaliacao.nota} />
								</div>
								<p className="text-gray-700 italic">"{avaliacao.comentario}"</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
