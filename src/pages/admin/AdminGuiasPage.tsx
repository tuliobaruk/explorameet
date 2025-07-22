import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { GuiaService, Guia } from "@/services/guiaService";
import { Check, X, User, Mail, Phone, FileText, RefreshCw, ArrowLeft } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminGuiasPage() {
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [guias, setGuias] = useState<Guia[]>([]);
	const [selectedGuia, setSelectedGuia] = useState<Guia | null>(null);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	const { isLoading, isAdmin } = useUser();
	const { notifications } = useNotifications();

	useEffect(() => {
		if (isLoading) return;
		if (!isAdmin()) {
			toast.error("Acesso negado.");
			navigate("/");
		}
	}, [isLoading, isAdmin, navigate]);

	const loadGuiasPendentes = useCallback(async (showLoader = true) => {
		try {
			if (showLoader) setLoadingPage(true);
			else setRefreshing(true);

			const data = await GuiaService.getGuiasPendentes();
			setGuias(data);
		} catch {
			toast.error("Erro ao carregar guias pendentes.");
		} finally {
			if (showLoader) setLoadingPage(false);
			else setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		if (isAdmin()) {
			loadGuiasPendentes();
		}
	}, [isAdmin, loadGuiasPendentes]);

	// Atualizar quando receber notificação de novo guia
	useEffect(() => {
		const novoGuiaNotification = notifications.find(
			(n) => n.tipo === "NOVO_GUIA_CADASTRO" && !n.lida,
		);

		if (novoGuiaNotification && isAdmin()) {
			loadGuiasPendentes(false); // Recarregar sem loader principal
		}
	}, [notifications, isAdmin, loadGuiasPendentes]);

	// Polling a cada 30 segundos para verificar novos guias
	useEffect(() => {
		if (!isAdmin()) return;

		const interval = setInterval(() => {
			if (!document.hidden) {
				// Só atualizar se a página estiver visível
				loadGuiasPendentes(false);
			}
		}, 30000); // 30 segundos

		const handleVisibilityChange = () => {
			if (!document.hidden && isAdmin()) {
				loadGuiasPendentes(false);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [isAdmin, loadGuiasPendentes]);

	const handleViewDetails = (guia: Guia) => {
		setSelectedGuia(guia);
		setShowModal(true);
	};

	const handleApproveGuia = async (guia: Guia) => {
		if (!confirm("Tem certeza que deseja aprovar este guia?")) return;

		setLoading(true);
		try {
			await GuiaService.updateGuiaStatus(guia.id, { cadasturStatus: true });
			setGuias((prev) => prev.filter((g) => g.id !== guia.id));
			toast.success("Guia aprovado com sucesso!");
			setShowModal(false);
		} catch {
			toast.error("Erro ao aprovar guia.");
		} finally {
			setLoading(false);
		}
	};

	const handleRejectGuia = async (guia: Guia) => {
		if (!confirm("Tem certeza que deseja rejeitar este guia? Esta ação pode ser irreversível."))
			return;

		setLoading(true);
		try {
			await GuiaService.updateGuiaStatus(guia.id, { cadasturStatus: false });
			setGuias((prev) => prev.filter((g) => g.id !== guia.id));
			toast.success("Guia rejeitado.");
			setShowModal(false);
		} catch {
			toast.error("Erro ao rejeitar guia.");
		} finally {
			setLoading(false);
		}
	};

	if (loadingPage || isLoading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="admin-guias-container flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-12">
				<Link
					to="/configuracoes"
					className="flex items-center gap-2 font-semibold mb-6 transition-colors hover:underline"
					style={{ color: "var(--marrom-dourado)" }}
				>
					<ArrowLeft size={20} />
					Voltar para o painel do Admin
				</Link>
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
					<h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
						Validação de Guias
					</h1>
					<div className="flex items-center gap-3">
						<button
							onClick={() => loadGuiasPendentes(false)}
							disabled={refreshing}
							className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
							title="Atualizar lista"
						>
							<RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
							Atualizar
						</button>
						<div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-center sm:text-left">
							{guias.length} guia(s) aguardando validação
						</div>
					</div>
				</div>

				{guias.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md border p-8 text-center">
						<div className="text-gray-500 mb-4">
							<User size={48} className="mx-auto mb-4" />
							<h3 className="text-lg font-medium">Nenhum guia pendente</h3>
							<p>Todos os guias foram validados.</p>
						</div>
					</div>
				) : (
					<>
						{/* Desktop Table */}
						<div className="hidden lg:block bg-white rounded-lg shadow-md border overflow-x-auto">
							<table className="w-full text-left">
								<thead className="border-b">
									<tr>
										<th className="p-4">Nome</th>
										<th className="p-4">Email</th>
										<th className="p-4">CPF/CNPJ</th>
										<th className="p-4">Nº Cadastro</th>
										<th className="p-4">Data de Cadastro</th>
										<th className="p-4">Ações</th>
									</tr>
								</thead>
								<tbody>
									{guias.map((guia) => (
										<tr key={guia.id} className="border-b hover:bg-gray-50">
											<td className="p-4 font-medium">{guia.perfil.nome}</td>
											<td className="p-4">{guia.perfil.usuario.email}</td>
											<td className="p-4">{guia.cpf_cnpj}</td>
											<td className="p-4">{guia.num_cadastro}</td>
											<td className="p-4">
												{new Date(guia.createdAt).toLocaleDateString("pt-BR")}
											</td>
											<td className="p-4">
												<div className="flex gap-2">
													<button
														onClick={() => handleViewDetails(guia)}
														className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
													>
														<FileText size={14} className="inline mr-1" />
														Detalhes
													</button>
													<button
														onClick={() => handleApproveGuia(guia)}
														disabled={loading}
														className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
													>
														<Check size={14} className="inline mr-1" />
														Aprovar
													</button>
													<button
														onClick={() => handleRejectGuia(guia)}
														disabled={loading}
														className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
													>
														<X size={14} className="inline mr-1" />
														Rejeitar
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Mobile Cards */}
						<div className="lg:hidden space-y-4">
							{guias.map((guia) => (
								<div key={guia.id} className="bg-white rounded-lg shadow-md border p-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<h3 className="font-semibold text-lg text-gray-900 mb-1">
												{guia.perfil.nome}
											</h3>
											<p className="text-sm text-gray-600 break-all">{guia.perfil.usuario.email}</p>
										</div>
										<span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full whitespace-nowrap">
											Pendente
										</span>
									</div>

									<div className="grid grid-cols-2 gap-3 mb-4 text-sm">
										<div>
											<span className="text-gray-500 block">CPF/CNPJ:</span>
											<span className="font-medium text-gray-900">{guia.cpf_cnpj}</span>
										</div>
										<div>
											<span className="text-gray-500 block">Nº Cadastro:</span>
											<span className="font-medium text-gray-900">{guia.num_cadastro}</span>
										</div>
										<div className="col-span-2">
											<span className="text-gray-500 block">Data de Cadastro:</span>
											<span className="font-medium text-gray-900">
												{new Date(guia.createdAt).toLocaleDateString("pt-BR")}
											</span>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row gap-2">
										<button
											onClick={() => handleViewDetails(guia)}
											className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
										>
											<FileText size={16} />
											Detalhes
										</button>
										<button
											onClick={() => handleApproveGuia(guia)}
											disabled={loading}
											className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
										>
											<Check size={16} />
											Aprovar
										</button>
										<button
											onClick={() => handleRejectGuia(guia)}
											disabled={loading}
											className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
										>
											<X size={16} />
											Rejeitar
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{showModal && selectedGuia && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold" style={{ color: "var(--verde-oliva)" }}>
									Detalhes do Guia
								</h2>
								<button
									onClick={() => setShowModal(false)}
									className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
								>
									<X size={20} />
								</button>
							</div>

							<div className="space-y-6">
								<div className="border rounded-lg p-4">
									<h3 className="font-semibold mb-3 flex items-center">
										<User size={18} className="mr-2" />
										Informações Pessoais
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700">Nome</label>
											<p className="text-gray-900">{selectedGuia.perfil.nome}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700">Celular</label>
											<p className="text-gray-900">{selectedGuia.perfil.celular}</p>
										</div>
									</div>
								</div>

								{/* Informações de conta */}
								<div className="border rounded-lg p-4">
									<h3 className="font-semibold mb-3 flex items-center">
										<Mail size={18} className="mr-2" />
										Informações de Conta
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700">Email</label>
											<p className="text-gray-900">{selectedGuia.perfil.usuario.email}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700">
												Data de Cadastro
											</label>
											<p className="text-gray-900">
												{new Date(selectedGuia.perfil.usuario.createdAt).toLocaleDateString(
													"pt-BR",
												)}
											</p>
										</div>
									</div>
								</div>

								{/* Informações profissionais */}
								<div className="border rounded-lg p-4">
									<h3 className="font-semibold mb-3 flex items-center">
										<FileText size={18} className="mr-2" />
										Informações Profissionais
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
											<p className="text-gray-900">{selectedGuia.cpf_cnpj}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700">
												Número do Cadastro
											</label>
											<p className="text-gray-900">{selectedGuia.num_cadastro}</p>
										</div>
									</div>
								</div>

								{/* Ações */}
								<div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
									<button
										onClick={() => setShowModal(false)}
										className="px-4 py-2 border rounded-lg order-3 sm:order-1"
									>
										Fechar
									</button>
									<button
										onClick={() => handleRejectGuia(selectedGuia)}
										disabled={loading}
										className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 order-2 sm:order-2"
									>
										<X size={16} className="inline mr-1" />
										Rejeitar
									</button>
									<button
										onClick={() => handleApproveGuia(selectedGuia)}
										disabled={loading}
										className="px-4 py-2 text-white rounded-lg disabled:opacity-50 order-1 sm:order-3"
										style={{ backgroundColor: "var(--verde-vibrante)" }}
									>
										<Check size={16} className="inline mr-1" />
										Aprovar Guia
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
