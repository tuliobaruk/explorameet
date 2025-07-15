import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Star, ShieldCheck, MapPin, Edit, PlusCircle } from "lucide-react";

// Suponha que temos um Header para usuários logados
// import HeaderLogado from "../../components/HeaderLogado";

import "./ProfilePage.css";

// MOCK: Simula os dados do usuário logado.
// Para testar, troque o 'role' entre "guia" e "turista".
const mockUser = {
  name: "Carlos Andrade",
  role: "guia", // ou "turista"
  isPaid: true, // MOCK: para mostrar o selo de perfil impulsionado/prioritário
  location: "Chapada Diamantina, BA",
  bio: "Guia experiente com 10 anos de trilhas na Chapada. Foco em geologia e botânica. Segurança e aventura em primeiro lugar!",
  profilePicture: "https://via.placeholder.com/150", // URL da foto de perfil
};

// MOCK: Lista de atividades criadas pelo guia ou contratadas pelo turista
const mockActivities = [
    { id: 1, title: "Travessia do Vale do Pati", date: "25/08/2025", image: "https://via.placeholder.com/300x200?text=Vale+do+Pati" },
    { id: 2, title: "Cachoeira da Fumaça por Cima", date: "30/08/2025", image: "https://via.placeholder.com/300x200?text=Cachoeira+Fumaça" }
];


export default function ProfilePage() {
  // Controle de estado para as abas
  const [activeTab, setActiveTab] = useState("atividades");

  const isGuia = mockUser.role === "guia";

  return (
    <div className="profile-container flex min-h-screen flex-col items-center">
      {/* <HeaderLogado /> */}
      
      <main className="w-full flex flex-col items-center max-w-5xl mx-auto mt-10 md:mt-20 px-4">
        {/* --- Card de Perfil --- */}
        <section className="profile-card w-full bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-6">
          <img
            src={mockUser.profilePicture}
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="profile-name text-3xl font-bold">{mockUser.name}</h1>
              {mockUser.isPaid && (
                <div className="premium-badge" title={isGuia ? "Perfil Impulsionado" : "Usuário Prioritário"}>
                  {isGuia ? <Star size={22} /> : <ShieldCheck size={22} />}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
              <MapPin size={16} />
              <span>{mockUser.location}</span>
            </div>
            <p className="text-gray-700 mt-3">{mockUser.bio}</p>
          </div>
          <button className="profile-edit-button font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <Edit size={18} />
            Editar Perfil
          </button>
        </section>

        {/* --- Abas de Navegação --- */}
        <section className="w-full mt-8">
          <div className="tabs-container border-b border-gray-200 flex justify-center md:justify-start">
            <button
              onClick={() => setActiveTab("atividades")}
              className={`tab-button ${activeTab === "atividades" ? "active" : ""}`}
            >
              {isGuia ? "Minhas Atividades" : "Minhas Aventuras"}
            </button>
            <button
              onClick={() => setActiveTab("avaliacoes")}
              className={`tab-button ${activeTab === "avaliacoes" ? "active" : ""}`}
            >
              Avaliações
            </button>
            <button
              onClick={() => setActiveTab("configuracoes")}
              className={`tab-button ${activeTab === "configuracoes" ? "active" : ""}`}
            >
              Configurações
            </button>
          </div>
        </section>

        {/* --- Conteúdo das Abas --- */}
        <section className="w-full mt-6">
          {activeTab === "atividades" && (
            <div>
              {isGuia && (
                 <Link to="/criar-atividade">
                    <button className="create-activity-button w-full md:w-auto text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2 mb-6">
                        <PlusCircle size={20} />
                        Criar Nova Atividade
                    </button>
                </Link>
              )}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockActivities.map(activity => (
                        <div key={activity.id} className="activity-card bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={activity.image} alt={activity.title} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{activity.title}</h3>
                                <p className="text-sm text-gray-600">Data: {activity.date}</p>
                                {isGuia && (
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 text-sm font-semibold py-2 px-3 rounded-md bg-gray-200 hover:bg-gray-300">Editar</button>
                                        <button className="flex-1 text-sm font-semibold py-2 px-3 rounded-md bg-gray-200 hover:bg-gray-300">Ver inscritos</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
               </div>
            </div>
          )}
           {activeTab === "avaliacoes" && (
             <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Seção de Avaliações</h3>
                <p className="text-gray-600 mt-2">Aqui serão exibidas as avaliações {isGuia ? "recebidas" : "feitas por você"}.</p>
             </div>
           )}
           {activeTab === "configuracoes" && (
             <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Seção de Configurações</h3>
                <p className="text-gray-600 mt-2">Aqui você poderá alterar seus dados, senha e preferências.</p>
             </div>
           )}
        </section>
      </main>
      
       {/* O Footer pode ser importado como um componente também */}
      <footer className="footer w-full py-6 mt-24">
        <div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
          <span>Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}