import { Header } from "@/components/Header";
import { useAuthContext, useUser } from "@/hooks/useAuth";
import CategoriaService, { Categoria } from "@/services/categoriaService";
import PasseioService, { CreatePasseioData } from "@/services/passeioService";
import RestricaoService, { Restricao } from "@/services/restricaoService";
import { AlertCircle, Camera, Plus, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sidebar } from "@/components/Sidebar";

interface ImagePreview {
	file: File;
	preview: string;
	description: string;
}

export default function CreatePasseioPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [activePage, setActivePage] = useState("criar-passeio");
	const [loading, setLoading] = useState(false);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [loadingCategorias, setLoadingCategorias] = useState(true);
	const [restricoes, setRestricoes] = useState<Restricao[]>([]);
	const [loadingRestricoes, setLoadingRestricoes] = useState(true);
	const navigate = useNavigate();

	const { isAuthenticated, user, isLoading } = useUser();
	const { logout } = useAuthContext();

	const [formData, setFormData] = useState<CreatePasseioData>({
		titulo: "",
		descricao: "",
		duracao_passeio: 60,
		valor: undefined,
		qtd_pessoas: undefined,
		nivel_dificuldade: 1,
		categorias: "",
	});

	const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
	const [selectedRestricoes, setSelectedRestricoes] = useState<string[]>([]);
	const [images, setImages] = useState<ImagePreview[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const fileInputRef = useRef<HTMLInputElement>(null);

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
		const loadCategorias = async () => {
			try {
				setLoadingCategorias(true);
				const categoriasData = await CategoriaService.getAllCategorias();
				setCategorias(categoriasData || []);
			} catch (error) {
				console.error("Erro ao carregar categorias:", error);
				toast.error("Erro ao carregar categorias");
				setCategorias([]);
			} finally {
				setLoadingCategorias(false);
			}
		};

		if (isAuthenticated && canCreatePasseio) {
			loadCategorias();
		}
	}, [isAuthenticated, canCreatePasseio]);

	useEffect(() => {
		const loadRestricoes = async () => {
			try {
				setLoadingRestricoes(true);
				const restricoesData = await RestricaoService.getAllRestricoes();
				setRestricoes(restricoesData || []);
			} catch (error) {
				console.error("Erro ao carregar restrições:", error);
				toast.error("Erro ao carregar restrições");
				setRestricoes([]);
			} finally {
				setLoadingRestricoes(false);
			}
		};

		if (isAuthenticated && canCreatePasseio) {
			loadRestricoes();
		}
	}, [isAuthenticated, canCreatePasseio]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "duracao_passeio" || name === "qtd_pessoas" || name === "nivel_dificuldade"
					? parseInt(value) || 0
					: name === "valor"
						? parseFloat(value) || undefined
						: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleCategoriaChange = (categoriaId: string) => {
		setSelectedCategorias((prev) => {
			const isSelected = prev.includes(categoriaId);
			const newSelection = isSelected
				? prev.filter((id) => id !== categoriaId)
				: [...prev, categoriaId];

			setFormData((prevData) => ({
				...prevData,
				categorias: newSelection.join(","),
			}));

			return newSelection;
		});
	};

	const handleRestricaoChange = (restricaoId: string) => {
		setSelectedRestricoes((prev) => {
			const isSelected = prev.includes(restricaoId);
			const newSelection = isSelected
				? prev.filter((id) => id !== restricaoId)
				: [...prev, restricaoId];
			return newSelection;
		});
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		if (images.length + files.length > 10) {
			toast.error("Máximo de 10 imagens permitidas");
			return;
		}

		files.forEach((file) => {
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (event) => {
					setImages((prev) => [
						...prev,
						{
							file,
							preview: event.target?.result as string,
							description: "",
						},
					]);
				};
				reader.readAsDataURL(file);
			} else {
				toast.error(`${file.name} não é um arquivo de imagem válido`);
			}
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const updateImageDescription = (index: number, description: string) => {
		setImages((prev) => prev.map((img, i) => (i === index ? { ...img, description } : img)));
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.titulo.trim()) {
			newErrors.titulo = "Título é obrigatório";
		}

		if (!formData.descricao.trim()) {
			newErrors.descricao = "Descrição é obrigatória";
		}

		if (formData.duracao_passeio <= 0) {
			newErrors.duracao_passeio = "Duração deve ser maior que 0";
		}

		if ((formData.nivel_dificuldade ?? 0) < 1 || (formData.nivel_dificuldade ?? 0) > 10) {
			newErrors.nivel_dificuldade = "Nível deve estar entre 1 e 10";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Por favor, corrija os erros no formulário");
			return;
		}

		setLoading(true);

		try {
			const dataToSend = {
				...formData,
				descricoes_imagens: images.map((img) => img.description || ""),
				restricoes: selectedRestricoes.join(","),
			};

			const imagesToSend = images.map((img) => img.file);

			const novoPasseio = await PasseioService.createPasseio(dataToSend, imagesToSend);

			toast.success("Passeio criado com sucesso! Agora vamos criar os horários disponíveis.");

			navigate(`/gerenciar-horarios/${novoPasseio.id}`);
		} catch (error: unknown) {
			console.error("Erro ao criar passeio:", error);
			toast.error(
				"Erro ao criar passeio: " + (error instanceof Error ? error.message : "Erro desconhecido"),
			);
		} finally {
			setLoading(false);
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	if (isLoading) {
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

	if (!isAuthenticated || !canCreatePasseio) {
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
								<div className="flex items-center gap-4">
									<div
										className="w-12 h-12 rounded-full flex items-center justify-center"
										style={{ backgroundColor: "var(--verde-vibrante)" }}
									>
										<Plus size={24} className="text-white" />
									</div>
									<div>
										<h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
											Criar Novo Passeio
										</h1>
										<p className="text-gray-600">
											Compartilhe uma experiência incrível com a comunidade
										</p>
									</div>
								</div>
							</div>

							<div className="p-6">
								<form onSubmit={handleSubmit} className="space-y-8">
									<div className="space-y-6">
										<div
											className="pb-4 border-b"
											style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
										>
											<h3 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
												Informações Básicas
											</h3>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Título do Passeio *
											</label>
											<input
												type="text"
												name="titulo"
												value={formData.titulo}
												onChange={handleInputChange}
												className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
													errors.titulo
														? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
														: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
												}`}
												style={
													!errors.titulo
														? {
																borderColor: "var(--verde-vibrante)",
															}
														: {}
												}
												onFocus={(e) => {
													if (!errors.titulo) {
														e.target.style.borderColor = "var(--verde-vibrante)";
													}
												}}
												onBlur={(e) => {
													if (!errors.titulo) {
														e.target.style.borderColor = "#d1d5db";
													}
												}}
												placeholder="Ex: Trilha na Serra da Cantareira"
											/>
											{errors.titulo && (
												<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
													<AlertCircle size={14} />
													{errors.titulo}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Descrição *
											</label>
											<textarea
												name="descricao"
												value={formData.descricao}
												onChange={handleInputChange}
												rows={4}
												className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none ${
													errors.descricao
														? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
														: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
												}`}
												onFocus={(e) => {
													if (!errors.descricao) {
														e.target.style.borderColor = "var(--verde-vibrante)";
													}
												}}
												onBlur={(e) => {
													if (!errors.descricao) {
														e.target.style.borderColor = "#d1d5db";
													}
												}}
												placeholder="Descreva detalhadamente o passeio, o que os participantes podem esperar..."
											/>
											{errors.descricao && (
												<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
													<AlertCircle size={14} />
													{errors.descricao}
												</p>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Duração (minutos) *
												</label>
												<input
													type="number"
													name="duracao_passeio"
													value={formData.duracao_passeio}
													onChange={handleInputChange}
													min="1"
													className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
														errors.duracao_passeio
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
															: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
													}`}
													onFocus={(e) => {
														if (!errors.duracao_passeio) {
															e.target.style.borderColor = "var(--verde-vibrante)";
														}
													}}
													onBlur={(e) => {
														if (!errors.duracao_passeio) {
															e.target.style.borderColor = "#d1d5db";
														}
													}}
												/>
												{errors.duracao_passeio && (
													<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
														<AlertCircle size={14} />
														{errors.duracao_passeio}
													</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Valor (R$)
												</label>
												<input
													type="number"
													name="valor"
													value={formData.valor || ""}
													onChange={handleInputChange}
													min="0"
													step="0.01"
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
													onFocus={(e) => (e.target.style.borderColor = "var(--verde-vibrante)")}
													onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
													placeholder="0.00"
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Máx. Pessoas
												</label>
												<input
													type="number"
													name="qtd_pessoas"
													value={formData.qtd_pessoas || ""}
													onChange={handleInputChange}
													min="1"
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
													onFocus={(e) => (e.target.style.borderColor = "var(--verde-vibrante)")}
													onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Nível (1-10) *
												</label>
												<select
													name="nivel_dificuldade"
													value={formData.nivel_dificuldade}
													onChange={handleInputChange}
													className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
														errors.nivel_dificuldade
															? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
															: "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20"
													}`}
													onFocus={(e) => {
														if (!errors.nivel_dificuldade) {
															e.target.style.borderColor = "var(--verde-vibrante)";
														}
													}}
													onBlur={(e) => {
														if (!errors.nivel_dificuldade) {
															e.target.style.borderColor = "#d1d5db";
														}
													}}
												>
													{[...Array(10)].map((_, i) => (
														<option key={i + 1} value={i + 1}>
															{i + 1} -{" "}
															{i + 1 <= 3
																? "Fácil"
																: i + 1 <= 6
																	? "Moderado"
																	: i + 1 <= 8
																		? "Difícil"
																		: "Extremo"}
														</option>
													))}
												</select>
												{errors.nivel_dificuldade && (
													<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
														<AlertCircle size={14} />
														{errors.nivel_dificuldade}
													</p>
												)}
											</div>
										</div>
									</div>

									<div className="space-y-6">
										<div
											className="pb-4 border-b"
											style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
										>
											<h3 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
												Categorias
											</h3>
										</div>
										{loadingCategorias ? (
											<div className="flex justify-center py-8">
												<div className="text-gray-500">Carregando categorias...</div>
											</div>
										) : (
											<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
												{categorias?.map((categoria) => (
													<label
														key={categoria.id}
														className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200"
														title={categoria.descricao}
														onMouseEnter={(e) => {
															e.currentTarget.style.backgroundColor = "rgba(130, 181, 91, 0.05)";
															e.currentTarget.style.borderColor = "var(--verde-vibrante)";
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.backgroundColor = "transparent";
															e.currentTarget.style.borderColor = "#e5e7eb";
														}}
													>
														<input
															type="checkbox"
															checked={selectedCategorias.includes(categoria.id)}
															onChange={() => handleCategoriaChange(categoria.id)}
															className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-green-500/20 transition-colors duration-200"
															style={{ accentColor: "var(--verde-vibrante)" }}
														/>
														<div className="flex-1">
															<span className="text-sm text-gray-700 font-medium block">
																{categoria.nome}
															</span>
															{categoria.descricao && (
																<span className="text-xs text-gray-500 block mt-1">
																	{categoria.descricao}
																</span>
															)}
														</div>
													</label>
												))}
											</div>
										)}
									</div>

									<div className="space-y-6">
										<div
											className="pb-4 border-b"
											style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
										>
											<h3 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
												Restrições
											</h3>
											<p className="text-sm text-gray-600 mt-1">
												Selecione as restrições que se aplicam ao seu passeio
											</p>
										</div>
										{loadingRestricoes ? (
											<div className="flex justify-center py-8">
												<div className="text-gray-500">Carregando restrições...</div>
											</div>
										) : restricoes && restricoes.length === 0 ? (
											<div className="flex justify-center py-8">
												<div className="text-gray-500">Nenhuma restrição disponível</div>
											</div>
										) : (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{restricoes?.map((restricao) => (
													<label
														key={restricao.id}
														className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-yellow-300 transition-all duration-200"
														onMouseEnter={(e) => {
															e.currentTarget.style.backgroundColor = "rgba(140, 116, 45, 0.05)";
															e.currentTarget.style.borderColor = "var(--marrom-dourado)";
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.backgroundColor = "transparent";
															e.currentTarget.style.borderColor = "#e5e7eb";
														}}
													>
														<input
															type="checkbox"
															checked={selectedRestricoes.includes(restricao.id)}
															onChange={() => handleRestricaoChange(restricao.id)}
															className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-yellow-500/20 transition-colors duration-200 mt-0.5"
															style={{ accentColor: "var(--marrom-dourado)" }}
														/>
														<div className="flex-1">
															<span className="text-sm text-gray-700 font-medium block leading-relaxed">
																{restricao.descricao}
															</span>
														</div>
													</label>
												))}
											</div>
										)}
									</div>

									<div className="space-y-6">
										<div
											className="pb-4 border-b"
											style={{ borderColor: "rgba(137, 143, 41, 0.1)" }}
										>
											<h3 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
												Imagens do Passeio
											</h3>
										</div>

										<div
											className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-200 cursor-pointer"
											onMouseEnter={(e) => {
												e.currentTarget.style.borderColor = "var(--verde-vibrante)";
												e.currentTarget.style.backgroundColor = "rgba(130, 181, 91, 0.02)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.borderColor = "#d1d5db";
												e.currentTarget.style.backgroundColor = "transparent";
											}}
											onClick={() => fileInputRef.current?.click()}
										>
											<input
												ref={fileInputRef}
												type="file"
												multiple
												accept="image/*"
												onChange={handleImageUpload}
												className="hidden"
											/>
											<Camera size={48} className="mx-auto text-gray-400 mb-4" />
											<p className="text-gray-600 mb-4 text-sm">
												Adicione até 10 imagens do seu passeio
											</p>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													fileInputRef.current?.click();
												}}
												className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 hover:opacity-90 shadow-sm"
												style={{ backgroundColor: "var(--verde-vibrante)" }}
											>
												<Upload size={18} />
												Escolher Imagens
											</button>
										</div>

										{images.length > 0 && (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{images.map((image, index) => (
													<div
														key={index}
														className="relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
													>
														<img
															src={image.preview}
															alt={`Preview ${index + 1}`}
															className="w-full h-48 object-cover"
														/>
														<button
															type="button"
															onClick={() => removeImage(index)}
															className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md"
														>
															<X size={16} />
														</button>
														<div className="p-3">
															<input
																type="text"
																placeholder="Descrição da imagem..."
																value={image.description}
																onChange={(e) => updateImageDescription(index, e.target.value)}
																className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
																onFocus={(e) =>
																	(e.target.style.borderColor = "var(--verde-vibrante)")
																}
																onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
															/>
														</div>
													</div>
												))}
											</div>
										)}
									</div>

									<div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
										<button
											type="button"
											onClick={() => navigate("/")}
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
													Criando...
												</>
											) : (
												<>
													<Plus size={18} />
													Criar Passeio
												</>
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
