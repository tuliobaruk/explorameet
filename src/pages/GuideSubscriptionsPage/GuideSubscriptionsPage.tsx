import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useUser } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { Users, Calendar, Clock, Mail, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import InscricaoService, { Inscricao } from '@/services/inscricaoService';


const statusColors = {
  'pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'confirmada': 'bg-green-100 text-green-800 border-green-200',
  'cancelada': 'bg-red-100 text-red-800 border-red-200',
  'cancelada_guia': 'bg-red-100 text-red-800 border-red-200',
  'nao_compareceu': 'bg-orange-100 text-orange-800 border-orange-200',
  'concluida': 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusLabels = {
  'pendente': 'Pendente',
  'confirmada': 'Confirmada',
  'cancelada': 'Cancelada',
  'cancelada_guia': 'Cancelada pelo Guia',
  'nao_compareceu': 'Não Compareceu',
  'concluida': 'Concluída',
};

const statusIcons = {
  'pendente': <Clock size={16} />,
  'confirmada': <CheckCircle size={16} />,
  'cancelada': <XCircle size={16} />,
  'cancelada_guia': <XCircle size={16} />,
  'nao_compareceu': <AlertCircle size={16} />,
  'concluida': <CheckCircle size={16} />,
};

export default function GuideSubscriptionsPage() {
  const { user, isGuide, guiaInfo } = useUser();
  const [subscriptions, setSubscriptions] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    if (!guiaInfo?.id) return;

    try {
      const data = await InscricaoService.findByGuia(guiaInfo.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (subscriptionId: string, newStatus: string) => {
    setUpdating(subscriptionId);
    try {
      await InscricaoService.update(subscriptionId, { status: newStatus });
      toast.success('Status da inscrição atualizado com sucesso!');
      fetchSubscriptions();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da inscrição');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    if (isGuide() && guiaInfo) {
      fetchSubscriptions();
    }
  }, [isGuide, guiaInfo]);

  if (!isGuide()) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg text-red-600">Acesso negado. Apenas guias podem acessar esta página.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--verde-oliva)" }}>
            Gerenciar Inscrições
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie as inscrições dos seus passeios
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "var(--verde-oliva)" }}>
              Carregando inscrições...
            </p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[rgba(137,143,41,0.1)]">
            <Eye size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-gray-500">
              Você ainda não possui inscrições em seus passeios.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(137,143,41,0.1)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--verde-oliva)" }}>
                      {subscription.passeio.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{subscription.cliente.perfil.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(subscription.horarioDisponivel.data_hora).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          {new Date(subscription.horarioDisponivel.data_hora).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{subscription.quantidade_pessoas} pessoas</span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${statusColors[subscription.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {statusIcons[subscription.status as keyof typeof statusIcons]}
                    {statusLabels[subscription.status as keyof typeof statusLabels] || subscription.status}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-3">
                    {subscription.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => updateSubscriptionStatus(subscription.id, 'confirmada')}
                          disabled={updating === subscription.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateSubscriptionStatus(subscription.id, 'cancelada_guia')}
                          disabled={updating === subscription.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                      </>
                    )}
                    
                    {subscription.status === 'confirmada' && (
                      <>
                        <button
                          onClick={() => updateSubscriptionStatus(subscription.id, 'concluida')}
                          disabled={updating === subscription.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Marcar como Concluída
                        </button>
                        <button
                          onClick={() => updateSubscriptionStatus(subscription.id, 'nao_compareceu')}
                          disabled={updating === subscription.id}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <AlertCircle size={16} />
                          Não Compareceu
                        </button>
                      </>
                    )}

                    <a
                      href={`tel:${subscription.cliente.perfil.celular}`}
                      className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Contatar Cliente
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}