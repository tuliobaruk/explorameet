import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useUser } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'react-toastify';
import { Users, Calendar, Clock, Phone, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw, Image as ImageIcon } from 'lucide-react';
import InscricaoService, { Inscricao } from '@/services/inscricaoService';
import { getDefaultPasseioImage } from "@/utils/utils";

const statusConfig = {
  pendente: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock size={16} />,
  },
  confirmada: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle size={16} />,
  },
  cancelada: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle size={16} />,
  },
  cancelada_guia: {
    label: 'Cancelada pelo Guia',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle size={16} />,
  },
  nao_compareceu: {
    label: 'Não Compareceu',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: <AlertCircle size={16} />,
  },
  concluida: {
    label: 'Concluída',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle size={16} />,
  },
};

type ClientInfo = {
  nome: string;
  celular: string;
};

export default function GuideSubscriptionsPage() {
  const { isGuide, guiaInfo } = useUser();
  const { notifications, unreadCount } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);

  const fetchSubscriptions = useCallback(async (showRefreshState = false) => {
    if (!guiaInfo?.id) return;
    if (showRefreshState) setRefreshing(true);
    try {
      const data = await InscricaoService.findByGuia(guiaInfo.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
      if (showRefreshState) setRefreshing(false);
    }
  }, [guiaInfo?.id]);

  const updateSubscriptionStatus = async (subscriptionId: string, newStatus: string) => {
    setUpdating(subscriptionId);
    try {
      await InscricaoService.update(subscriptionId, { status: newStatus });
      toast.success('Status da inscrição atualizado com sucesso!');
      await fetchSubscriptions();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da inscrição');
    } finally {
      setUpdating(null);
    }
  };

  const handleContactClick = (client: ClientInfo) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isGuide() && guiaInfo) {
      fetchSubscriptions();
    }
  }, [isGuide, guiaInfo, fetchSubscriptions]);

  useEffect(() => {
    const currentNotificationCount = notifications.filter(n => n.tipo === 'INSCRICAO_CLIENTE').length;
    if (lastNotificationCount > 0 && currentNotificationCount > lastNotificationCount) {
      fetchSubscriptions();
      toast.info('Nova inscrição recebida!');
    }
    setLastNotificationCount(currentNotificationCount);
  }, [notifications, lastNotificationCount, fetchSubscriptions]);

  useEffect(() => {
    if (!isGuide() || !guiaInfo) return;
    const interval = setInterval(() => {
      if (!document.hidden) fetchSubscriptions();
    }, 30000);
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchSubscriptions();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isGuide, guiaInfo, fetchSubscriptions]);

  if (!isGuide()) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg text-red-600">Acesso negado. Apenas guias podem acessar esta página.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-gray-800">
                Gerenciar Inscrições
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Visualize e gerencie as inscrições dos seus passeios.</p>
            </div>
            <button
              onClick={() => fetchSubscriptions(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              title="Atualizar inscrições"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-lg text-gray-600">Carregando inscrições...</p></div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border">
            <Eye size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-500">Você ainda não possui inscrições em seus passeios.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => {
              const currentStatus = statusConfig[sub.status as keyof typeof statusConfig] || { label: sub.status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <AlertCircle size={16} /> };
              const imageUrl = sub.passeio.imagens?.[0]?.url_imagem || getDefaultPasseioImage();

              return (
                <div key={sub.id} className="bg-white rounded-lg shadow-md border transition-shadow hover:shadow-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4">
                      {imageUrl ? (
                        <img src={imageUrl} alt={sub.passeio.titulo} className="w-full h-48 md:h-full object-cover" />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={48} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{sub.passeio.titulo}</h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                            <span className="flex items-center gap-2"><Users size={16} /> {sub.cliente.perfil.nome}</span>
                            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(sub.horarioDisponivel.data_hora).toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-2"><Clock size={16} /> {new Date(sub.horarioDisponivel.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-2"><Users size={16} /> {sub.quantidade_pessoas} pessoa(s)</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${currentStatus.color}`}>
                          {currentStatus.icon}
                          {currentStatus.label}
                        </div>
                      </div>
                      <div className="border-t pt-4 mt-4 flex flex-wrap items-center gap-3">
                        {sub.status === 'pendente' && (
                          <>
                            <button onClick={() => updateSubscriptionStatus(sub.id, 'confirmada')} disabled={updating === sub.id} className="btn-action bg-green-600 hover:bg-green-700"><CheckCircle size={16} /> Confirmar</button>
                            <button onClick={() => updateSubscriptionStatus(sub.id, 'cancelada_guia')} disabled={updating === sub.id} className="btn-action bg-red-600 hover:bg-red-700"><XCircle size={16} /> Cancelar</button>
                          </>
                        )}
                        {sub.status === 'confirmada' && (
                          <>
                            <button onClick={() => updateSubscriptionStatus(sub.id, 'concluida')} disabled={updating === sub.id} className="btn-action bg-blue-600 hover:bg-blue-700"><CheckCircle size={16} /> Concluída</button>
                            <button onClick={() => updateSubscriptionStatus(sub.id, 'nao_compareceu')} disabled={updating === sub.id} className="btn-action bg-orange-500 hover:bg-orange-600"><AlertCircle size={16} /> Não Compareceu</button>
                          </>
                        )}
                        <button onClick={() => handleContactClick(sub.cliente.perfil)} className="btn-action bg-gray-600 hover:bg-gray-700"><Phone size={16} /> Contatar Cliente</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />

      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Informações de Contato</h3>
            <div className="space-y-3">
              <p className="text-gray-700"><strong className="font-semibold">Nome:</strong> {selectedClient.nome}</p>
              <p className="text-gray-700"><strong className="font-semibold">Celular:</strong> {selectedClient.celular}</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <a href={`tel:${selectedClient.celular}`} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Phone size={16} /> Ligar
              </a>
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

