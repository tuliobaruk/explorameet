import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useAuthContext, useUser } from "@/hooks/useAuth";
import HorarioDisponivelService, {
	CreateHorarioDisponivelData,
	HorarioDisponivel,
} from "@/services/horarioDisponivelService";
import PasseioService, { Passeio } from "@/services/passeioService";
import { AlertCircle, Calendar, Clock, Edit3, Plus, Save, Trash2, Users, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface HorarioFormData {
	data_hora: string;
	vagas_disponiveis: number;
}

export default function HorarioPasseioPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [activePage, setActivePage] = useState("gerenciar-horarios");
	const [loading, setLoading] = useState(false);
	const [loadingHorarios, setLoadingHorarios] = useState(true);
	const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
	const [passeio, setPasseio] = useState<Passeio | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingHorario, setEditingHorario] = useState<HorarioDisponivel | null>(null);
	const navigate = useNavigate();
	const { passeioId } = useParams<{ passeioId: string }>();

	const { isAuthenticated, user, isLoading } = useUser();
	const { logout } = useAuthContext();

	const [formData, setFormData] = useState<HorarioFormData>({
		data_hora: "",
		vagas_disponiveis: 0,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const canCreatePasseio = user?.role === "GUIA" || user?.role === "ADMIN";

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated || !canCreatePasseio) {
			navigate("/");
			if (!isAuthenticated) {
				toast.error("Você precisa estar logado para acessar esta página");
			} else {
				toast.error("Você não tem permissão para acessar esta página");
			}
		}
	}, [isLoading, isAuthenticated, canCreatePasseio, navigate]);

	useEffect(() => {
		const loadData = async () => {
			if (!passeioId || !isAuthenticated || !canCreatePasseio) return;

			try {
				setLoadingHorarios(true);

				const passeioData = await PasseioService.getPasseioById(passeioId);
				setPasseio(passeioData);

				setFormData((prev) => ({
					...prev,
					vagas_disponiveis: passeioData.qtd_pessoas || 1,
				}));

				const horariosData = await HorarioDisponivelService.getHorariosByPasseio(passeioId);
				setHorarios(horariosData);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar dados do passeio");
			} finally {
				setLoadingHorarios(false);
			}
		};

		loadData();
	}, [passeioId, isAuthenticated, canCreatePasseio]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "vagas_disponiveis" ? parseInt(value) || 0 : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.data_hora) {
			newErrors.data_hora = "Data e hora são obrigatórias";
		} else {
			const selectedDate = new Date(formData.data_hora);
			const now = new Date();
			if (selectedDate <= now) {
				newErrors.data_hora = "Data e hora devem ser futuras";
			}
		}

		if (formData.vagas_disponiveis <= 0) {
			newErrors.vagas_disponiveis = "Número de vagas deve ser maior que 0";
		}

		if (passeio?.qtd_pessoas && formData.vagas_disponiveis > passeio.qtd_pessoas) {
			newErrors.vagas_disponiveis = `Máximo de ${passeio.qtd_pessoas} vagas`;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm() || !passeioId) {
			toast.error("Por favor, corrija os erros no formulário");
			return;
		}

		setLoading(true);

		try {
			const dataToSend: CreateHorarioDisponivelData = {
				...formData,
				id_passeio: passeioId,
			};

			if (editingHorario) {
				const updatedHorario = await HorarioDisponivelService.updateHorario(
					editingHorario.id,
					dataToSend,
				);
				setHorarios((prev) => prev.map((h) => (h.id === editingHorario.id ? updatedHorario : h)));
				toast.success("Horário atualizado com sucesso!");
				setEditingHorario(null);
			} else {
				const novoHorario = await HorarioDisponivelService.createHorario(dataToSend);
				setHorarios((prev) => [...prev, novoHorario]);
				toast.success("Horário criado com sucesso!");
			}

			setFormData({
				data_hora: "",
				vagas_disponiveis: passeio?.qtd_pessoas || 1,
			});
			setShowForm(false);
		} catch (error) {
			console.error("Erro ao salvar horário:", error);
			toast.error("Erro ao salvar horário. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (horario: HorarioDisponivel) => {
		setEditingHorario(horario);
		setFormData({
			data_hora: new Date(horario.data_hora).toISOString().slice(0, 16),
			vagas_disponiveis: horario.vagas_disponiveis,
		});
		setShowForm(true);
	};

	const handleDelete = async (horarioId: string) => {
		if (!confirm("Tem certeza que deseja excluir este horário?")) return;

		try {
			await HorarioDisponivelService.deleteHorario(horarioId);
			setHorarios((prev) => prev.filter((h) => h.id !== horarioId));
			toast.success("Horário excluído com sucesso!");
		} catch (error) {
			console.error("Erro ao excluir horário:", error);
			toast.error("Erro ao excluir horário.");
		}
	};

	const handleNewHorario = () => {
		setEditingHorario(null);
		setFormData({
			data_hora: "",
			vagas_disponiveis: passeio?.qtd_pessoas || 1,
		});
		setShowForm(true);
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	if (isLoading || loadingHorarios) {
		return (
			<div
				className="flex flex-col min-h-screen"
				style={{ backgroundColor: "var(--background-claro)" }}
			>
				<Header isSidebarOpen={false} toggleSidebar={() => {}} />
				<div className="flex flex-1">
					<main className="flex-1 p-4 lg:p-6">
						<div className="max-w-4xl mx-auto">
							<div
								className="bg-white rounded-lg shadow-md overflow-hidden border"
								style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
							>
								<div className="p-4">
									<div className="flex justify-center items-center py-20">
										<div className="text-center">
											<div
												className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
												style={{
													borderColor: "var(--verde-vibrante)",
													borderTopColor: "transparent",
												}}
											></div>
											<p className="text-gray-600">Carregando...</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || !canCreatePasseio || !passeio) {
		return null;
	}

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

			<div className="flex flex-1 relative">
				<Sidebar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
					activePage={activePage}
					setActivePage={setActivePage}
					isAuthenticated={isAuthenticated}
					canCreatePasseio={canCreatePasseio}
					logout={logout}
				/>
				<main
					className={`
					flex-1 p-4 lg:p-6 
					transition-all duration-300 ease-in-out
					${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}
				`}
				>
					<div className="max-w-4xl mx-auto">
						<div
							className="bg-white rounded-lg shadow-md overflow-hidden border mb-6"
							style={{
								borderColor: "rgba(137, 143, 41, 0.1)",
								boxShadow:
									"0 4px 6px -1px rgba(137, 143, 41, 0.1), 0 2px 4px -1px rgba(137, 143, 41, 0.06)",
							}}
						>
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div
											className="w-12 h-12 rounded-full flex items-center justify-center"
											style={{ backgroundColor: "var(--verde-vibrante)" }}
										>
											<Clock size={24} className="text-white" />
										</div>
										<div>
											<h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
												Gerenciar Horários
											</h1>
											<p className="text-gray-600">{passeio.titulo}</p>
										</div>
									</div>
									<button
										onClick={handleNewHorario}
										className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200 hover:opacity-90 shadow-sm"
										style={{ backgroundColor: "var(--verde-vibrante)" }}
									>
										<Plus size={18} />
										Novo Horário
									</button>
								</div>
							</div>

							<div className="p-6 bg-gray-50">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
									<div className="flex items-center gap-2">
										<Users size={16} style={{ color: "var(--verde-oliva)" }} />
										<span>Máx. {passeio.qtd_pessoas || "N/A"} pessoas</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock size={16} style={{ color: "var(--verde-oliva)" }} />
										<span>{passeio.duracao_passeio || "N/A"} minutos</span>
									</div>
									<div className="flex items-center gap-2">
										<Calendar size={16} style={{ color: "var(--verde-oliva)" }} />
										<span>{horarios.length} horário(s) criado(s)</span>
									</div>
								</div>
							</div>
						</div>

						{showForm && (
							<div
								className="bg-white rounded-lg shadow-md overflow-hidden border mb-6"
								style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
							>
								<div className="p-6 border-b border-gray-200">
									<div className="flex items-center justify-between">
										<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
											{editingHorario ? "Editar Horário" : "Novo Horário"}
										</h2>
										<button
											onClick={() => {
												setShowForm(false);
												setEditingHorario(null);
											}}
											className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											<X size={20} />
										</button>
									</div>
								</div>

								<div className="p-6">
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Data e Hora *
												</label>
												<input
													type="datetime-local"
													name="data_hora"
													value={formData.data_hora}
													onChange={handleInputChange}
													className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
														errors.data_hora
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
															: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
													}`}
													onFocus={(e) => {
														if (!errors.data_hora) {
															e.target.style.borderColor = "var(--verde-vibrante)";
														}
													}}
													onBlur={(e) => {
														if (!errors.data_hora) {
															e.target.style.borderColor = "#d1d5db";
														}
													}}
												/>
												{errors.data_hora && (
													<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
														<AlertCircle size={14} />
														{errors.data_hora}
													</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Vagas Disponíveis *
												</label>
												<input
													type="number"
													name="vagas_disponiveis"
													value={formData.vagas_disponiveis}
													onChange={handleInputChange}
													min="1"
													max={passeio.qtd_pessoas || 100}
													className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
														errors.vagas_disponiveis
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
															: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
													}`}
													onFocus={(e) => {
														if (!errors.vagas_disponiveis) {
															e.target.style.borderColor = "var(--verde-vibrante)";
														}
													}}
													onBlur={(e) => {
														if (!errors.vagas_disponiveis) {
															e.target.style.borderColor = "#d1d5db";
														}
													}}
												/>
												{errors.vagas_disponiveis && (
													<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
														<AlertCircle size={14} />
														{errors.vagas_disponiveis}
													</p>
												)}
												<p className="text-xs text-gray-500 mt-1">
													Máximo: {passeio.qtd_pessoas || "N/A"} vagas
												</p>
											</div>
										</div>

										<div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
											<button
												type="button"
												onClick={() => {
													setShowForm(false);
													setEditingHorario(null);
												}}
												className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
											>
												Cancelar
											</button>
											<button
												type="submit"
												disabled={loading}
												className="px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium hover:opacity-90 shadow-sm"
												style={{ backgroundColor: "var(--verde-vibrante)" }}
											>
												{loading ? (
													<>
														<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
														Salvando...
													</>
												) : (
													<>
														<Save size={18} />
														{editingHorario ? "Atualizar" : "Criar"} Horário
													</>
												)}
											</button>
										</div>
									</form>
								</div>
							</div>
						)}

						<div
							className="bg-white rounded-lg shadow-md overflow-hidden border"
							style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
						>
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
									Horários Disponíveis
								</h2>
							</div>

							<div className="p-6">
								{horarios.length === 0 ? (
									<div className="text-center py-12">
										<Clock size={48} className="mx-auto text-gray-400 mb-4" />
										<h3 className="text-lg font-medium text-gray-600 mb-2">
											Nenhum horário criado
										</h3>
										<p className="text-gray-500 mb-4">
											Crie o primeiro horário para que os participantes possam se inscrever
										</p>
										<button
											onClick={handleNewHorario}
											className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200 hover:opacity-90"
											style={{ backgroundColor: "var(--verde-vibrante)" }}
										>
											<Plus size={18} />
											Criar Primeiro Horário
										</button>
									</div>
								) : (
									<div className="space-y-4">
										{horarios.map((horario) => (
											<div
												key={horario.id}
												className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-all duration-200"
											>
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
														<Calendar size={20} style={{ color: "var(--verde-oliva)" }} />
													</div>
													<div>
														<p className="font-medium text-gray-900">
															{formatDateTime(horario.data_hora)}
														</p>
														<p className="text-sm text-gray-600">
															{horario.vagas_disponiveis} vagas disponíveis
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleEdit(horario)}
														className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
														title="Editar"
													>
														<Edit3 size={18} />
													</button>
													<button
														onClick={() => handleDelete(horario.id)}
														className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
														title="Excluir"
													>
														<Trash2 size={18} />
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-between mt-6">
							<button
								onClick={() => navigate("/explorar")}
								className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
							>
								Voltar ao Feed
							</button>
							{horarios.length > 0 && (
								<button
									onClick={() => navigate("/meus-passeios")}
									className="px-6 py-3 text-white rounded-lg transition-all duration-200 hover:opacity-90 shadow-sm font-medium"
									style={{ backgroundColor: "var(--verde-vibrante)" }}
								>
									Ver Meus Passeios
								</button>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
