import { Link } from "react-router-dom";
import { Mountain, Users, Leaf, ShieldCheck } from "lucide-react";
import explorationPicture from "@/assets/exploration.png";
import "./HomePage.css";

export default function HomePage() {
	return (
		<div className="homepage-container flex min-h-screen flex-col items-center">
			<header className="w-full h-20 fixed top-0 left-0 right-0 z-50 flex justify-between items-center max-w-full mx-auto py-6 px-4 md:px-10 bg-white/80 backdrop-blur-md shadow-sm">
				<div className="header-logo text-3xl font-bold flex items-center gap-2">
					<Mountain size={32} />
					<span>ExploraMeet</span>
				</div>

				<nav className="hidden md:flex gap-6 text-lg items-center">
					<a
						href="#"
						className="nav-link text-gray-700 px-3 py-2 rounded-md transition duration-300"
					>
						Início
					</a>
					<a
						href="#para-turistas"
						className="nav-link text-gray-700 px-3 py-2 rounded-md transition duration-300"
					>
						Para Turistas
					</a>
					<a
						href="#para-guias"
						className="nav-link text-gray-700 px-3 py-2 rounded-md transition duration-300"
					>
						Para Guias
					</a>
					<Link to="/login">
						<button className="nav-button-acessar text-white font-bold px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
							Acessar
						</button>
					</Link>
				</nav>
				<button className="md:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-menu"
					>
						<line x1="4" x2="20" y1="12" y2="12" />
						<line x1="4" x2="20" y1="6" y2="6" />
						<line x1="4" x2="20" y1="18" y2="18" />
					</svg>
				</button>
			</header>

			<main className="w-full flex flex-col items-center max-w-6xl mx-auto mt-32 px-4 ">
				<section className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
					<div className="flex flex-col items-center md:items-start">
						<h1 className="hero-title text-5xl lg:text-6xl font-extrabold">
							Natureza ao seu alcance. <br />
							<span className="hero-subtitle">Experiências que transformam.</span>
						</h1>
						<p className="text-xl text-gray-700 mt-6 max-w-2xl">
							Conectamos você à natureza brasileira de forma autêntica e consciente. Fuja da rotina
							e encontre aventuras memoráveis com os melhores guias de ecoturismo.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
							<Link to="/explorar" className="w-full">
								<button className="hero-button-explorar w-full text-white font-bold px-8 py-4 rounded-lg shadow-xl transition-transform duration-300 hover:scale-105">
									Explorar Trilhas
								</button>
							</Link>
							<Link to="/sou-guia" className="w-full">
								<button className="hero-button-guia w-full font-bold px-8 py-4 rounded-lg shadow-xl transition-transform duration-300 hover:scale-105">
									Sou Guia
								</button>
							</Link>
						</div>
					</div>
					<div className="flex-shrink-0 mt-8 md:mt-0">
						<img
							src={explorationPicture}
							alt="Ilustração de uma pessoa explorando a natureza"
							className="rounded-lg shadow-2xl w-full max-w-md"
						/>
					</div>
				</section>

				<section id="sobre" className="mt-24 py-16 text-center">
					<h2 className="section-title text-4xl font-bold mb-4">
						Mais que uma plataforma, um ecossistema
					</h2>
					<p className="text-lg text-gray-700 mt-4 max-w-4xl mx-auto">
						A ExploraMeet simplifica a descoberta e reserva de experiências de ecoturismo.
						Oferecemos um ecossistema com informações educativas e uma comunidade que valoriza a
						autenticidade e a preservação. Sua trilha será uma história de descoberta, segurança e
						respeito, tudo com a facilidade da tecnologia.
					</p>
				</section>

				<section id="features" className="mt-16 w-full">
					<h2 className="section-title text-4xl font-bold text-center mb-12">
						Sua aventura começa aqui
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
						<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
							<ShieldCheck size={48} className="feature-icon mb-4" />
							<h3 className="text-xl font-bold mb-2">Experiências Seguras</h3>
							<p className="text-gray-600">
								Garantimos experiências autênticas e seguras com guias verificados.
							</p>
						</div>
						<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
							<Leaf size={48} className="feature-icon mb-4" />
							<h3 className="text-xl font-bold mb-2">Conexão Consciente</h3>
							<p className="text-gray-600">
								Promovemos a conexão consciente com a natureza e o turismo sustentável.
							</p>
						</div>
						<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
							<Users size={48} className="feature-icon mb-4" />
							<h3 className="text-xl font-bold mb-2">Comunidade Engajada</h3>
							<p className="text-gray-600">
								Construímos uma comunidade de exploradores e guias apaixonados.
							</p>
						</div>
						<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
							<Mountain size={48} className="feature-icon mb-4" />
							<h3 className="text-xl font-bold mb-2">Descoberta Simplificada</h3>
							<p className="text-gray-600">
								Simplificamos a descoberta de trilhas com filtros fáceis de usar.
							</p>
						</div>
					</div>
				</section>

				<section
					id="para-turistas"
					className="mt-24 w-full bg-white py-16 px-8 rounded-lg shadow-xl"
				>
					<div className="text-center">
						<h2 className="section-title-destaque text-4xl font-bold">Para Você, Turista</h2>
						<h3 className="text-2xl font-light mt-2 text-gray-700">
							O herói da sua própria aventura
						</h3>
						<p className="mt-6 text-lg max-w-3xl mx-auto text-gray-600">
							Entendemos o seu desejo por aventura autêntica e a frustração de não saber por onde
							começar. Deixe a rotina para trás e viva experiências transformadoras, crie memórias
							inesquecíveis e reconecte-se com o essencial.
						</p>
					</div>
				</section>

				<section id="para-guias" className="mt-16 w-full py-16">
					<div className="text-center">
						<h2 className="section-title-destaque text-4xl font-bold">Para Você, Guia</h2>
						<h3 className="text-2xl font-light mt-2 text-gray-700">
							O guia que leva heróis a novas jornadas
						</h3>
						<p className="mt-6 text-lg max-w-3xl mx-auto text-gray-600">
							Sabemos como é desafiador alcançar mais pessoas e gerenciar tudo sozinho. Aumente sua
							visibilidade, simplifique a gestão de reservas e tenha mais tempo para se dedicar à
							sua paixão: guiar.
						</p>
					</div>
				</section>
			</main>

			<footer className="footer w-full py-6 mt-24">
				<div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
					<span className="mb-2">Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
				</div>
			</footer>
		</div>
	);
}
