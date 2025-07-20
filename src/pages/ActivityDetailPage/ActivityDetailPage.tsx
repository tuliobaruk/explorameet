import { Link } from "react-router-dom";
import {
	ArrowLeft,
	MapPin,
	Zap,
	Users,
	Calendar,
	Clock,
	Hourglass,
	DollarSign,
	Edit,
} from "lucide-react";
import "./ActivityDetailPage.css";

// MOCK: Simula os dados de uma atividade específica.
// Inclui um objeto aninhado com as informações do guia.
const mockActivity = {
	id: 1,
	title: "Travessia do Vale do Pati - 3 Dias",
	images: [
		"https://via.placeholder.com/800x500?text=Vale+do+Pati+1",
		"https://via.placeholder.com/150x100?text=Pati+2",
		"https://via.placeholder.com/150x100?text=Pati+3",
		"https://via.placeholder.com/150x100?text=Pati+4",
	],
	location: "Parque Nacional da Chapada Diamantina, BA",
	difficulty: "Difícil",
	participants: {
		current: 4,
		max: 10,
	},
	date: "2025-09-15T08:00",
	duration: 72, // em horas
	price: 1250.0,
	description: `A Travessia do Vale do Pati é considerada uma das mais belas do Brasil. Durante 3 dias, caminharemos por paisagens de tirar o fôlego, cruzando rios, subindo morros e dormindo em casas de nativos, o que proporciona uma imersão cultural única. O percurso exige bom preparo físico, mas recompensa com vistas espetaculares de cachoeiras e cânions. O pacote inclui guia experiente, alimentação completa durante a travessia e seguro aventura.`,
	guide: {
		id: "carlos-andrade",
		name: "Carlos Andrade",
		profilePicture: "https://via.placeholder.com/150",
	},
};

// MOCK: Simula o usuário logado atualmente.
// Alterne o 'id' e 'role' para ver a mudança nos botões de ação.
const mockCurrentUser = {
	id: "outro-usuario", // ou 'carlos-andrade' para simular o dono
	role: "turista", // ou "guia"
};

export default function ActivityDetailPage() {
	const isOwner = mockCurrentUser.role === "guia" && mockCurrentUser.id === mockActivity.guide.id;
	const isTurista = mockCurrentUser.role === "turista";

	const availableSlots = mockActivity.participants.max - mockActivity.participants.current;
	const formattedDate = new Date(mockActivity.date).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const formattedTime = new Date(mockActivity.date).toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="activity-detail-container flex min-h-screen flex-col items-center">
			{/* <HeaderLogado /> */}

			<main className="w-full max-w-6xl mx-auto mt-10 md:mt-20 px-4">
				<Link to="/perfil" className="back-link flex items-center gap-2 font-semibold mb-6">
					<ArrowLeft size={20} />
					Voltar
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* --- Coluna Principal (Esquerda) --- */}
					<div className="lg:col-span-2">
						{/* Galeria de Imagens */}
						<div className="mb-6">
							<img
								src={mockActivity.images[0]}
								alt={mockActivity.title}
								className="w-full h-auto object-cover rounded-lg shadow-lg"
							/>
							<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
								{mockActivity.images.slice(1).map((img, index) => (
									<img
										key={index}
										src={img}
										alt={`${mockActivity.title} - ${index + 1}`}
										className="w-full h-auto object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
									/>
								))}
							</div>
						</div>

						{/* Título e Tags */}
						<h1 className="activity-title text-4xl font-bold mb-4">{mockActivity.title}</h1>
						<div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-gray-700">
							<div className="detail-badge">
								<MapPin size={16} />
								{mockActivity.location}
							</div>
							<div className="detail-badge">
								<Zap size={16} />
								{mockActivity.difficulty}
							</div>
							<div className="detail-badge">
								<Users size={16} />
								{mockActivity.participants.max} vagas no total
							</div>
						</div>

						{/* Descrição */}
						<h2 className="section-header">Sobre a atividade</h2>
						<p className="text-gray-600 leading-relaxed whitespace-pre-line">
							{mockActivity.description}
						</p>

						{/* Informações do Guia */}
						<div className="guide-info-card mt-8 flex items-center gap-4 p-4 rounded-lg">
							<img
								src={mockActivity.guide.profilePicture}
								alt={mockActivity.guide.name}
								className="w-16 h-16 rounded-full"
							/>
							<div>
								<p className="text-sm text-gray-600">Guiado por</p>
								<h3 className="text-xl font-bold guide-name">{mockActivity.guide.name}</h3>
								<Link
									to={`/perfil/${mockActivity.guide.id}`}
									className="text-sm font-semibold text-blue-600 hover:underline"
								>
									Ver perfil do guia
								</Link>
							</div>
						</div>
					</div>

					{/* --- Coluna de Ação (Direita) --- */}
					<div className="lg:col-span-1">
						<div className="action-card sticky top-24 bg-white p-6 rounded-lg shadow-xl">
							<h2 className="text-2xl font-bold mb-4 price-highlight">
								R$ {mockActivity.price.toFixed(2)}{" "}
								<span className="text-base font-normal text-gray-600">/ pessoa</span>
							</h2>

							<ul className="space-y-3 text-gray-800">
								<li className="flex items-center gap-3">
									<Calendar size={20} className="text-gray-500" />{" "}
									<div>
										<strong>Data:</strong> {formattedDate}
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Clock size={20} className="text-gray-500" />{" "}
									<div>
										<strong>Horário:</strong> {formattedTime}
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Hourglass size={20} className="text-gray-500" />{" "}
									<div>
										<strong>Duração:</strong> {mockActivity.duration / 24} dias
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Users size={20} className="text-gray-500" />{" "}
									<div>
										<strong>Vagas restantes:</strong> {availableSlots}
									</div>
								</li>
							</ul>

							{/* Botão de Ação Condicional */}
							<div className="mt-6">
								{isTurista && (
									<button className="action-button-primary w-full text-white font-bold py-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
										Reservar Vaga
									</button>
								)}
								{isOwner && (
									<Link
										to={`/atividade/editar/${mockActivity.id}`}
										className="action-button-secondary w-full text-center font-bold py-3 rounded-lg flex items-center justify-center gap-2"
									>
										<Edit size={18} />
										Editar Atividade
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="footer w-full py-6 mt-24">
				<div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
					<span>Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
				</div>
			</footer>
		</div>
	);
}
