import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Zap,
  Users,
  Hourglass,
  Edit,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import PasseioService, { Passeio } from "@/services/passeioService";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ActivityDetailPage.css";

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

export default function ActivityDetailPage() {
  const { passeioId } = useParams<{ passeioId: string }>();
  const [passeio, setPasseio] = useState<Passeio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
	if (!passeioId) return;
	setLoading(true);
	PasseioService.getPasseioById(passeioId)
	  .then(setPasseio)
	  .catch(() => setError("Não foi possível carregar o passeio."))
	  .finally(() => setLoading(false));
  }, [passeioId]);

  if (loading) {
	return (
	  <div className="min-h-screen bg-gray-50">
		<Header />
		<div className="activity-detail-container flex min-h-screen items-center justify-center pt-20">
		  Carregando passeio...
		</div>
	  </div>
	);
  }
  if (error || !passeio) {
	return (
	  <div className="min-h-screen bg-gray-50">
		<Header />
		<div className="activity-detail-container flex min-h-screen items-center justify-center text-red-600 pt-20">
		  {error || "Passeio não encontrado."}
		</div>
	  </div>
	);
  }

  const isOwner = user && user.role === "GUIA" && user.id === passeio.guia.id;
  const isTurista = user && user.role === "CLIENTE";
  const formattedPrice = `R$ ${parseFloat(passeio.valor).toFixed(2).replace('.', ',')}`;
  const defaultImage = "/default-image.png";
  const imagens = passeio.imagens && passeio.imagens.length > 0 ? passeio.imagens : [{ url_imagem: defaultImage, descricao: passeio.titulo }];
  const qtdPessoas = passeio.qtd_pessoas || 0;
  const duracaoDias = Math.round((passeio.duracao_passeio || 0) / 24 * 10) / 10;

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  
  return (
	<div className="min-h-screen bg-gray-50">
	  <Header />
	  <div className="activity-detail-container flex min-h-screen flex-col items-center">
		<main className="w-full max-w-6xl mx-auto mt-10 md:mt-20 px-4 pt-20">
		<Link to="/explorar" className="back-link flex items-center gap-2 font-semibold mb-6">
		  <ArrowLeft size={20} />
		  Voltar
		</Link>

		<div className="flex flex-col lg:flex-row gap-8">
		  <div className="flex-1 lg:w-2/3">
			<div className="mb-6">
			  <Carousel
				responsive={responsive}
				infinite={imagens.length > 1}
				showDots={imagens.length > 1}
				arrows={imagens.length > 1}
				autoPlay={false}
				keyBoardControl={true}
				customTransition="all .5s"
				transitionDuration={500}
				containerClass="carousel-container"
				removeArrowOnDeviceType={["tablet", "mobile"]}
				itemClass="carousel-item-padding-40-px"
			  >
				{imagens.map((img, index) => (
				  <div key={index} className="w-full">
					<img
					  src={img.url_imagem}
					  alt={img.descricao}
					  className="w-full h-96 object-cover rounded-lg shadow-lg"
					  onError={(e) => {
						e.currentTarget.src = defaultImage;
					  }}
					/>
				  </div>
				))}
			  </Carousel>
			</div>

			<h1 className="activity-title text-4xl font-bold mb-4">{passeio.titulo}</h1>
			<div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-gray-700">
			  <div className="detail-badge">
				<MapPin size={16} />
				Passeio
			  </div>
			  <div className="detail-badge">
				<Zap size={16} />
				{passeio.nivel_dificuldade ? `Dificuldade: ${passeio.nivel_dificuldade}` : "Dificuldade não informada"}
			  </div>
			  <div className="detail-badge">
				<Users size={16} />
				{qtdPessoas} vagas no total
			  </div>
			</div>

			<h2 className="section-header">Sobre a atividade</h2>
			<p className="text-gray-600 leading-relaxed whitespace-pre-line">
			  {passeio.descricao}
			</p>

			{passeio.restricoes && passeio.restricoes.length > 0 && (
			  <div className="mt-6">
				<h2 className="section-header">Restrições</h2>
				<ul className="list-disc pl-6 text-gray-700">
				  {passeio.restricoes.map((r) => (
					<li key={r.id}>{r.descricao}</li>
				  ))}
				</ul>
			  </div>
			)}

			<div className="guide-info-card mt-8 flex items-center gap-4 p-4 rounded-lg">
			  <img
				src={passeio.guia.perfil.foto || "/default-image.png"}
				alt={passeio.guia.perfil.nome}
				className="w-16 h-16 rounded-full"
			  />
			  <div>
				<p className="text-sm text-gray-600">Guiado por</p>
				<h3 className="text-xl font-bold guide-name">{passeio.guia.perfil.nome}</h3>
				<Link
				  to={`/guia/${passeio.guia.id}`}
				  className="text-sm font-semibold text-blue-600 hover:underline"
				>
				  Ver perfil do guia
				</Link>
			  </div>
			</div>
		  </div>

		  <div className="lg:w-1/3">
			<div className="action-card sticky top-24 bg-white p-6 rounded-lg shadow-xl">
			  <h2 className="text-2xl font-bold mb-4 price-highlight">
				{formattedPrice} <span className="text-base font-normal text-gray-600">/ pessoa</span>
			  </h2>

			  <ul className="space-y-3 text-gray-800">
				<li className="flex items-center gap-3">
				  <Hourglass size={20} className="text-gray-500" />
				  <div>
					<strong>Duração:</strong> {duracaoDias} dias
				  </div>
				</li>
				<li className="flex items-center gap-3">
				  <Users size={20} className="text-gray-500" />
				  <div>
					<strong>Vagas:</strong> {qtdPessoas}
				  </div>
				</li>
			  </ul>

			  <div className="mt-6">
				{isTurista && (
				  <button className="action-button-primary w-full text-white font-bold py-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
					Reservar Vaga
				  </button>
				)}
				{isOwner && (
				  <Link
					to={`/atividade/editar/${passeio.id}`}
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

		{/* Seção de Avaliações */}
		<div className="mt-12">
		  <h2 className="text-2xl font-bold text-gray-800 mb-6">Avaliações dos Turistas</h2>
		  {passeio.avaliacoes && passeio.avaliacoes.length > 0 ? (
			<div className="space-y-6">
			  {passeio.avaliacoes.map((avaliacao) => (
				<div key={avaliacao.id} className="review-card bg-white p-6 rounded-lg shadow-md border border-gray-200">
				  <div className="flex justify-between items-start mb-4">
					<div>
					  <h4 className="font-bold text-gray-800">Turista</h4>
					  <p className="text-sm text-gray-500">
						{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
						  day: '2-digit',
						  month: 'long',
						  year: 'numeric'
						})}
					  </p>
					</div>
					<StarRating rating={avaliacao.nota} />
				  </div>
				  <p className="text-gray-700">{avaliacao.comentario}</p>
				</div>
			  ))}
			</div>
		  ) : (
			<div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
			  <p className="text-gray-600">Nenhuma avaliação ainda. Seja o primeiro a avaliar esta atividade!</p>
			</div>
		  )}
		</div>
	  </main>

	  <footer className="footer w-full py-6 mt-24">
		<div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
		  <span>Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
		</div>
	  </footer>
	</div>
  </div>
  );
}
