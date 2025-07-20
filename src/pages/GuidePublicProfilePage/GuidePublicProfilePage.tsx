import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Award, Calendar, ThumbsUp } from "lucide-react";
import "./GuidePublicProfilePage.css";

// MOCK: Simula os dados completos de um guia, como se tivessem sido buscados no backend.
const mockGuide = {
	id: "carlos-andrade",
	name: "Carlos Andrade",
	profilePicture: "https://via.placeholder.com/150",
	isPaid: true, // Para o selo de Guia Verificado/Impulsionado
	location: "Chapada Diamantina, BA",
	bio: "Guia experiente com 10 anos de trilhas na Chapada. Foco em geologia e botânica. Minha missão é proporcionar aventuras seguras, conscientes e inesquecíveis, respeitando a natureza e a cultura local.",
	stats: {
		averageRating: 4.9,
		totalActivities: 38,
		yearsOfExperience: 10,
	},
	activities: [
		{
			id: 1,
			title: "Travessia do Vale do Pati - 3 Dias",
			image: "https://via.placeholder.com/300x200?text=Vale+do+Pati",
			price: 1250.0,
		},
		{
			id: 2,
			title: "Cachoeira da Fumaça por Cima",
			image: "https://via.placeholder.com/300x200?text=Cachoeira+Fumaça",
			price: 150.0,
		},
		{
			id: 3,
			title: "Poço Azul e Poço Encantado",
			image: "https://via.placeholder.com/300x200?text=Poço+Azul",
			price: 200.0,
		},
	],
	reviews: [
		{
			id: 1,
			touristName: "Mariana Silva",
			rating: 5,
			comment:
				"Carlos é um guia incrível! Super atencioso, conhece tudo sobre o local e nos passou muita segurança. A viagem foi perfeita!",
			date: "10 de Julho, 2025",
		},
		{
			id: 2,
			touristName: "João V.",
			rating: 5,
			comment:
				"Experiência única! A organização foi impecável e o conhecimento do Carlos sobre a fauna e flora enriqueceu demais o passeio. Recomendo de olhos fechados.",
			date: "28 de Junho, 2025",
		},
		{
			id: 3,
			touristName: "Beatriz Costa",
			rating: 4,
			comment:
				"A travessia foi desafiadora e maravilhosa. O guia foi ótimo, só achei que o ritmo poderia ser um pouco mais leve no primeiro dia.",
			date: "15 de Maio, 2025",
		},
	],
};

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
	return (
		<div className="guide-profile-container flex min-h-screen flex-col items-center">
			{/* <HeaderLogado /> */}

			<main className="w-full max-w-5xl mx-auto mt-10 md:mt-20 px-4">
				{/* --- Card de Apresentação --- */}
				<section className="profile-card w-full bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-6 mb-8">
					<img
						src={mockGuide.profilePicture}
						alt={`Foto de ${mockGuide.name}`}
						className="w-32 h-32 rounded-full border-4 border-white shadow-md"
					/>
					<div className="flex-1 text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start gap-3">
							<h1 className="profile-name text-3xl font-bold">{mockGuide.name}</h1>
							{mockGuide.isPaid && (
								<div className="premium-badge" title="Guia Verificado">
									<ShieldCheck size={22} />
								</div>
							)}
						</div>
						<div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
							<MapPin size={16} />
							<span>{mockGuide.location}</span>
						</div>
						<p className="text-gray-700 mt-3">{mockGuide.bio}</p>
					</div>
				</section>

				{/* --- Destaques Rápidos --- */}
				<section className="stats-container grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
					<div className="stat-item">
						<Star size={24} />
						<div>
							<strong>{mockGuide.stats.averageRating.toFixed(1)}</strong>
							<p>Avaliação Média</p>
						</div>
					</div>
					<div className="stat-item">
						<ThumbsUp size={24} />
						<div>
							<strong>{mockGuide.stats.totalActivities}</strong>
							<p>Atividades Realizadas</p>
						</div>
					</div>
					<div className="stat-item">
						<Award size={24} />
						<div>
							<strong>{mockGuide.stats.yearsOfExperience}</strong>
							<p>Anos de Experiência</p>
						</div>
					</div>
				</section>

				{/* --- Catálogo de Atividades --- */}
				<section className="mb-12">
					<h2 className="section-title">
						Atividades oferecidas por {mockGuide.name.split(" ")[0]}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						{mockGuide.activities.map((activity) => (
							<Link
								to={`/atividade/${activity.id}`}
								key={activity.id}
								className="activity-card-link bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1"
							>
								<img
									src={activity.image}
									alt={activity.title}
									className="w-full h-40 object-cover"
								/>
								<div className="p-4">
									<h3 className="font-bold text-lg text-gray-800">{activity.title}</h3>
									<p className="text-md font-semibold activity-price mt-2">
										R$ {activity.price.toFixed(2)}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* --- Avaliações --- */}
				<section>
					<h2 className="section-title">O que os turistas dizem</h2>
					<div className="space-y-6 mt-6">
						{mockGuide.reviews.map((review) => (
							<div key={review.id} className="review-card bg-white p-5 rounded-lg shadow-sm">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="font-bold text-gray-800">{review.touristName}</h4>
										<p className="text-sm text-gray-500">{review.date}</p>
									</div>
									<StarRating rating={review.rating} />
								</div>
								<p className="text-gray-700 mt-3">{review.comment}</p>
							</div>
						))}
					</div>
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
