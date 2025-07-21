import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import SubscriptionService, {
	CreatePlanData,
	UpdatePlanData,
} from "@/services/subscriptionService";
import { Plan } from "@/types/Inscricao";
import { Edit, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminPlansPage.css";

const initialFormData: CreatePlanData = {
	nome: "",
	descricao: "",
	preco: 0,
	duracao_dias: 30,
	role: "CLIENTE",
};

export default function AdminPlansPage() {
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(true);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
	const navigate = useNavigate();

	const { user, isLoading, isAdmin } = useUser();

	const [formData, setFormData] = useState<CreatePlanData>(initialFormData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isLoading) return;
		if (!isAdmin()) {
			toast.error("Acesso negado.");
			navigate("/");
		}
	}, [isLoading, isAdmin, navigate]);

	useEffect(() => {
		const loadPlans = async () => {
			try {
				setLoadingPage(true);
				const plansData = await SubscriptionService.getAllPlans();
				setPlans(plansData);
			} catch (error) {
				toast.error("Erro ao carregar planos.");
			} finally {
				setLoadingPage(false);
			}
		};
		if (isAdmin()) {
			loadPlans();
		}
	}, [isAdmin]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "preco" || name === "duracao_dias" ? parseFloat(value) || 0 : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
		if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
		if (formData.preco <= 0) newErrors.preco = "Preço deve ser maior que 0";
		if (formData.duracao_dias <= 0) newErrors.duracao_dias = "Duração deve ser maior que 0";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			toast.error("Por favor, corrija os erros no formulário.");
			return;
		}
		setLoading(true);
		try {
			if (editingPlan) {
				const dataToUpdate: UpdatePlanData = { ...formData };
				const updatedPlan = await SubscriptionService.updatePlan(editingPlan.id, dataToUpdate);
				setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? updatedPlan : p)));
				toast.success("Plano atualizado com sucesso!");
			} else {
				const newPlan = await SubscriptionService.createPlan(formData);
				setPlans((prev) => [...prev, newPlan]);
				toast.success("Plano criado com sucesso!");
			}
			setShowForm(false);
			setEditingPlan(null);
			setFormData(initialFormData);
		} catch (error) {
			toast.error("Erro ao salvar plano.");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (plan: Plan) => {
		setEditingPlan(plan);
		setFormData({
			nome: plan.nome,
			descricao: plan.descricao,
			preco: Number(plan.preco),
			duracao_dias: plan.duracao_dias,
			role: plan.role,
		});
		setShowForm(true);
	};

	const handleToggleActive = async (plan: Plan) => {
		try {
			const updatedPlan = await SubscriptionService.updatePlan(plan.id, { ativo: !plan.ativo });
			setPlans((prev) => prev.map((p) => (p.id === plan.id ? updatedPlan : p)));
			toast.success(`Plano ${updatedPlan.ativo ? "ativado" : "desativado"} com sucesso!`);
		} catch (error) {
			toast.error("Erro ao alterar status do plano.");
		}
	};

	const handleNewPlan = () => {
		setEditingPlan(null);
		setFormData(initialFormData);
		setShowForm(true);
	};

	if (loadingPage || isLoading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="admin-plans-container flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
						Gerenciar Planos
					</h1>
					<button
						onClick={handleNewPlan}
						className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm"
						style={{ backgroundColor: "var(--verde-vibrante)" }}
					>
						<Plus size={18} /> Novo Plano
					</button>
				</div>

				{showForm && (
					<div className="bg-white rounded-lg shadow-md border mb-6">
						<div className="p-6 border-b flex justify-between items-center">
							<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
								{editingPlan ? "Editar Plano" : "Adicionar Novo Plano"}
							</h2>
							<button
								onClick={() => setShowForm(false)}
								className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
							>
								<X size={20} />
							</button>
						</div>
						<div className="p-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Form fields */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nome do Plano
										</label>
										<input
											type="text"
											name="nome"
											value={formData.nome}
											onChange={handleInputChange}
											className="form-input"
										/>
										{errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Preço (R$)
										</label>
										<input
											type="number"
											name="preco"
											value={formData.preco}
											onChange={handleInputChange}
											className="form-input"
										/>
										{errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Duração (dias)
										</label>
										<input
											type="number"
											name="duracao_dias"
											value={formData.duracao_dias}
											onChange={handleInputChange}
											className="form-input"
										/>
										{errors.duracao_dias && (
											<p className="text-red-500 text-sm mt-1">{errors.duracao_dias}</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Tipo de Usuário
										</label>
										<select
											name="role"
											value={formData.role}
											onChange={handleInputChange}
											className="form-input"
										>
											<option value="CLIENTE">Cliente</option>
											<option value="GUIA">Guia</option>
										</select>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
									<textarea
										name="descricao"
										value={formData.descricao}
										onChange={handleInputChange}
										rows={3}
										className="form-input"
									></textarea>
									{errors.descricao && (
										<p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
									)}
								</div>
								<div className="flex justify-end gap-4 pt-4 border-t">
									<button
										type="button"
										onClick={() => setShowForm(false)}
										className="px-6 py-2 border rounded-lg"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={loading}
										className="form-submit-button px-6 py-2 text-white rounded-lg disabled:opacity-50"
									>
										{loading ? "Salvando..." : "Salvar Plano"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				<div className="bg-white rounded-lg shadow-md border">
					<table className="w-full text-left">
						<thead className="border-b">
							<tr>
								<th className="p-4">Nome</th>
								<th className="p-4">Preço</th>
								<th className="p-4">Duração</th>
								<th className="p-4">Para</th>
								<th className="p-4">Ativo</th>
								<th className="p-4">Ações</th>
							</tr>
						</thead>
						<tbody>
							{plans.map((plan) => (
								<tr key={plan.id} className="border-b hover:bg-gray-50">
									<td className="p-4">{plan.nome}</td>
									<td className="p-4">R$ {Number(plan.preco).toFixed(2)}</td>
									<td className="p-4">{plan.duracao_dias} dias</td>
									<td className="p-4">{plan.role}</td>
									<td className="p-4">
										<label className="switch">
											<input
												type="checkbox"
												checked={plan.ativo}
												onChange={() => handleToggleActive(plan)}
											/>
											<span className="slider"></span>
										</label>
									</td>
									<td className="p-4">
										<button
											onClick={() => handleEdit(plan)}
											className="p-2 text-gray-500 hover:text-blue-600"
										>
											<Edit size={16} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
			<Footer />
		</div>
	);
}
