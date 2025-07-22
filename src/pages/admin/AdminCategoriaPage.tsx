import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import CategoriaService, { Categoria } from "@/services/categoriaService";
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CreateCategoriaData {
	nome: string;
	descricao: string;
}

const initialFormData: CreateCategoriaData = {
	nome: "",
	descricao: "",
};

export default function AdminCategoriaPage() {
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(true);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
	const navigate = useNavigate();

	const { isLoading, isAdmin } = useUser();

	const [formData, setFormData] = useState<CreateCategoriaData>(initialFormData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isLoading) return;
		if (!isAdmin()) {
			toast.error("Acesso negado.");
			navigate("/");
		}
	}, [isLoading, isAdmin, navigate]);

	useEffect(() => {
		const loadCategorias = async () => {
			try {
				setLoadingPage(true);
				const data = await CategoriaService.getAllCategorias();
				setCategorias(data);
			} catch {
				toast.error("Erro ao carregar categorias.");
			} finally {
				setLoadingPage(false);
			}
		};
		if (isAdmin()) {
			loadCategorias();
		}
	}, [isAdmin]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
		if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
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
			let savedCategoria: Categoria;

			if (editingCategoria) {
				savedCategoria = await CategoriaService.updateCategoria(editingCategoria.id, formData);
				setCategorias((prev) =>
					prev.map((c) => (c.id === editingCategoria.id ? savedCategoria : c)),
				);
				toast.success("Categoria atualizada com sucesso!");
			} else {
				savedCategoria = await CategoriaService.createCategoria(formData);
				setCategorias((prev) => [...prev, savedCategoria]);
				toast.success("Categoria criada com sucesso!");
			}

			setShowForm(false);
			setEditingCategoria(null);
			setFormData(initialFormData);
		} catch {
			toast.error("Erro ao salvar categoria.");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (categoria: Categoria) => {
		setEditingCategoria(categoria);
		setFormData({
			nome: categoria.nome,
			descricao: categoria.descricao,
		});
		setShowForm(true);
	};

	const handleDelete = async (categoria: Categoria) => {
		if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

		try {
			await CategoriaService.deleteCategoria(categoria.id);
			setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
			toast.success("Categoria excluída com sucesso!");
		} catch {
			toast.error("Erro ao excluir categoria.");
		}
	};

	const handleNewCategoria = () => {
		setEditingCategoria(null);
		setFormData(initialFormData);
		setShowForm(true);
	};

	if (loadingPage || isLoading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="admin-categoria-container flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
				<Link
					to="/configuracoes"
					className="flex items-center gap-2 font-semibold mb-6 transition-colors hover:underline"
					style={{ color: "var(--marrom-dourado)" }}
				>
					<ArrowLeft size={20} />
					Voltar para o painel do Admin
				</Link>
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
						Gerenciar Categorias
					</h1>
					<button
						onClick={handleNewCategoria}
						className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm"
						style={{ backgroundColor: "var(--verde-vibrante)" }}
					>
						<Plus size={18} /> Nova Categoria
					</button>
				</div>

				{showForm && (
					<div className="bg-white rounded-lg shadow-md border mb-6">
						<div className="p-6 border-b flex justify-between items-center">
							<h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
								{editingCategoria ? "Editar Categoria" : "Adicionar Nova Categoria"}
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
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nome da Categoria
										</label>
										<input
											type="text"
											name="nome"
											value={formData.nome}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
											placeholder="Ex: Atividades Aquáticas"
										/>
										{errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
									<textarea
										name="descricao"
										value={formData.descricao}
										onChange={handleInputChange}
										rows={3}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
										placeholder="Ex: Foco em atividades na água integradas a trilhas ou ambientes naturais"
									/>
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
										className="px-6 py-2 text-white rounded-lg disabled:opacity-50"
										style={{ backgroundColor: "var(--verde-vibrante)" }}
									>
										{loading ? "Salvando..." : "Salvar Categoria"}
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
								<th className="p-4">Descrição</th>
								<th className="p-4">Data de Criação</th>
								<th className="p-4">Ações</th>
							</tr>
						</thead>
						<tbody>
							{categorias.map((categoria) => (
								<tr key={categoria.id} className="border-b hover:bg-gray-50">
									<td className="p-4 font-medium">{categoria.nome}</td>
									<td className="p-4">{categoria.descricao}</td>
									<td className="p-4">
										{new Date(categoria.createdAt).toLocaleDateString("pt-BR")}
									</td>
									<td className="p-4">
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(categoria)}
												className="p-2 text-gray-500 hover:text-blue-600"
											>
												<Edit size={16} />
											</button>
											<button
												onClick={() => handleDelete(categoria)}
												className="p-2 text-gray-500 hover:text-red-600"
											>
												<X size={16} />
											</button>
										</div>
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
