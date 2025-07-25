import { Header } from "@/components/Header";
import { PlanBadge } from "@/components/PlanBadge";
import { LocationFilter, LocationFilters } from "@/components/LocationFilter";
import { usePasseios } from "@/hooks/usePasseios";
import CategoriaService, { Categoria } from "@/services/categoriaService";
import { Passeio } from "@/services/passeioService";
import { formatPrice } from "@/utils/utils";
import {
	Banknote,
	ChevronDown,
	Clock,
	Compass,
	Mountain,
	Search,
	Star,
	Tags,
	Users,
	X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Categories: React.FC<{ categorias: Passeio["categorias"] }> = ({ categorias }) => {
	if (!categorias || categorias.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2 mt-3">
			{categorias.map((categoria) => {
				if (!categoria || !categoria.id || !categoria.nome) return null;

				return (
					<span
						key={categoria.id}
						className="px-2 py-1 text-xs rounded-full border"
						style={{
							backgroundColor: "rgba(130, 181, 91, 0.1)",
							color: "rgba(130, 181, 91, 0.8)",
							borderColor: "rgba(130, 181, 91, 0.2)",
						}}
					>
						{categoria.nome}
					</span>
				);
			})}
		</div>
	);
};

const StarRating: React.FC<{ rating: number; total: number }> = ({ rating, total }) => {
	if (total === 0) return null;

	return (
		<div className="flex items-center gap-1 text-sm text-gray-600">
			<Star size={14} className="fill-yellow-400 text-yellow-400" />
			<span>
				{rating} ({total} avaliações)
			</span>
		</div>
	);
};

const preparePasseioImages = (
	imagens: Array<{ url_imagem?: string; descricao?: string }> | undefined,
	passeioTitulo: string,
) => {
	const defaultImage = "/default-image.png";
	const imagesToShow = [];

	for (let i = 0; i < 3; i++) {
		if (imagens && imagens[i] && imagens[i].url_imagem) {
			imagesToShow.push({
				url: imagens[i].url_imagem,
				alt: imagens[i].descricao || passeioTitulo,
			});
		} else {
			imagesToShow.push({
				url: defaultImage,
				alt: `Imagem padrão para ${passeioTitulo}`,
			});
		}
	}

	return imagesToShow;
};

const limitDescricao = (descricao: string, maxLength: number = 500): string => {
	if (!descricao) return "";
	if (descricao.length <= maxLength) return descricao;
	return descricao.substring(0, maxLength).trim() + "...";
};

export default function FeedPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [locationFilters, setLocationFilters] = useState<LocationFilters>({});
	const filterRef = useRef<HTMLDivElement>(null);

	const {
		passeios,
		loading,
		currentPage,
		totalPages,
		hasNext,
		hasPrev,
		searchPasseios,
		loadPasseios,
		goToPage,
	} = usePasseios({
		initialLimit: 10,
		disponiveis: false,
		autoLoad: false,
		categorias: selectedCategorias.join(","),
		...locationFilters,
	});

	const handleLoadPasseios = useCallback(() => {
		loadPasseios({
			categorias: selectedCategorias.join(","),
			...locationFilters,
		});
	}, [loadPasseios, selectedCategorias, locationFilters]);

	useEffect(() => {
		const fetchCategorias = async () => {
			try {
				const data = await CategoriaService.getAllCategorias();
				setCategorias(data);
			} catch {
				toast.error("Erro ao carregar categorias.");
			}
		};
		fetchCategorias();
	}, []);

	useEffect(() => {
		handleLoadPasseios();
	}, [selectedCategorias, locationFilters, handleLoadPasseios]);

	const performSearch = useCallback(
		async (term: string) => {
			setIsSearching(true);
			try {
				if (term.trim()) {
					await searchPasseios(term, {
						categorias: selectedCategorias.join(","),
						...locationFilters,
					});
				} else {
					await handleLoadPasseios();
				}
			} finally {
				setIsSearching(false);
			}
		},
		[searchPasseios, handleLoadPasseios, selectedCategorias, locationFilters],
	);

	const handleSearch = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			await performSearch(searchTerm);
		},
		[searchTerm, performSearch],
	);

	const handleSearchInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchTerm(value);

			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			debounceTimeoutRef.current = setTimeout(() => {
				performSearch(value);
			}, 300);
		},
		[performSearch],
	);

	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	const clearSearch = useCallback(async () => {
		setSearchTerm("");
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}
		await performSearch("");
	}, [performSearch]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			goToPage(newPage);
		},
		[goToPage],
	);

	const handleCategoriaChange = (categoriaId: string) => {
		setSelectedCategorias((prev) =>
			prev.includes(categoriaId) ? prev.filter((id) => id !== categoriaId) : [...prev, categoriaId],
		);
	};

	const handleLocationChange = useCallback((filters: LocationFilters) => {
		setLocationFilters(filters);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
		}
		return `${mins}min`;
	};

	const getDefaultAvatar = (name: string) => {
		const initials = name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
		return `https://placehold.co/40x40/898f29/FFFFFF?text=${initials}&font=roboto`;
	};

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = "/default-image.png";
	};

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />

			<main className="flex-1 flex flex-col items-center px-2 pt-24 pb-8 md:px-0">
				<div className="w-full max-w-4xl mb-12 px-4">
					<div className="flex flex-col md:flex-row gap-4">
						<form onSubmit={handleSearch} className="flex-grow">
							<div className="relative bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 focus-within:shadow-lg border border-[rgba(137,143,41,0.15)]">
								<Search
									size={18}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-70"
									style={{ color: "var(--verde-oliva)" }}
								/>
								<input
									type="text"
									placeholder="Buscar passeios, guias ou destinos..."
									value={searchTerm}
									onChange={handleSearchInputChange}
									className="w-full pl-12 pr-20 py-3 bg-transparent border-none outline-none rounded-full placeholder-opacity-60 text-verde-oliva"
									disabled={isSearching}
								/>
								{searchTerm && (
									<button
										type="button"
										onClick={clearSearch}
										className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
										title="Limpar busca"
									>
										<X size={18} />
									</button>
								)}
							</div>
						</form>

            <div className="flex gap-2 flex-col sm:flex-row">
							{/* Filtro de Localização */}
							<div className="flex-1">
								<LocationFilter
									onLocationChange={handleLocationChange}
									selectedFilters={locationFilters}
								/>
							</div>

							{/* Filtro de Categorias */}
							<div className="relative flex-1" ref={filterRef}>
								<button
									onClick={() => setIsFilterOpen(!isFilterOpen)}
									className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-[rgba(137,143,41,0.15)]"
								>
									<div className="flex items-center gap-2 min-w-0 flex-1">
										<Tags size={18} className="text-gray-600 flex-shrink-0" />
										<span
											className={`font-medium truncate ${selectedCategorias.length > 0 ? "text-green-600" : "text-gray-700"}`}
										>
											{selectedCategorias.length > 0
												? `Categorias (${selectedCategorias.length})`
												: "Categorias"}
										</span>
									</div>
									<ChevronDown
										size={18}
										className={`text-gray-600 transition-transform flex-shrink-0 ${
											isFilterOpen ? "rotate-180" : ""
										}`}
									/>
								</button>
								{isFilterOpen && (
									<div className="absolute top-full mt-2 w-full sm:w-64 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 left-0 right-0 mx-auto sm:right-0 sm:left-auto sm:mx-0">
										<div className="p-4 max-h-72 overflow-y-auto">
											{categorias.length > 0 ? (
												categorias.map((cat) => (
													<label
														key={cat.id}
														className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
													>
														<input
															type="checkbox"
															checked={selectedCategorias.includes(cat.id)}
															onChange={() => handleCategoriaChange(cat.id)}
															className="h-4 w-4 rounded border-gray-300 text-verde-vibrante focus:ring-green-500"
														/>
														<span className="text-gray-800">{cat.nome}</span>
													</label>
												))
											) : (
												<p className="text-gray-500">Nenhuma categoria encontrada.</p>
											)}
										</div>
										{selectedCategorias.length > 0 && (
											<div className="p-2 border-t border-gray-200">
												<button
													onClick={() => setSelectedCategorias([])}
													className="w-full text-center text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-md"
												>
													Limpar filtros
												</button>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{searchTerm && (
						<div className="mt-3 text-sm text-gray-600 text-center">
							{isSearching ? (
								"Buscando..."
							) : (
								<>
									Resultados para: <span className="font-medium">"{searchTerm}"</span>
									{passeios.length > 0 && (
										<span className="ml-2">({passeios.length} encontrados)</span>
									)}
								</>
							)}
						</div>
					)}
				</div>

				<div className="w-full max-w-4xl">
					{loading ? (
						<div className="flex justify-center items-center py-12">
							<div className="text-lg text-gray-600">Carregando passeios...</div>
						</div>
					) : passeios.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-12 text-center">
							<Compass size={64} className="text-gray-400 mb-4" />
							<h3 className="text-xl font-semibold text-gray-600 mb-2">
								Nenhum passeio encontrado
							</h3>
							<p className="text-gray-500">
								Tente ajustar os filtros ou{" "}
								<button
									onClick={clearSearch}
									className="text-verde-vibrante hover:underline font-medium"
								>
									buscar por outro termo
								</button>
								.
							</p>
						</div>
					) : (
						<>
							<div className="space-y-6">
								{passeios.map((passeio) => {
									const imagesToShow = preparePasseioImages(passeio.imagens, passeio.titulo);

									return (
										<article
											key={passeio.id}
											className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[rgba(137,143,41,0.1)]"
										>
											<div className="flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200">
												<Link to={`/guia/${passeio.guia.id}`} className="">
													<img
														src={
															passeio.guia.perfil.foto || getDefaultAvatar(passeio.guia.perfil.nome)
														}
														alt={passeio.guia.perfil.nome}
														className="m-4 w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2"
														style={{ borderColor: "rgba(130, 181, 91, 0.3)" }}
														onError={(e) =>
															(e.currentTarget.src = getDefaultAvatar(passeio.guia.perfil.nome))
														}
													/>
												</Link>
												<div className="flex-1 min-w-0">
													<h2
														className="text-lg lg:text-xl font-bold mb-1 line-clamp-2"
														style={{ color: "var(--verde-oliva)" }}
													>
														{passeio.titulo}
													</h2>
													<div className="flex items-center gap-2 mb-2">
														<p
															className="text-sm font-medium"
															style={{ color: "var(--marrom-dourado)" }}
														>
															Por:{" "}
															<span className="sm:hidden">
																{passeio.guia.perfil.nome.length > 16
																	? `${passeio.guia.perfil.nome.substring(0, 16)}...`
																	: passeio.guia.perfil.nome}
															</span>
															<span className="hidden sm:inline">{passeio.guia.perfil.nome}</span>
														</p>
														{passeio.guia.perfil.usuario && (
															<PlanBadge
																usuario={passeio.guia.perfil.usuario}
																size="sm"
																width="fit-content"
															/>
														)}
													</div>

													<div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-gray-600 mb-2">
														<StarRating
															rating={passeio.mediaAvaliacoes}
															total={passeio.quantidadeAvaliacoes}
														/>
														<span className="flex items-center gap-1">
															<Clock size={14} className="text-green-700" />{" "}
															{formatDuration(passeio.duracao_passeio)}
														</span>
														{passeio.valor && (
															<span className="flex items-center gap-1">
																<Banknote size={14} className="text-green-700" />{" "}
																{formatPrice(passeio.valor)}
															</span>
														)}
														{passeio.qtd_pessoas && (
															<span className="flex items-center gap-1">
																<Users size={14} className="text-green-700" /> {passeio.qtd_pessoas}{" "}
																pessoas
															</span>
														)}
														{passeio.nivel_dificuldade && (
															<span className="flex items-center gap-1">
																<Mountain size={14} className="text-green-700" />
																Nível {passeio.nivel_dificuldade}/10
															</span>
														)}
													</div>
												</div>
											</div>

											<Link to={`/passeio/${passeio.id}`}>
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
													<div className="sm:col-span-2 lg:col-span-2 sm:row-span-2 relative group">
														<img
															src={imagesToShow[0].url}
															alt={imagesToShow[0].alt}
															className="w-full h-48 sm:h-64 lg:h-80 object-cover"
															onError={handleImageError}
														/>
														<div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
															<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-3 py-2 rounded-lg">
																<span className="text-sm font-medium text-gray-700">
																	Clique para ver detalhes do passeio
																</span>
															</div>
														</div>
													</div>

													<div className="hidden sm:block">
														<img
															src={imagesToShow[1].url}
															alt={imagesToShow[1].alt}
															className="w-full h-32 lg:h-40 object-cover"
															onError={handleImageError}
														/>
													</div>
													<div className="hidden sm:block">
														<img
															src={imagesToShow[2].url}
															alt={imagesToShow[2].alt}
															className="w-full h-32 lg:h-40 object-cover"
															onError={handleImageError}
														/>
													</div>
												</div>

												<div className="p-4 lg:p-5">
													<p
														className="leading-relaxed mb-3 text-sm lg:text-base"
														style={{ color: "var(--verde-oliva)" }}
													>
														{limitDescricao(passeio.descricao)}
													</p>
													<Categories categorias={passeio.categorias} />
												</div>
											</Link>
										</article>
									);
								})}
							</div>
							{totalPages > 1 && (
								<div className="flex justify-center items-center gap-4 mt-8 mb-4">
									<button
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={!hasPrev}
										className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
											hasPrev ? "hover:bg-green-50" : "cursor-not-allowed opacity-50"
										}`}
										style={
											hasPrev
												? {
														borderColor: "var(--verde-vibrante)",
														color: "var(--verde-vibrante)",
													}
												: {
														borderColor: "#d1d5db",
														color: "#9ca3af",
													}
										}
									>
										Anterior
									</button>

									<span className="font-medium" style={{ color: "var(--verde-oliva)" }}>
										Página {currentPage} de {totalPages}
									</span>

									<button
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={!hasNext}
										className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
											hasNext ? "hover:bg-green-50" : "cursor-not-allowed opacity-50"
										}`}
										style={
											hasNext
												? {
														borderColor: "var(--verde-vibrante)",
														color: "var(--verde-vibrante)",
													}
												: {
														borderColor: "#d1d5db",
														color: "#9ca3af",
													}
										}
									>
										Próxima
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
}
