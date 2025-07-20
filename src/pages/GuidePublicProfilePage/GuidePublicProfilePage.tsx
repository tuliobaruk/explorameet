import { Link, useParams } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Award, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { GuiaService } from "../../services/guiaService";
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
		};
	};
	passeios: Array<{
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

// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating }: { rating: number }) => {
	const totalStars = 5;
	return (
		<div className="flex items-center">
			{[...Array(totalStars)].map((_, index) => (
				<Star
					key={index}
					size={18}
					className={index < Math.round(rating) ? "star-filled" : "star-empty"}
				/>
			))}
		</div>
	);
};

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
				console.error('Erro ao buscar dados do guia:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchGuideData();
	}, [guideId]);

	// Funções auxiliares
	const calculateStats = (passeios: GuideData['passeios']) => {
		if (!passeios || passeios.length === 0) {
			return { averageRating: 0, totalActivities: 0, totalReviews: 0 };
		}

		let totalRating = 0;
		let totalReviews = 0;

		passeios.forEach(passeio => {
			if (passeio.avaliacoes && passeio.avaliacoes.length > 0) {
				passeio.avaliacoes.forEach(avaliacao => {
					totalRating += avaliacao.nota;
					totalReviews++;
				});
			}
		});

		const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
		
		return {
			averageRating,
			totalActivities: passeios.length,
			totalReviews
		};
	};

	const formatPrice = (value: string | null) => {
		if (!value) return 'Sob consulta';
		const numPrice = parseFloat(value);
		return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
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

	const getAllReviews = (passeios: GuideData['passeios']) => {
		const reviews: Array<{
			id: string;
			nota: number;
			comentario: string;
			createdAt: string;
			passeioTitulo: string;
		}> = [];

		passeios.forEach(passeio => {
			if (passeio.avaliacoes && passeio.avaliacoes.length > 0) {
				passeio.avaliacoes.forEach(avaliacao => {
					reviews.push({
						...avaliacao,
						passeioTitulo: passeio.titulo
					});
				});
			}
		});

		// Ordenar por data mais recente
		return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
	const allReviews = getAllReviews(guideData.passeios);

	return (
		<div className="guide-profile-container flex min-h-screen flex-col items-center">
			{/* <HeaderLogado /> */}

			<main className="w-full max-w-5xl mx-auto mt-10 md:mt-20 px-4">
				{/* --- Card de Apresentação --- */}
				<section className="profile-card w-full bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8">
					<img
						src={guideData.perfil.foto || getDefaultAvatar(guideData.perfil.nome)}
						alt={`Foto de ${guideData.perfil.nome}`}
						className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
					/>
					<div className="flex-1 text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start gap-3">
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
						<p className="text-gray-700 mt-3">
							{guideData.perfil.genero}, {guideData.perfil.idade} anos
						</p>
					</div>
				</section>

				{/* --- Destaques Rápidos --- */}
				<section className="stats-container grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
					<div className="stat-item">
						<Star size={24} />
						<div>
							<strong>{stats.averageRating.toFixed(1)}</strong>
							<p>Avaliação Média</p>
						</div>
					</div>
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
							<strong>{stats.totalReviews}</strong>
							<p>Avaliações Recebidas</p>
						</div>
					</div>
				</section>

				{/* --- Catálogo de Atividades --- */}
				<section className="mb-12">
					<h2 className="section-title">
						Passeios oferecidos por {guideData.perfil.nome.split(" ")[0]}
					</h2>
					{guideData.passeios && guideData.passeios.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
							{guideData.passeios.map((passeio) => (
								<Link
									to={`/passeio/${passeio.id}`}
									key={passeio.id}
									className="activity-card-link bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1"
								>
									<img
										src="/default-image.png"
										alt={passeio.titulo}
										className="w-full h-40 object-cover"
									/>
									<div className="p-4">
										<h3 className="font-bold text-lg text-gray-800 line-clamp-2">{passeio.titulo}</h3>
										<p className="text-sm text-gray-600 mt-1 line-clamp-2">{passeio.descricao}</p>
										<div className="mt-2">
											<p className="text-xs text-gray-500">Duração: {passeio.duracao_passeio} min</p>
											{passeio.qtd_pessoas && (
												<p className="text-xs text-gray-500">Máx. {passeio.qtd_pessoas} pessoas</p>
											)}
										</div>
										<p className="text-md font-semibold activity-price mt-2">
											{formatPrice(passeio.valor)}
										</p>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className="text-gray-600 mt-6">Nenhum passeio cadastrado ainda.</p>
					)}
				</section>

				{/* --- Avaliações --- */}
				<section>
					<h2 className="section-title">O que os turistas dizem</h2>
					{allReviews.length > 0 ? (
						<div className="space-y-6 mt-6">
							{allReviews.slice(0, 10).map((review) => (
								<div key={review.id} className="review-card bg-white p-5 rounded-lg shadow-sm">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-bold text-gray-800">Turista</h4>
											<p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
											<p className="text-xs text-blue-600 mt-1">Passeio: {review.passeioTitulo}</p>
										</div>
										<StarRating rating={review.nota} />
									</div>
									<p className="text-gray-700 mt-3">{review.comentario}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-600 mt-6">Nenhuma avaliação ainda.</p>
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
