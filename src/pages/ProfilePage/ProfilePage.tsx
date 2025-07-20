import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Edit, PlusCircle, User, Settings, LogOut } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUser, useAuthContext } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useUser();
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("atividades");

  if (isLoading) {
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

  if (!isAuthenticated || !user) {
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

  const isGuia = user.role === "GUIA";

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-20 pb-12">
        <section className="bg-white p-6 rounded-lg shadow-md border border-[rgba(137,143,41,0.1)] flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=898f29&color=fff`}
            alt="Foto de Perfil"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4"
            style={{ borderColor: "rgba(130, 181, 91, 0.2)" }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--verde-oliva)' }}>{user.name}</h1>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600">
              <MapPin size={16} />
              <span>{user.profile?.celular}</span>
            </div>
            <p className="text-gray-700 mt-3">{user.email}</p>
          </div>
          <button onClick={() => navigate("/perfil/editar")} className="font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 border-2 hover:bg-gray-100" style={{ color: 'var(--verde-oliva)', borderColor: 'var(--verde-oliva)' }}>
            <Edit size={18} />
            Editar Perfil
          </button>
        </section>

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

        <section className="w-full mt-6">
          {activeTab === "atividades" && (
            <div>
              {isGuia && (
                <Link to="/criar-passeio">
                  <button className="w-full md:w-auto text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2 mb-6" style={{ backgroundColor: 'var(--verde-vibrante)' }}>
                    <PlusCircle size={20} />
                    Criar Nova Atividade
                  </button>
                </Link>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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