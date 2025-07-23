import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import LocalizacaoService, { CreateLocalizacaoData } from "@/services/localizacaoService";
import { AlertCircle, MapPin, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateLocalizacaoPage() {
	const [loading, setLoading] = useState(false);
	const [loadingCep, setLoadingCep] = useState(false);
	const [loadingData, setLoadingData] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const editId = searchParams.get('edit');
	const isEditing = !!editId;

	const { isAuthenticated, user, isLoading } = useUser();

	const [formData, setFormData] = useState<CreateLocalizacaoData>({
		cep: "",
		logradouro: "",
		bairro: "",
		cidade: "",
		estado: "",
		latitude: undefined,
		longitude: undefined,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const canCreateLocalizacao = user?.role === "GUIA" || user?.role === "ADMIN";

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated || !canCreateLocalizacao) {
			navigate("/");
			if (!isAuthenticated) {
				toast.error("Você precisa estar logado para acessar esta página");
			} else {
				toast.error("Você não tem permissão para acessar esta página");
			}
		}
	}, [isLoading, isAuthenticated, canCreateLocalizacao, navigate]);

	useEffect(() => {
		const loadLocalizacaoData = async (id: number) => {
			try {
				setLoadingData(true);
				const localizacao = await LocalizacaoService.getLocalizacaoById(id);
				setFormData({
					cep: localizacao.cep || "",
					logradouro: localizacao.logradouro || "",
					bairro: localizacao.bairro || "",
					cidade: localizacao.cidade || "",
					estado: localizacao.estado || "",
					latitude: localizacao.latitude,
					longitude: localizacao.longitude,
				});
			} catch (error) {
				console.error("Erro ao carregar localização:", error);
				toast.error("Erro ao carregar dados da localização");
				navigate("/minhas-localizacoes");
			} finally {
				setLoadingData(false);
			}
		};

		if (isEditing && editId) {
			loadLocalizacaoData(parseInt(editId));
		}
	}, [isEditing, editId, navigate]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;

		if (name === "cep") {
			const cepFormatado = LocalizacaoService.formatarCep(value);
			setFormData((prev) => ({
				...prev,
				[name]: cepFormatado,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]:
					name === "latitude" || name === "longitude"
						? value === "" ? undefined : parseFloat(value)
						: value,
			}));
		}

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const buscarEnderecoPorCep = async (cep: string) => {
		if (!cep || cep.replace(/\D/g, "").length !== 8) {
			return;
		}

		setLoadingCep(true);
		try {
			const endereco = await LocalizacaoService.buscarCep(cep);
			
			if (endereco) {
				setFormData((prev) => ({
					...prev,
					cep: endereco.cep,
					logradouro: endereco.logradouro || prev.logradouro,
					bairro: endereco.bairro || prev.bairro,
					cidade: endereco.localidade || prev.cidade,
					estado: endereco.uf || prev.estado,
				}));
				
				setErrors((prev) => {
					const newErrors = { ...prev };
					if (endereco.localidade) delete newErrors.cidade;
					if (endereco.uf) delete newErrors.estado;
					if (endereco.cep) delete newErrors.cep;
					return newErrors;
				});
				
				toast.success("Endereço encontrado e preenchido automaticamente!");
			} else {
				toast.error("CEP não encontrado. Verifique se está correto.");
			}
		} catch (error) {
			console.error("Erro ao buscar CEP:", error);
			toast.error("Erro ao buscar CEP. Tente novamente.");
		} finally {
			setLoadingCep(false);
		}
	};

	const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const cep = e.target.value;
		if (cep && cep.replace(/\D/g, "").length === 8) {
			buscarEnderecoPorCep(cep);
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.cidade?.trim()) {
			newErrors.cidade = "Cidade é obrigatória";
		}

		if (!formData.estado?.trim()) {
			newErrors.estado = "Estado é obrigatório";
		}

		if (formData.cep) {
			const cepLimpo = formData.cep.replace(/\D/g, "");
			if (cepLimpo.length !== 8) {
				newErrors.cep = "CEP deve ter 8 dígitos no formato 00000-000";
			}
		}

		if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
			newErrors.latitude = "Latitude deve estar entre -90 e 90";
		}

		if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
			newErrors.longitude = "Longitude deve estar entre -180 e 180";
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
			if (isEditing && editId) {
				await LocalizacaoService.updateLocalizacao(parseInt(editId), formData);
				toast.success("Localização atualizada com sucesso!");
				navigate("/minhas-localizacoes");
			} else {
				await LocalizacaoService.createLocalizacao(formData);
				toast.success("Localização cadastrada com sucesso!");
				navigate("/criar-passeio");
			}
		} catch (error: unknown) {
			console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} localização:`, error);
			toast.error(
				`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} localização: ` + 
				(error instanceof Error ? error.message : "Erro desconhecido"),
			);
		} finally {
			setLoading(false);
		}
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			toast.error("Geolocalização não é suportada pelo seu navegador");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setFormData((prev) => ({
					...prev,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}));
				toast.success("Localização atual obtida com sucesso!");
			},
			(error) => {
				console.error("Erro ao obter localização:", error);
				toast.error("Não foi possível obter sua localização atual");
			},
		);
	};

	if (isLoading || loadingData) {
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

	if (!isAuthenticated || !canCreateLocalizacao) {
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
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center gap-4">
								<div
									className="w-12 h-12 rounded-full flex items-center justify-center"
									style={{ backgroundColor: "var(--green-600)" }}
								>
									<MapPin size={24} className="text-white" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{isEditing ? "Editar Localização" : "Cadastrar Localização"}
									</h1>
									<p className="text-gray-600">
										{isEditing 
											? "Edite os dados da sua localização" 
											: "Cadastre uma localização onde você oferece seus passeios"
										}
									</p>
								</div>
							</div>
						</div>

						<div className="p-6">
							<form onSubmit={handleSubmit} className="space-y-8">
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="cep"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												CEP (opcional)
											</label>
											<div className="relative">
												<input
													type="text"
													id="cep"
													name="cep"
													value={formData.cep || ""}
													onChange={handleInputChange}
													onBlur={handleCepBlur}
													placeholder="00000-000"
													maxLength={9}
													className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${
														errors.cep ? "border-red-500" : "border-gray-300"
													} ${loadingCep ? "pr-10" : ""}`}
												/>
												{loadingCep && (
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
													</div>
												)}
											</div>
											{errors.cep && (
												<div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
													<AlertCircle size={16} />
													<span>{errors.cep}</span>
												</div>
											)}
											<p className="text-xs text-gray-500 mt-1">
												Digite o CEP e pressione fora do campo para buscar o endereço automaticamente
											</p>
										</div>

										<div>
											<label
												htmlFor="estado"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												UF *
											</label>
											<input
												type="text"
												id="estado"
												name="estado"
												value={formData.estado || ""}
												onChange={handleInputChange}
												placeholder="Ex: SP, RJ, MG"
												className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
													errors.estado ? "border-red-500" : "border-gray-300"
												}`}
												required
											/>
											{errors.estado && (
												<div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
													<AlertCircle size={16} />
													<span>{errors.estado}</span>
												</div>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Cidade */}
										<div>
											<label
												htmlFor="cidade"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Cidade *
											</label>
											<input
												type="text"
												id="cidade"
												name="cidade"
												value={formData.cidade || ""}
												onChange={handleInputChange}
												placeholder="Ex: São Paulo, Rio de Janeiro"
												className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${
													errors.cidade ? "border-red-500" : "border-gray-300"
												}`}
												required
											/>
											{errors.cidade && (
												<div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
													<AlertCircle size={16} />
													<span>{errors.cidade}</span>
												</div>
											)}
										</div>

										{/* Bairro */}
										<div>
											<label
												htmlFor="bairro"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Bairro (opcional)
											</label>
											<input
												type="text"
												id="bairro"
												name="bairro"
												value={formData.bairro || ""}
												onChange={handleInputChange}
												placeholder="Ex: Vila Madalena, Copacabana"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
											/>
										</div>
									</div>

									{/* Logradouro */}
									<div>
										<label
											htmlFor="logradouro"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Logradouro (opcional)
										</label>
										<input
											type="text"
											id="logradouro"
											name="logradouro"
											value={formData.logradouro || ""}
											onChange={handleInputChange}
											placeholder="Ex: Rua das Flores, 123"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
										/>
									</div>

									{/* Coordenadas */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-medium text-gray-900">
												Coordenadas (opcional)
											</h3>
											<button
												type="button"
												onClick={getCurrentLocation}
												className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
											>
												<MapPin size={16} />
												Usar localização atual
											</button>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Latitude */}
											<div>
												<label
													htmlFor="latitude"
													className="block text-sm font-medium text-gray-700 mb-2"
												>
													Latitude
												</label>
												<input
													type="number"
													id="latitude"
													name="latitude"
													value={formData.latitude || ""}
													onChange={handleInputChange}
													placeholder="-23.55052"
													step="any"
													className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${
														errors.latitude ? "border-red-500" : "border-gray-300"
													}`}
												/>
												{errors.latitude && (
													<div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
														<AlertCircle size={16} />
														<span>{errors.latitude}</span>
													</div>
												)}
											</div>

											{/* Longitude */}
											<div>
												<label
													htmlFor="longitude"
													className="block text-sm font-medium text-gray-700 mb-2"
												>
													Longitude
												</label>
												<input
													type="number"
													id="longitude"
													name="longitude"
													value={formData.longitude || ""}
													onChange={handleInputChange}
													placeholder="-46.633309"
													step="any"
													className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent ${
														errors.longitude ? "border-red-500" : "border-gray-300"
													}`}
												/>
												{errors.longitude && (
													<div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
														<AlertCircle size={16} />
														<span>{errors.longitude}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Botões */}
								<div className="flex flex-col sm:flex-row gap-4 pt-6">
									<button
										type="button"
										onClick={() => isEditing ? navigate("/minhas-localizacoes") : navigate(-1)}
										className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={loading}
										className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? (
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										) : (
											<Save size={20} />
										)}
										{loading 
											? "Salvando..." 
											: (isEditing ? "Salvar Alterações" : "Salvar Localização")
										}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
