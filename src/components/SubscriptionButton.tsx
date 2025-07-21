import { useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { Passeio } from '@/services/passeioService';
import InscricaoService from '@/services/inscricaoService';

interface SubscriptionButtonProps {
  passeio: Passeio;
  clienteId: string;
}

export function SubscriptionButton({ passeio, clienteId }: SubscriptionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedSchedule) {
      toast.error('Selecione um horário disponível');
      return;
    }

    if (numberOfPeople < 1) {
      toast.error('Número de pessoas deve ser pelo menos 1');
      return;
    }

    setLoading(true);
    try {
      const inscricaoData = {
        id_passeio: passeio.id,
        id_cliente: clienteId,
        id_horario_disponivel: selectedSchedule,
        quantidade_pessoas: numberOfPeople,
      };
      
      console.log('Dados sendo enviados:', inscricaoData);
      
      const result = await InscricaoService.create(inscricaoData);
      console.log('Resultado da inscrição:', result);
      
      toast.success('Inscrição realizada com sucesso!');
      setShowModal(false);
    } catch (error: unknown) {
      console.error('Erro ao realizar inscrição:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message) 
        : 'Erro ao realizar inscrição';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const availableSchedules = passeio.horariosDisponiveis?.filter(
    h => h.vagas_disponiveis > 0
  ) || [];

  if (availableSchedules.length === 0) {
    return (
      <button
        disabled
        className="w-full text-white font-bold py-3 rounded-lg shadow-md opacity-50 cursor-not-allowed"
        style={{ backgroundColor: "var(--verde-vibrante)" }}
      >
        Sem horários disponíveis
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full text-white font-bold py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
        style={{ backgroundColor: "var(--verde-vibrante)" }}
      >
        Reservar Vaga
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--verde-oliva)" }}>
              Reservar Vaga
            </h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{passeio.titulo}</h3>
              <p className="text-gray-600 text-sm">
                Selecione o horário e número de pessoas para sua reserva
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horários Disponíveis
              </label>
              <div className="space-y-2">
                {availableSchedules.map((schedule) => (
                  <label
                    key={schedule.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSchedule === schedule.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="schedule"
                      value={schedule.id}
                      checked={selectedSchedule === schedule.id}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="font-medium">
                          {new Date(schedule.data_hora).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>
                            {new Date(schedule.data_hora).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{schedule.vagas_disponiveis} vagas</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Pessoas
              </label>
              <input
                type="number"
                id="numberOfPeople"
                min="1"
                max={selectedSchedule ? availableSchedules.find(s => s.id === selectedSchedule)?.vagas_disponiveis : 1}
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {passeio.valor && parseFloat(passeio.valor) > 0 && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor por pessoa:</span>
                  <span className="font-semibold">
                    R$ {parseFloat(passeio.valor).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span style={{ color: "var(--marrom-dourado)" }}>
                    R$ {(parseFloat(passeio.valor) * numberOfPeople).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubscribe}
                disabled={loading || !selectedSchedule}
                className="flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: "var(--verde-vibrante)" }}
              >
                {loading ? 'Processando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}