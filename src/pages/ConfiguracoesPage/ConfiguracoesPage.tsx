import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import { 
  Settings, 
  Users, 
  Shield, 
  FileText, 
  Tag, 
  Crown,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ConfiguracoesPage() {
  const { isLoading, isAdmin } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAdmin()) {
      toast.error("Acesso negado. Área restrita para administradores.");
      navigate("/");
    }
  }, [isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return null; // Evita flash antes do redirect
  }

  const adminLinks = [
    {
      title: "Validação de Guias",
      description: "Aprovar ou rejeitar cadastros de novos guias",
      href: "/admin/guias",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "Gerenciar Planos",
      description: "Criar, editar e gerenciar planos de assinatura",
      href: "/admin/planos",
      icon: Crown,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      title: "Restrições de Passeios",
      description: "Configurar restrições aplicáveis aos passeios",
      href: "/admin/restricoes",
      icon: Shield,
      color: "bg-red-50 text-red-700 border-red-200",
      iconColor: "text-red-600"
    },
    {
      title: "Categorias de Passeios",
      description: "Gerenciar categorias para classificação de passeios",
      href: "/admin/categorias",
      icon: Tag,
      color: "bg-green-50 text-green-700 border-green-200",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="configuracoes-container flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Settings size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
                Configurações do Sistema
              </h1>
              <p className="text-gray-600">Painel de administração do ExploraMeet</p>
            </div>
          </div>
          
          {/* Alert de Admin */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Área Administrativa</p>
              <p className="text-amber-700">
                Esta seção contém ferramentas de administração do sistema. Use com cuidado.
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Links Admin */}
        <div className="grid gap-4 sm:grid-cols-2">
          {adminLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={index}
                to={link.href}
                className="group block bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 p-6 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${link.color}`}>
                        <IconComponent size={20} className={link.iconColor} />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {link.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" 
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Seção de Informações */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Informações do Sistema
            </h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Versão do Sistema</div>
              <div className="font-semibold text-gray-900">ExploraMeet v1.0</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Ambiente</div>
              <div className="font-semibold text-gray-900">Produção</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-500">Última Atualização</div>
              <div className="font-semibold text-gray-900">
                {new Date().toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Informativo */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}