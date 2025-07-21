import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import { Compass, Clock, Users, Image as ImageIcon, Edit, Trash2, Calendar } from "lucide-react";
import { apiClient } from "@/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDefaultPasseioImage } from "@/utils/utils";

interface HorarioDisponivel {
	id: string;
	data_hora: string;
	vagas_disponiveis: number;
}

interface ImagemPasseio {
	id: string;
	url_imagem: string;
	descricao: string;
}

interface PasseioGuia {
	id: string;
	titulo: string;
	descricao: string;
	duracao_passeio: number;
	valor: string;
	qtd_pessoas: number;
	nivel_dificuldade: number;
	imagens: ImagemPasseio[];
	horariosDisponiveis?: HorarioDisponivel[];
}

export default function GuideOwnActivityList() {
	const { isAuthenticated, isLoading } = useUser();
	const [loading, setLoading] = useState(true);
	const [passeios, setPasseios] = useState<PasseioGuia[]>([]);
	const navigate = useNavigate();

	const fetchPasseios = () => {
		if (!isAuthenticated) return;
		setLoading(true);
		apiClient
			.get("/passeios/guia", { withCredentials: true })
			.then((res) => setPasseios(res.data.data || []))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchPasseios();
	}, [isAuthenticated]);

	const handleDelete = async (passeioId: string) => {
		if (
			window.confirm(
				"Tem certeza que deseja excluir este passeio? Esta ação não pode ser desfeita.",
			)
		) {
			try {
				await apiClient.delete(`/passeios/${passeioId}`);
				toast.success("Passeio excluído com sucesso!");
				fetchPasseios();
			} catch (error) {
				console.error("Erro ao excluir passeio:", error);
				toast.error("Erro ao excluir passeio. Tente novamente.");
			}
		}
	};

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />
			<main className="flex-1 flex flex-col items-center px-2 py-8 md:px-0 pt-24">
				<div className="w-full max-w-4xl">
					<h1 className="text-2xl font-bold mb-6" style={{ color: "var(--verde-oliva)" }}>
						Meus Passeios
					</h1>
					{loading || isLoading ? (
						<div className="flex justify-center items-center py-20 text-gray-600">
							Carregando...
						</div>
					) : passeios.length === 0 ? (
						<div className="flex flex-col items-center py-20 text-gray-500">
							<Compass size={48} className="mb-4" />
							<span>Nenhum passeio cadastrado.</span>
						</div>
					) : (
						<div className="space-y-6">
							{passeios.map((passeio) => (
								<div key={passeio.id} className="bg-white rounded-lg shadow-md border p-6">
									<div className="flex gap-4 items-start mb-4">
										{passeio.imagens && passeio.imagens.length > 0 ? (
											<img
												src={passeio.imagens[0]?.url_imagem || getDefaultPasseioImage()}
												alt={passeio.imagens[0].descricao || passeio.titulo}
												className="w-20 h-20 object-cover rounded-md border"
											/>
										) : (
											<div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md border">
												<ImageIcon size={32} className="text-gray-400" />
											</div>
										)}
										<div className="flex-1 min-w-0">
											<h2
												className="text-xl font-semibold mb-1"
												style={{ color: "var(--verde-oliva)" }}
											>
												{passeio.titulo}
											</h2>
											<p className="text-gray-600 mb-1 line-clamp-2">{passeio.descricao}</p>
											<div className="flex flex-wrap gap-4 text-sm text-gray-500">
												<span className="flex items-center gap-1">
													<Clock size={14} /> {passeio.duracao_passeio} min
												</span>
												<span className="flex items-center gap-1">
													<Users size={14} /> {passeio.qtd_pessoas} pessoas
												</span>
												<span className="flex items-center gap-1">
													Nível {passeio.nivel_dificuldade}/10
												</span>
												<span className="flex items-center gap-1">
													R$ {parseFloat(passeio.valor).toFixed(2).replace(".", ",")}
												</span>
											</div>
										</div>
									</div>
									<div className="mt-2">
										<span className="font-medium text-gray-700">Horários disponíveis:</span>
										{!passeio.horariosDisponiveis || passeio.horariosDisponiveis.length === 0 ? (
											<span className="ml-2 text-gray-400">Nenhum horário cadastrado</span>
										) : (
											<ul className="ml-2 mt-1 space-y-1">
												{passeio.horariosDisponiveis.map((h) => (
													<li key={h.id} className="text-gray-600 text-sm">
														{new Date(h.data_hora).toLocaleString("pt-BR", {
															day: "2-digit",
															month: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})}{" "}
														- {h.vagas_disponiveis} vaga(s)
													</li>
												))}
											</ul>
										)}
									</div>
									<div className="border-t mt-4 pt-4 flex justify-end gap-3">
										<button
											onClick={() => navigate(`/editar-passeio/${passeio.id}`)}
											className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-blue-50 text-blue-600 border-blue-600 hover:border-blue-700"
										>
											<Edit size={14} /> Editar
										</button>
										<button
											onClick={() => navigate(`/gerenciar-horarios/${passeio.id}`)}
											className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-green-50 text-green-600 border-green-600 hover:border-green-700"
										>
											<Calendar size={14} /> Horários
										</button>
										<button
											onClick={() => handleDelete(passeio.id)}
											className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-red-50 text-red-600 border-red-600 hover:border-red-700"
										>
											<Trash2 size={14} /> Deletar
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
