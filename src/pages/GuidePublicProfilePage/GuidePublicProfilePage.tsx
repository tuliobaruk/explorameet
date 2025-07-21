import EditPasseioButton from "@/components/EditPasseioButton";
import { Header } from "@/components/Header";
import { PlanBadge } from "@/components/PlanBadge";
import { GuiaService } from "@/services/guiaService";
import { ArrowLeft, Award, Crown, MapPin, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./GuidePublicProfilePage.css";

interface GuideData {
	id: string;
	cpf_cnpj: string;
	num_cadastro: string;
	cadasturStatus: boolean;
	perfil: {
		id: string;
		nome: string;
		celular: string;
		genero: string;
		idade: number;
		foto: string | null;
		usuario: {
			id: string;
			email: string;
			emailVerificado: boolean;
			role: string;
			inscricoes?: Array<{
				id: string;
				data_inicio: string;
				data_fim: string;
				status: string;
				planoAssinatura: {
					id: string;
					nome: string;
					preco: string;
					descricao: string;
				};
			}>;
		};
	};
	passeios: Array<{
		imagens: Array<{
			id: string;
			url_imagem: string;
		}>;
		id: string;
		titulo: string;
		descricao: string;
		duracao_passeio: number;
		valor: string | null;
		qtd_pessoas: number | null;
		nivel_dificuldade: number | null;
		avaliacoes: Array<{
			id: string;
			nota: number;
			comentario: string;
			createdAt: string;
		}>;
	}>;
}

export default function GuidePublicProfilePage() {
	const { guideId } = useParams<{ guideId: string }>();
	const [guideData, setGuideData] = useState<GuideData | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchGuideData = async () => {
			if (!guideId) return;

			try {
				setLoading(true);
				const data = await GuiaService.getGuiaById(guideId);
				setGuideData(data);
			} catch (error) {
				console.error("Erro ao buscar dados do guia:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchGuideData();
	}, [guideId]);

	const calculateStats = (passeios: GuideData["passeios"]) => {
		if (!passeios || passeios.length === 0) {
			return { totalActivities: 0 };
		}

		return {
			totalActivities: passeios.length,
		};
	};

	const formatPrice = (value: string | null) => {
		if (!value) return "Sob consulta";
		const numPrice = parseFloat(value);
		return `R$ ${numPrice.toFixed(2).replace(".", ",")}`;
	};

	const getDefaultAvatar = (name: string) => {
		const initials = name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
		return `https://placehold.co/150x150/898f29/FFFFFF?text=${initials}&font=roboto`;
	};

	const getActivePlan = (guideData: GuideData) => {
		const inscricoes = guideData.perfil.usuario.inscricoes;
		if (!inscricoes || inscricoes.length === 0) {
			return null;
		}

		const activeInscricao = inscricoes.find(
			(inscricao) => inscricao.status === "ativa" && new Date(inscricao.data_fim) > new Date(),
		);

		return activeInscricao ? activeInscricao.planoAssinatura : null;
	};

	if (loading) {
		return (
			<div className="guide-profile-container flex min-h-screen flex-col items-center justify-center">
				<div className="text-lg text-gray-600">Carregando perfil do guia...</div>
			</div>
		);
	}

	if (!guideData) {
		return (
			<div className="guide-profile-container flex min-h-screen flex-col items-center justify-center">
				<div className="text-lg text-gray-600">Guia não encontrado</div>
			</div>
		);
	}

	const stats = calculateStats(guideData.passeios);
	const activePlan = getActivePlan(guideData);

	const getDefaultPasseioImage = () => {
		return "/default-image.png";
	};

	return (
		<div className="guide-profile-container flex min-h-screen flex-col items-center">
			<Header />
			<main className="w-full max-w-5xl mx-auto mt-10 md:mt-20 px-4">
				<Link
					to="/explorar"
					className="flex items-center gap-2 font-semibold mb-6 transition-colors hover:underline"
					style={{ color: "var(--marrom-dourado)" }}
				>
					<ArrowLeft size={20} />
					Voltar para Exploração
				</Link>
				<section className="profile-card w-full bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8">
					<img
						src={guideData.perfil.foto || getDefaultAvatar(guideData.perfil.nome)}
						alt={`Foto de ${guideData.perfil.nome}`}
						className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
					/>
					<div className="flex-1 text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start gap-3 mb-2">
							<h1 className="profile-name text-3xl font-bold">{guideData.perfil.nome}</h1>
							{guideData.cadasturStatus && (
								<div className="premium-badge" title="Guia Verificado">
									<ShieldCheck size={22} />
								</div>
							)}
						</div>

						<div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
							<MapPin size={16} />
							<span>Cadastur: {guideData.num_cadastro}</span>
						</div>
						<p className="text-gray-700 mt-3 mb-3">
							{guideData.perfil.genero}, {guideData.perfil.idade} anos
						</p>

						<PlanBadge usuario={guideData.perfil.usuario} size="lg" width="fit-content" />
					</div>
				</section>

				<section className="stats-container grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
					<div className="stat-item">
						<ThumbsUp size={24} />
						<div>
							<strong>{stats.totalActivities}</strong>
							<p>Passeios Cadastrados</p>
						</div>
					</div>
					<div className="stat-item">
						<Award size={24} />
						<div>
							<strong>{guideData.cadasturStatus ? "Verificado" : "Pendente"}</strong>
							<p>Status Cadastur</p>
						</div>
					</div>
					{activePlan && (
						<div className="stat-item">
							{(() => {
								const iconMap = {
									"Plano Basic": ThumbsUp,
									"Plano Pro": Star,
									"Plano Premium": Crown,
								};
								const colorMap = {
									"Plano Basic": "#6b7280",
									"Plano Pro": "#2563eb",
									"Plano Premium": "#ca8a04",
								};
								const IconComponent = iconMap[activePlan.nome as keyof typeof iconMap] || ThumbsUp;
								const iconColor = colorMap[activePlan.nome as keyof typeof colorMap] || "#6b7280";
								return <IconComponent size={24} style={{ color: iconColor }} />;
							})()}
							<div>
								<strong>{activePlan.nome.replace("Plano ", "")}</strong>
								<p>Plano Ativo</p>
							</div>
						</div>
					)}
				</section>

				<section className="mb-12">
					<h2 className="section-title">
						Passeios oferecidos por {guideData.perfil.nome.split(" ")[0]}
					</h2>
					{guideData.passeios && guideData.passeios.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
							{guideData.passeios.map((passeio) => (
								<div
									key={passeio.id}
									className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1"
								>
									<Link to={`/passeio/${passeio.id}`}>
										<img
											src={passeio.imagens[0]?.url_imagem || getDefaultPasseioImage()}
											alt={passeio.titulo}
											className="w-full h-40 object-cover"
										/>
										<div className="p-4">
											<h3 className="font-bold text-lg text-gray-800 line-clamp-2">
												{passeio.titulo}
											</h3>
											<p className="text-sm text-gray-600 mt-1 line-clamp-2">{passeio.descricao}</p>
											<div className="mt-2">
												<p className="text-xs text-gray-500">
													Duração: {passeio.duracao_passeio} min
												</p>
												{passeio.qtd_pessoas && (
													<p className="text-xs text-gray-500">
														Máx. {passeio.qtd_pessoas} pessoas
													</p>
												)}
											</div>
											<p className="text-md font-semibold activity-price mt-2">
												{formatPrice(passeio.valor)}
											</p>
										</div>
									</Link>

									<div className="px-4 pb-4">
										<EditPasseioButton
											passeioId={passeio.id}
											passeio={{
												guia: {
													id: guideData.id,
												},
											}}
											variant="outline"
											size="sm"
											className="w-full"
										/>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-600 mt-6">Nenhum passeio cadastrado ainda.</p>
					)}
				</section>
			</main>

			<footer className="footer w-full py-6 mt-24">
				<div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
					<span>Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
				</div>
			</footer>
		</div>
	);
}
