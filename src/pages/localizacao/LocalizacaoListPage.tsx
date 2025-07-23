import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import LocalizacaoService, { Localizacao } from "@/services/localizacaoService";

export default function LocalizacaoListPage() {
	const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
	const [loading, setLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const navigate = useNavigate();
	const { isAuthenticated, user, isLoading } = useUser();

	const canManageLocalizacao = user?.role === "GUIA" || user?.role === "ADMIN";
	const loadLocalizacoes = useCallback(async () => {
		if (!user || !user.perfil?.guia?.id) return;

		try {
			setLoading(true);
			const data = await LocalizacaoService.getLocalizacoesByGuia(user.perfil.guia.id);
			setLocalizacoes(data);
		} catch (error) {
			console.error("Erro ao carregar localizações:", error);
			toast.error("Erro ao carregar localizações");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated || !canManageLocalizacao) {
			navigate("/");
			if (!isAuthenticated) {
				toast.error("Você precisa estar logado para acessar esta página");
			} else {
				toast.error("Você não tem permissão para acessar esta página");
			}
		}
	}, [isLoading, isAuthenticated, canManageLocalizacao, navigate]);
	console.log(localizacoes);
	useEffect(() => {
		if (isAuthenticated && canManageLocalizacao && user?.sub) {
			loadLocalizacoes();
		}
	}, [isAuthenticated, canManageLocalizacao, user?.sub, loadLocalizacoes]);

	const handleDelete = async (id: number) => {
		if (!confirm("Tem certeza que deseja excluir esta localização?")) {
			return;
		}

		try {
			setDeletingId(id);
			await LocalizacaoService.deleteLocalizacao(id);
			toast.success("Localização excluída com sucesso!");
			await loadLocalizacoes();
		} catch (error) {
			console.error("Erro ao excluir localização:", error);
			toast.error("Erro ao excluir localização");
		} finally {
			setDeletingId(null);
		}
	};

	const formatEndereco = (localizacao: Localizacao) => {
		const partes = [];

		if (localizacao.logradouro) partes.push(localizacao.logradouro);
		if (localizacao.bairro) partes.push(localizacao.bairro);
		if (localizacao.cidade) partes.push(localizacao.cidade);
		if (localizacao.estado) partes.push(localizacao.estado);
		if (localizacao.cep) partes.push(`CEP: ${localizacao.cep}`);

		return partes.length > 0 ? partes.join(", ") : "Endereço não informado";
	};

	if (isLoading) {
		return (
			<div
				className="flex flex-col min-h-screen"
				style={{ backgroundColor: "var(--background-claro)" }}
			>
				<Header />
				<main className="flex-1 flex flex-col items-center px-2 py-8 md:px-0">
					<div className="w-full max-w-4xl">
						<div
							className="bg-white rounded-lg shadow-md overflow-hidden border"
							style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
						>
							<div className="p-4">
								<div className="flex justify-center items-center py-20">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}

	if (!isAuthenticated || !canManageLocalizacao) {
		return null;
	}

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />
			<main className="flex-1 flex flex-col items-center px-2 py-8 md:px-0 pt-24">
				<div className="w-full max-w-4xl">
					<div
						className="bg-white rounded-lg shadow-md overflow-hidden border mb-6"
						style={{
							borderColor: "rgba(137, 143, 41, 0.1)",
							boxShadow:
								"0 4px 6px -1px rgba(137, 143, 41, 0.1), 0 2px 4px -1px rgba(137, 143, 41, 0.06)",
						}}
					>
						<div className="p-4 md:p-6 border-b border-gray-200">
							<div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
								<div className="flex items-center gap-3 md:gap-4">
									<div
										className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
										style={{ backgroundColor: "var(--green-600)" }}
									>
										<MapPin size={20} className="text-white md:hidden" />
										<MapPin size={24} className="text-white hidden md:block" />
									</div>
									<div className="min-w-0 flex-1">
										<h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
											Minhas Localizações
										</h1>
										<p className="text-sm md:text-base text-gray-600 break-words">
											Gerencie as localizações onde você oferece seus passeios
										</p>
									</div>
								</div>
								<Link
									to="/cadastrar-localizacao"
									className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base w-full lg:w-auto flex-shrink-0"
								>
									<Plus size={16} className="md:hidden" />
									<Plus size={18} className="hidden md:block" />
									<span className="whitespace-nowrap">Nova Localização</span>
								</Link>
							</div>
						</div>

						<div className="p-4 md:p-6">
							{loading ? (
								<div className="flex justify-center items-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
								</div>
							) : localizacoes.length === 0 ? (
								<div className="text-center py-8 md:py-12 px-4">
									<MapPin size={40} className="text-gray-400 mx-auto mb-4 md:hidden" />
									<MapPin size={48} className="text-gray-400 mx-auto mb-4 hidden md:block" />
									<h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
										Nenhuma localização cadastrada
									</h3>
									<p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
										Cadastre localizações para começar a criar seus passeios
									</p>
									<Link
										to="/cadastrar-localizacao"
										className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
									>
										<Plus size={16} className="md:hidden" />
										<Plus size={18} className="hidden md:block" />
										<span className="whitespace-nowrap">Cadastrar Primeira Localização</span>
									</Link>
								</div>
							) : (
								<div className="space-y-3 md:space-y-4">
									{localizacoes.map((localizacao) => (
										<div
											key={localizacao.id}
											className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
										>
											<div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between md:space-y-0">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2">
														<MapPin size={16} className="text-green-600 flex-shrink-0 md:hidden" />
														<MapPin size={18} className="text-green-600 flex-shrink-0 hidden md:block" />
														<h3 className="font-medium text-gray-900 text-sm md:text-base break-words">
															{localizacao.cidade && localizacao.estado
																? `${localizacao.cidade}, ${localizacao.estado}`
																: "Localização"}
														</h3>
													</div>
													<p className="text-gray-600 text-xs md:text-sm mb-2 break-words">
														{formatEndereco(localizacao)}
													</p>
													{localizacao.latitude && localizacao.longitude && (
														<p className="text-gray-500 text-xs break-all">
															Coordenadas: {localizacao.latitude}, {localizacao.longitude}
														</p>
													)}
												</div>
												<div className="flex items-center gap-2 md:ml-4 self-end md:self-start flex-shrink-0">
													<Link
														to={`/cadastrar-localizacao?edit=${localizacao.id}`}
														className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
														title="Editar localização"
													>
														<Edit size={14} className="md:hidden" />
														<Edit size={16} className="hidden md:block" />
													</Link>
													<button
														onClick={() => handleDelete(localizacao.id)}
														disabled={deletingId === localizacao.id}
														className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
														title="Excluir localização"
													>
														{deletingId === localizacao.id ? (
															<div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-red-600"></div>
														) : (
															<>
																<Trash2 size={14} className="md:hidden" />
																<Trash2 size={16} className="hidden md:block" />
															</>
														)}
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
