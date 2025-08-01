import { ApiError } from "@/api/axiosConfig";
import AvaliacaoForm from "@/components/AvaliacaoForm";
import AvaliacaoList from "@/components/AvaliacaoList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SubscriptionButton } from "@/components/SubscriptionButton";
import { useUser } from "@/hooks/useAuth";
import { AvaliacaoFormData } from "@/schemas/avaliacaoSchemas";
import AvaliacaoService from "@/services/avaliacaoService";
import PasseioService, { Passeio } from "@/services/passeioService";
import {
	AlertTriangle,
	ArrowLeft,
	Edit,
	Hourglass,
	MapPin,
	Tag,
	Users,
	Zap,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ActivityDetailPage() {
	const { passeioId } = useParams<{ passeioId: string }>();
	const [passeio, setPasseio] = useState<Passeio | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user, isClient, clienteInfo } = useUser();
	const [formLoading, setFormLoading] = useState(false);

	const fetchPasseio = useCallback(() => {
		if (!passeioId) return;
		setLoading(true);
		PasseioService.getPasseioById(passeioId)
			.then(setPasseio)
			.catch(() => setError("Não foi possível carregar os detalhes do passeio."))
			.finally(() => setLoading(false));
	}, [passeioId]);

	useEffect(() => {
		fetchPasseio();
	}, [passeioId, fetchPasseio]);

	const handleAvaliacaoSubmit = async (data: AvaliacaoFormData) => {
		if (!passeioId || !isClient() || !clienteInfo?.id) {
			toast.error("Você precisa estar logado como cliente para avaliar.");
			return;
		}

		setFormLoading(true);
		try {
			await AvaliacaoService.create({
				id_passeio: passeioId,
				id_cliente: clienteInfo.id,
				nota: data.nota,
				comentario: data.comentario,
			});
			toast.success("Avaliação enviada com sucesso!");
			fetchPasseio();
		} catch (err) {
			if (err instanceof ApiError && err.status === 409) {
				toast.error("Você já avaliou este passeio.");
			} else {
				toast.error("Erro ao enviar avaliação.");
			}
			console.error(err);
		} finally {
			setFormLoading(false);
		}
	};

	if (loading) {
		return (
			<div
				className="flex flex-col min-h-screen"
				style={{ backgroundColor: "var(--background-claro)" }}
			>
				<Header />
				<main className="flex-1 flex justify-center items-center pt-20">
					<p className="text-lg" style={{ color: "var(--verde-oliva)" }}>
						Carregando passeio...
					</p>
				</main>
				<Footer />
			</div>
		);
	}
	if (error || !passeio) {
		return (
			<div
				className="flex flex-col min-h-screen"
				style={{ backgroundColor: "var(--background-claro)" }}
			>
				<Header />
				<main className="flex-1 flex justify-center items-center pt-20 text-center px-4">
					<p className="text-lg text-red-600">{error || "Passeio não encontrado."}</p>
				</main>
				<Footer />
			</div>
		);
	}

	const isOwner = user && user.role === "GUIA" && user.sub === passeio.guia.id;
	const defaultImage = "/default-image.png";
	const imagens =
		passeio.imagens && passeio.imagens.length > 0
			? passeio.imagens
			: [{ url_imagem: defaultImage, descricao: passeio.titulo }];

	const carouselResponsive = {
		desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
		tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
		mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
	};

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />
			<main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-12">
				<Link
					to="/explorar"
					className="flex items-center gap-2 font-semibold mb-6 transition-colors hover:underline"
					style={{ color: "var(--marrom-dourado)" }}
				>
					<ArrowLeft size={20} />
					Voltar para Exploração
				</Link>
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="lg:w-2/3">
						<div className="mb-6 rounded-lg overflow-hidden shadow-lg border border-[rgba(137,143,41,0.1)]">
							<Carousel
								responsive={carouselResponsive}
								infinite={imagens.length > 1}
								showDots={imagens.length > 1}
								arrows={imagens.length > 1}
							>
								{imagens.map((img, index) => (
									<img
										key={index}
										src={img.url_imagem}
										alt={img.descricao}
										className="w-full h-64 md:h-80 lg:h-[30rem] object-cover"
										onError={(e) => {
											e.currentTarget.src = defaultImage;
										}}
									/>
								))}
							</Carousel>
						</div>

						<h1
							className="text-3xl md:text-4xl font-bold mb-4"
							style={{ color: "var(--verde-oliva)" }}
						>
							{passeio.titulo}
						</h1>
						<div className="flex flex-wrap gap-3 mb-6">
							<div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
								<MapPin size={16} />
								Passeio
							</div>
							<div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
								<Zap size={16} />
								Dificuldade: {passeio.nivel_dificuldade || "N/A"}
							</div>
							<div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
								<Users size={16} />
								{passeio.qtd_pessoas || 0} vagas
							</div>
						</div>
						{passeio.categorias && passeio.categorias.length > 0 && (
							<div className="flex flex-wrap gap-3 mb-6">
								{passeio.categorias.map((categoria) => (
									<div
										key={categoria.id}
										className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
									>
										<Tag size={16} />
										{categoria.nome}
									</div>
								))}
							</div>
						)}

						<h2
							className="text-2xl font-bold border-b pb-2 mt-8 mb-4"
							style={{ color: "var(--verde-oliva)", borderColor: "rgba(137,143,41,0.15)" }}
						>
							Sobre a atividade
						</h2>
						<p className="text-gray-700 leading-relaxed whitespace-pre-line">{passeio.descricao}</p>

						{passeio.restricoes && passeio.restricoes.length > 0 && (
							<div className="mt-8">
								<h2
									className="text-2xl font-bold border-b pb-2 mb-4"
									style={{ color: "var(--verde-oliva)", borderColor: "rgba(137,143,41,0.15)" }}
								>
									Restrições e Recomendações
								</h2>
								<ul className="space-y-3">
									{passeio.restricoes.map((restricao) => (
										<li
											key={restricao.id}
											className="flex items-start gap-3 p-3 bg-yellow-50/50 border-l-4 border-yellow-400 rounded-r-lg"
										>
											<AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-800">{restricao.descricao}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="bg-white p-5 rounded-lg shadow-sm mt-8 border border-[rgba(137,143,41,0.1)] flex items-center gap-4">
							<img
								src={passeio.guia.perfil.foto || defaultImage}
								alt={passeio.guia.perfil.nome}
								className="w-16 h-16 rounded-full object-cover"
							/>
							<div>
								<p className="text-sm text-gray-600">Guiado por</p>
								<h3 className="text-xl font-bold" style={{ color: "var(--verde-oliva)" }}>
									{passeio.guia.perfil.nome}
								</h3>
								<Link
									to={`/guia/${passeio.guia.id}`}
									className="text-sm font-semibold hover:underline"
									style={{ color: "var(--marrom-dourado)" }}
								>
									Ver perfil do guia
								</Link>
							</div>
						</div>
					</div>

					<div className="lg:w-1/3">
						<div className="sticky top-24 bg-white p-6 rounded-lg shadow-xl border border-[rgba(137,143,41,0.1)]">
							{passeio.valor && parseFloat(passeio.valor) > 0 ? (
								<h2
									className="text-2xl md:text-3xl font-bold mb-4"
									style={{ color: "var(--marrom-dourado)" }}
								>
									{`R$ ${parseFloat(passeio.valor).toFixed(2).replace(".", ",")}`}
									<span className="text-base font-normal text-gray-600"> / pessoa</span>
								</h2>
							) : (
								<h2
									className="text-xl md:text-2xl font-bold mb-4 flex items-baseline gap-2"
									style={{ color: "var(--marrom-dourado)" }}
								>
									<span className="text-lg text-gray-700 font-medium">Preço:</span>
									<span>Entrar em contato</span>
								</h2>
							)}
							<ul className="space-y-3 text-gray-800 border-t pt-4">
								<li className="flex items-center gap-3">
									<Hourglass size={20} className="text-gray-500" />
									<div>
										<strong>Duração:</strong> {passeio.duracao_passeio} minutos
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Users size={20} className="text-gray-500" />
									<div>
										<strong>Quantidade de pessoas:</strong> {passeio.qtd_pessoas || 0}
									</div>
								</li>
							</ul>
							<div className="mt-6">
								{isClient() && (
									<SubscriptionButton passeio={passeio} clienteId={clienteInfo?.id || ""} />
								)}
								{isOwner && (
									<Link
										to={`/editar-passeio/${passeio.id}`}
										className="w-full text-center font-bold py-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-colors hover:bg-gray-100"
										style={{ color: "var(--verde-oliva)", borderColor: "var(--verde-oliva)" }}
									>
										<Edit size={18} />
										Editar Atividade
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12">
					<h2
						className="text-2xl font-bold border-b pb-2 mb-6"
						style={{ color: "var(--verde-oliva)", borderColor: "rgba(137,143,41,0.15)" }}
					>
						Avaliações
					</h2>
					{isClient() && (
						<div className="mb-8">
							<AvaliacaoForm onSubmit={handleAvaliacaoSubmit} loading={formLoading} />
						</div>
					)}
					<AvaliacaoList avaliacoes={passeio.avaliacoes} />
				</div>
			</main>
			<Footer />
		</div>
	);
}
