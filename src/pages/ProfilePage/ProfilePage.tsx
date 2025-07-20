import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Edit, PlusCircle, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Tipagem para os dados do usuário
type UserProfile = {
  name: string;
  role: "guia" | "turista";
  isPaid: boolean;
  location: string;
  bio: string;
  profilePicture: string;
};

// MOCK: Simula os dados do usuário logado.
const mockUser: UserProfile = {
  name: "Carlos Andrade",
  role: "guia", // ou "turista"
  isPaid: true,
  location: "Chapada Diamantina, BA",
  bio: "Guia experiente com 10 anos de trilhas na Chapada. Foco em geologia e botânica. Segurança e aventura em primeiro lugar!",
  profilePicture: "https://via.placeholder.com/150",
};

// MOCK: Lista de atividades
const mockActivities = [
  { id: 1, title: "Travessia do Vale do Pati", date: "25/08/2025", image: "https://via.placeholder.com/300x200?text=Vale+do+Pati" },
  { id: 2, title: "Cachoeira da Fumaça por Cima", date: "30/08/2025", image: "https://via.placeholder.com/300x200?text=Cachoeira+Fumaça" },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("atividades");

  useEffect(() => {
    // Simula uma chamada de API para buscar os dados do usuário
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg" style={{ color: 'var(--verde-oliva)' }}>Carregando seu perfil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20 flex-col gap-4">
          <p className="text-lg text-red-600">Não foi possível carregar o perfil.</p>
          <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--verde-vibrante)' }}>
            Tentar fazer login novamente
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isGuia = user.role === "guia";

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-20 pb-12">
        {/* Card de Perfil */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-[rgba(137,143,41,0.1)] flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.profilePicture}
            alt="Foto de Perfil"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4"
            style={{ borderColor: "rgba(130, 181, 91, 0.2)" }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--verde-oliva)' }}>{user.name}</h1>
              {user.isPaid && (
                <div className="p-2 rounded-full" title={isGuia ? "Perfil Impulsionado" : "Usuário Prioritário"} style={{ color: 'var(--marrom-dourado)', backgroundColor: 'rgba(140, 116, 45, 0.1)' }}>
                  {isGuia ? <Star size={22} /> : <ShieldCheck size={22} />}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
            <p className="text-gray-700 mt-3">{user.bio}</p>
          </div>
          <button className="font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 border-2 hover:bg-gray-100" style={{ color: 'var(--verde-oliva)', borderColor: 'var(--verde-oliva)' }}>
            <Edit size={18} />
            Editar Perfil
          </button>
        </section>

        {/* Abas de Navegação */}
        <section className="w-full mt-8">
          <div className="border-b border-gray-200 flex justify-center md:justify-start">
            <button onClick={() => setActiveTab("atividades")} className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'atividades' ? 'border-verde-oliva text-verde-oliva' : 'border-transparent text-gray-500 hover:text-verde-oliva'}`} style={{color: activeTab === 'atividades' ? 'var(--verde-oliva)' : '', borderColor: activeTab === 'atividades' ? 'var(--verde-oliva)' : ''}}>
              {isGuia ? "Minhas Atividades" : "Minhas Aventuras"}
            </button>
            <button onClick={() => setActiveTab("avaliacoes")} className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'avaliacoes' ? 'border-verde-oliva text-verde-oliva' : 'border-transparent text-gray-500 hover:text-verde-oliva'}`} style={{color: activeTab === 'avaliacoes' ? 'var(--verde-oliva)' : '', borderColor: activeTab === 'avaliacoes' ? 'var(--verde-oliva)' : ''}}>
              Avaliações
            </button>
            <button onClick={() => setActiveTab("configuracoes")} className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'configuracoes' ? 'border-verde-oliva text-verde-oliva' : 'border-transparent text-gray-500 hover:text-verde-oliva'}`} style={{color: activeTab === 'configuracoes' ? 'var(--verde-oliva)' : '', borderColor: activeTab === 'configuracoes' ? 'var(--verde-oliva)' : ''}}>
              Configurações
            </button>
          </div>
        </section>

        {/* Conteúdo das Abas */}
        <section className="w-full mt-6">
          {activeTab === "atividades" && (
            <div>
              {isGuia && (
                <Link to="/criar-atividade">
                  <button className="w-full md:w-auto text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2 mb-6" style={{ backgroundColor: 'var(--verde-vibrante)' }}>
                    <PlusCircle size={20} />
                    Criar Nova Atividade
                  </button>
                </Link>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-[rgba(137,143,41,0.1)]">
                    <img src={activity.image} alt={activity.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Data: {activity.date}</p>
                      {isGuia && (
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 text-sm font-semibold py-2 px-3 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">Editar</button>
                          <button className="flex-1 text-sm font-semibold py-2 px-3 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">Ver inscritos</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "avaliacoes" && (
            <div className="text-center p-10 bg-white rounded-lg shadow-md border border-[rgba(137,143,41,0.1)]">
              <h3 className="text-xl font-semibold text-gray-800">Seção de Avaliações</h3>
              <p className="text-gray-600 mt-2">Aqui serão exibidas as avaliações {isGuia ? "recebidas" : "feitas por você"}.</p>
            </div>
          )}
          {activeTab === "configuracoes" && (
            <div className="text-center p-10 bg-white rounded-lg shadow-md border border-[rgba(137,143,41,0.1)]">
              <h3 className="text-xl font-semibold text-gray-800">Seção de Configurações</h3>
              <p className="text-gray-600 mt-2">Aqui você poderá alterar seus dados, senha e preferências.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}