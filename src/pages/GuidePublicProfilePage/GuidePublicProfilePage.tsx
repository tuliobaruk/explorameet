import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Award, ThumbsUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer"; // Importando o novo Footer

// ... (O restante do seu código, como a tipagem 'Guide' e o mock 'mockGuideData', permanece o mesmo) ...
type Guide = {
  id: string;
  name: string;
  profilePicture: string;
  isPaid: boolean;
  location: string;
  bio: string;
  stats: {
    averageRating: number;
    totalActivities: number;
    yearsOfExperience: number;
  };
  activities: {
    id: number;
    title: string;
    image: string;
    price: number;
  }[];
  reviews: {
    id: number;
    touristName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
};

const mockGuideData: Guide = {
  id: "carlos-andrade",
  name: "Carlos Andrade",
  profilePicture: "https://via.placeholder.com/150",
  isPaid: true,
  location: "Chapada Diamantina, BA",
  bio: "Guia experiente com 10 anos de trilhas na Chapada. Foco em geologia e botânica. Minha missão é proporcionar aventuras seguras, conscientes e inesquecíveis, respeitando a natureza e a cultura local.",
  stats: {
    averageRating: 4.9,
    totalActivities: 38,
    yearsOfExperience: 10,
  },
  activities: [
    { id: 1, title: "Travessia do Vale do Pati - 3 Dias", image: "https://via.placeholder.com/300x200?text=Vale+do+Pati", price: 1250.00 },
    { id: 2, title: "Cachoeira da Fumaça por Cima", image: "https://via.placeholder.com/300x200?text=Cachoeira+Fumaça", price: 150.00 },
  ],
  reviews: [
    { id: 1, touristName: "Mariana Silva", rating: 5, comment: "Carlos é um guia incrível! Super atencioso, conhece tudo sobre o local e nos passou muita segurança.", date: "10 de Julho, 2025" },
    { id: 2, touristName: "João V.", rating: 5, comment: "Experiência única! A organização foi impecável e o conhecimento do Carlos sobre a fauna e flora enriqueceu demais o passeio.", date: "28 de Junho, 2025" },
  ]
};

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => (
                <Star 
                  key={index} 
                  size={18}
                  style={{ 
                    color: index < Math.round(rating) ? 'var(--amarelo-estrela, #facc15)' : '#d1d5db' 
                  }}
                />
            ))}
        </div>
    );
};


export default function GuidePublicProfilePage() {
  const [guia, setGuia] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGuia(mockGuideData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // O layout dos estados de 'loading' e 'not found' também precisa do espaçamento
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg" style={{ color: 'var(--verde-oliva)' }}>Carregando perfil do guia...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!guia) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg text-red-600">Guia não encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      
      {/* AQUI ESTÁ A CORREÇÃO PRINCIPAL */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-20 pb-12">
        {/* O 'pt-20' cria o espaço para o header fixo. O 'pb-12' cria um respiro antes do footer. */}
        
        {/* Card de Apresentação */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-[rgba(137,143,41,0.1)] flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* ... o resto do conteúdo do card ... */}
            <img
            src={guia.profilePicture}
            alt={`Foto de ${guia.name}`}
            className="w-32 h-32 rounded-full object-cover border-4"
            style={{ borderColor: "rgba(130, 181, 91, 0.2)" }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--verde-oliva)' }}>{guia.name}</h1>
              {guia.isPaid && (
                <div className="p-2 rounded-full" title="Guia Verificado" style={{ color: 'var(--marrom-dourado)', backgroundColor: 'rgba(140, 116, 45, 0.1)' }}>
                  <ShieldCheck size={22} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
              <MapPin size={16} />
              <span>{guia.location}</span>
            </div>
            <p className="text-gray-700 mt-3">{guia.bio}</p>
          </div>
        </section>

        {/* ... todo o restante do conteúdo da página (stats, activities, reviews) ... */}
        {/* Destaques Rápidos */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[rgba(137,143,41,0.1)] flex items-center gap-4" style={{ color: 'var(--verde-oliva)' }}>
            <Star size={24} />
            <div><strong>{guia.stats.averageRating.toFixed(1)}</strong><p className="text-sm text-gray-500">Avaliação Média</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[rgba(137,143,41,0.1)] flex items-center gap-4" style={{ color: 'var(--verde-oliva)' }}>
            <ThumbsUp size={24} />
            <div><strong>{guia.stats.totalActivities}</strong><p className="text-sm text-gray-500">Passeios Realizados</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[rgba(137,143,41,0.1)] flex items-center gap-4" style={{ color: 'var(--verde-oliva)' }}>
            <Award size={24} />
            <div><strong>{guia.stats.yearsOfExperience}</strong><p className="text-sm text-gray-500">Anos de Experiência</p></div>
          </div>
        </section>

        {/* Catálogo de Atividades */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6" style={{ color: 'var(--verde-oliva)', borderColor: 'rgba(137, 143, 41, 0.15)' }}>Atividades oferecidas por {guia.name.split(' ')[0]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {guia.activities.map((activity) => (
              <Link to={`/passeio/${activity.id}`} key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 border border-[rgba(137,143,41,0.1)] hover:shadow-lg">
                <img src={activity.image} alt={activity.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{activity.title}</h3>
                  <p className="text-md font-semibold mt-2" style={{ color: 'var(--marrom-dourado)' }}>R$ {activity.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Avaliações */}
        <section>
          <h2 className="text-2xl font-bold border-b pb-2 mb-6" style={{ color: 'var(--verde-oliva)', borderColor: 'rgba(137, 143, 41, 0.15)' }}>O que os turistas dizem</h2>
          <div className="space-y-6 mt-6">
            {guia.reviews.map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-lg shadow-sm" style={{ borderLeft: '4px solid var(--verde-vibrante)' }}>
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

      <Footer />
    </div>
  );
}