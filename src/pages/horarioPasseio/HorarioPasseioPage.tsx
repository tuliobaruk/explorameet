import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import HorarioDisponivelService, {
	CreateHorarioDisponivelData,
	HorarioDisponivel,
} from "@/services/horarioDisponivelService";
import PasseioService, { Passeio } from "@/services/passeioService";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Clock,
	Edit3,
	Image as ImageIcon,
	Plus,
	Save,
	Trash2,
	Users,
	X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/utils";

interface HorarioFormData {
	data: string;
	hora: string;
	vagas_disponiveis: number;
}

export default function HorarioPasseioPage() {
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(true);
	const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
	const [passeio, setPasseio] = useState<Passeio | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingHorario, setEditingHorario] = useState<HorarioDisponivel | null>(null);
	const navigate = useNavigate();
	const { passeioId } = useParams<{ passeioId: string }>();

	const { isAuthenticated, user, isLoading } = useUser();

	const [formData, setFormData] = useState<HorarioFormData>({
		data: "",
		hora: "",
		vagas_disponiveis: 0,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const canManagePasseio = user?.role === "GUIA" || user?.role === "ADMIN";

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated || !canManagePasseio) {
			toast.error("Você não tem permissão para acessar esta página.");
			navigate("/");
		}
	}, [isLoading, isAuthenticated, canManagePasseio, navigate]);

	useEffect(() => {
		const loadData = async () => {
			if (!passeioId || !isAuthenticated || !canManagePasseio) return;

			try {
				setLoadingPage(true);
				const [passeioData, horariosData] = await Promise.all([
					PasseioService.getPasseioById(passeioId),
					HorarioDisponivelService.getHorariosByPasseio(passeioId),
				]);

				setPasseio(passeioData);
				setHorarios(horariosData);
				setFormData((prev) => ({ ...prev, vagas_disponiveis: passeioData.qtd_pessoas || 1 }));
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar dados do passeio");
				navigate("/meus-passeios");
			} finally {
				setLoadingPage(false);
			}
		};

		if (!isLoading) {
			loadData();
		}
	}, [passeioId, isAuthenticated, canManagePasseio, isLoading, navigate]);

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

		if (!formData.data || !formData.hora) {
			newErrors.data_hora = "Data e hora são obrigatórias";
		} else {
			const selectedDate = new Date(`${formData.data}T${formData.hora}`);
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
				data_hora: new Date(`${formData.data}T${formData.hora}`).toISOString(),
				vagas_disponiveis: formData.vagas_disponiveis,
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
			setFormData({ data: "", hora: "", vagas_disponiveis: passeio?.qtd_pessoas || 1 });
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
		const d = new Date(horario.data_hora);
		const pad = (num: number) => num.toString().padStart(2, "0");
		const data = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		const hora = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

		setFormData({
			data,
			hora,
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
		setFormData({ data: "", hora: "", vagas_disponiveis: passeio?.qtd_pessoas || 1 });
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

	if (isLoading || loadingPage) {
		return (
			<div
				className="flex flex-col min-h-screen"
				style={{ backgroundColor: "var(--background-claro)" }}
			>
				<Header />
				<main className="flex-1 flex justify-center items-center">
					<div className="text-center">
						<div
							className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
							style={{ borderColor: "var(--verde-vibrante)", borderTopColor: "transparent" }}
						></div>
						<p className="text-gray-600">Carregando dados do passeio...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!isAuthenticated || !canManagePasseio || !passeio) {
		return null;
	}

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-sm font-semibold mb-4 text-gray-600 hover:text-gray-900 transition-colors"
				>
					<ArrowLeft size={16} />
					Voltar
				</button>

				<div className="bg-white rounded-lg shadow-md border border-[rgba(137,143,41,0.1)] mb-6">
					<div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-4">
						{passeio.imagens && passeio.imagens.length > 0 ? (
							<img
								src={passeio.imagens[0].url_imagem}
								alt={passeio.titulo}
								className="w-full md:w-32 h-32 object-cover rounded-lg border"
							/>
						) : (
							<div className="w-full md:w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
								<ImageIcon size={40} className="text-gray-400" />
							</div>
						)}
						<div className="flex-1">
							<p className="text-sm text-gray-500">Gerenciando horários para</p>
							<h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
								{passeio.titulo}
							</h1>
							<div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
								<span className="flex items-center gap-1.5">
									<Users size={14} /> {passeio.qtd_pessoas || "N/A"} vagas no total
								</span>
								<span className="flex items-center gap-1.5">
									<Clock size={14} /> {passeio.duracao_passeio || "N/A"} min
								</span>
								<span className="flex items-center gap-1.5">
									{formatPrice(passeio.valor) || "N/A"}
								</span>
							</div>
						</div>
						<button
							onClick={handleNewHorario}
							className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 shadow-sm w-full md:w-auto justify-center"
							style={{ backgroundColor: "var(--verde-vibrante)" }}
						>
							<Plus size={18} /> Novo Horário
						</button>
					</div>
				</div>

				{showForm && (
					<div className="bg-white rounded-lg shadow-md border border-[rgba(137,143,41,0.1)] mb-6 animate-fade-in-down">
						<div className="p-6 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
								{editingHorario ? "Editar Horário" : "Adicionar Novo Horário"}
							</h2>
							<button
								onClick={() => {
									setShowForm(false);
									setEditingHorario(null);
								}}
								className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
							>
								<X size={20} />
							</button>
						</div>
						<div className="p-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
											<input
												type="date"
												name="data"
												value={formData.data}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg transition-colors ${errors.data_hora ? "border-red-500" : "border-gray-300 focus:border-verde-vibrante focus:ring-2 focus:ring-green-500/20"}`}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
											<input
												type="time"
												name="hora"
												value={formData.hora}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg transition-colors ${errors.data_hora ? "border-red-500" : "border-gray-300 focus:border-verde-vibrante focus:ring-2 focus:ring-green-500/20"}`}
											/>
										</div>
										{errors.data_hora && (
											<p className="text-red-500 text-sm mt-1 flex items-center gap-1 col-span-2">
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
											className={`w-full px-4 py-3 border rounded-lg transition-colors ${errors.vagas_disponiveis ? "border-red-500" : "border-gray-300 focus:border-verde-vibrante focus:ring-2 focus:ring-green-500/20"}`}
										/>
										{errors.vagas_disponiveis && (
											<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
												<AlertCircle size={14} />
												{errors.vagas_disponiveis}
											</p>
										)}
										<p className="text-xs text-gray-500 mt-1">
											Máximo de vagas para o passeio: {passeio.qtd_pessoas || "N/A"}
										</p>
									</div>
								</div>
								<div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
									<button
										type="button"
										onClick={() => {
											setShowForm(false);
											setEditingHorario(null);
										}}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={loading}
										className="px-6 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 font-medium"
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
												{editingHorario ? "Atualizar Horário" : "Criar Horário"}
											</>
										)}{" "}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				<div className="bg-white rounded-lg shadow-md border border-[rgba(137,143,41,0.1)]">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
							Horários Disponíveis ({horarios.length})
						</h2>
					</div>
					<div className="p-4 md:p-6">
						{horarios.length === 0 ? (
							<div className="text-center py-12">
								<Calendar size={48} className="mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-600">Nenhum horário criado</h3>
								<p className="text-gray-500 mb-4 text-sm">
									Crie o primeiro horário para este passeio clicando no botão acima.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{horarios.map((horario) => (
									<div
										key={horario.id}
										className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors"
									>
										<div className="flex items-center gap-4 mb-3 sm:mb-0">
											<div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
												<Calendar size={18} className="text-gray-500" />
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
										<div className="flex items-center gap-2 self-end sm:self-center">
											<button
												onClick={() => handleEdit(horario)}
												className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
												title="Editar"
											>
												<Edit3 size={16} />
											</button>
											<button
												onClick={() => handleDelete(horario.id)}
												className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
												title="Excluir"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
