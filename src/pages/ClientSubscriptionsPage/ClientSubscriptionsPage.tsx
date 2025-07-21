import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useUser } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Phone
} from 'lucide-react';
import InscricaoService, { Inscricao } from '@/services/inscricaoService';
import { Link } from 'react-router-dom';

const statusColors = {
  'pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'confirmada': 'bg-green-100 text-green-800 border-green-200',
  'cancelada': 'bg-red-100 text-red-800 border-red-200',
  'cancelada_guia': 'bg-red-100 text-red-800 border-red-200',
  'nao_compareceu': 'bg-orange-100 text-orange-800 border-orange-200',
  'concluida': 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusLabels = {
  'pendente': 'Aguardando Confirmação',
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

export default function ClientSubscriptionsPage() {
  const { user, isClient, clienteInfo } = useUser();
  const [subscriptions, setSubscriptions] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    if (!clienteInfo?.id) return;

    try {
      const data = await InscricaoService.findByCliente(clienteInfo.id);
      setSubscriptions(data);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      toast.error('Erro ao carregar suas inscrições');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Tem certeza de que deseja cancelar esta inscrição?')) {
      return;
    }

    setCancelling(subscriptionId);
    try {
      await InscricaoService.cancel(subscriptionId);
      toast.success('Inscrição cancelada com sucesso!');
      fetchSubscriptions();
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      toast.error('Erro ao cancelar inscrição');
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    if (isClient() && clienteInfo) {
      fetchSubscriptions();
    }
  }, [isClient, clienteInfo]);

  if (!isClient()) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
        <Header />
        <main className="flex-1 flex justify-center items-center pt-20">
          <p className="text-lg text-red-600">Acesso negado. Apenas clientes podem acessar esta página.</p>
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
            Minhas Inscrições
          </h1>
          <p className="text-gray-600">
            Acompanhe suas inscrições em passeios
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "var(--verde-oliva)" }}>
              Carregando suas inscrições...
            </p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[rgba(137,143,41,0.1)]">
            <Eye size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não se inscreveu em nenhum passeio.
            </p>
            <Link
              to="/explorar"
              className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-colors"
              style={{ backgroundColor: "var(--verde-vibrante)" }}
            >
              <MapPin size={16} className="mr-2" />
              Explorar Passeios
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(137,143,41,0.1)]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link 
                          to={`/passeio/${subscription.passeio.id}`}
                          className="text-xl font-semibold hover:underline transition-colors"
                          style={{ color: "var(--verde-oliva)" }}
                        >
                          {subscription.passeio.titulo}
                        </Link>
                        {subscription.passeio.descricao && (
                          <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                            {subscription.passeio.descricao.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                      <div className={`px-3 py-2 rounded-full border text-sm font-medium flex items-center gap-2 whitespace-nowrap ${statusColors[subscription.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {statusIcons[subscription.status as keyof typeof statusIcons]}
                        {statusLabels[subscription.status as keyof typeof statusLabels] || subscription.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(subscription.horarioDisponivel.data_hora_inicio).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          {new Date(subscription.horarioDisponivel.data_hora_inicio).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{subscription.quantidade_pessoas} pessoas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Inscrito em {new Date(subscription.data_inscricao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {subscription.passeio.valor && parseFloat(subscription.passeio.valor) > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Valor total:</span>
                          <span className="font-semibold text-lg" style={{ color: "var(--marrom-dourado)" }}>
                            R$ {(parseFloat(subscription.passeio.valor) * subscription.quantidade_pessoas).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/passeio/${subscription.passeio.id}`}
                      className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      style={{ borderColor: "var(--verde-oliva)", color: "var(--verde-oliva)" }}
                    >
                      <Eye size={16} />
                      Ver Passeio
                    </Link>

                    {(subscription.status === 'pendente' || subscription.status === 'confirmada') && (
                      <button
                        onClick={() => handleCancel(subscription.id)}
                        disabled={cancelling === subscription.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        {cancelling === subscription.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}

                    {subscription.status === 'concluida' && (
                      <Link
                        to={`/passeio/${subscription.passeio.id}#avaliacoes`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Avaliar Passeio
                      </Link>
                    )}
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