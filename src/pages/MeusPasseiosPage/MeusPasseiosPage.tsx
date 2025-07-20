import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Users, 
  Settings, 
  MessageSquare, 
  PlusCircle, 
  Send, 
  Edit,
  Trash2,
  BarChart2,
  Eye,
  DollarSign
} from "lucide-react";

// MOCK DATA ATUALIZADO
const mockPasseios = [
  { id: '1', nome: 'Travessia do Vale do Pati', data: '25/08/2025', participantes: 8, capacidade: 10, preco: 1250.00 },
  { id: '2', nome: 'Cachoeira da Fumaça por Cima', data: '30/08/2025', participantes: 5, capacidade: 12, preco: 150.00 },
  { id: '3', nome: 'Poço Azul e Poço Encantado', data: '10/09/2025', participantes: 12, capacidade: 12, preco: 200.00 },
];
const mockParticipantes = [
  { id: 'p1', nome: 'Ana Clara Ribeiro', avatar: 'https://i.pravatar.cc/40?u=a', status: 'Confirmado' },
  { id: 'p2', nome: 'Bruno Costa e Silva', avatar: 'https://i.pravatar.cc/40?u=b', status: 'Confirmado' },
  { id: 'p3', nome: 'Carla Dias', avatar: 'https://i.pravatar.cc/40?u=c', status: 'Pendente' },
];

// Componente para as abas, para deixar o código mais limpo
const TabButton = ({ label, activeTab, setActiveTab }: any) => (
  <button 
    onClick={() => setActiveTab(label.toLowerCase())}
    className={`px-4 py-3 font-semibold border-b-2 transition-colors text-sm md:text-base ${activeTab === label.toLowerCase() ? 'border-verde-oliva text-verde-oliva' : 'border-transparent text-gray-500 hover:text-verde-oliva'}`}
    style={{color: activeTab === label.toLowerCase() ? 'var(--verde-oliva)' : '', borderColor: activeTab === label.toLowerCase() ? 'var(--verde-oliva)' : ''}}
  >
    {label}
  </button>
);

export default function MeusPasseiosPage() {
  const [selectedPasseio, setSelectedPasseio] = useState(mockPasseios[0]);
  const [activeTab, setActiveTab] = useState("visão geral");

  const receitaEstimada = selectedPasseio.participantes * selectedPasseio.preco;

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      <div className="flex-1 flex overflow-hidden pt-20"> {/* pt-20 para o header fixo */}
        
        {/* ======================================= */}
        {/* PAINEL ESQUERDA - LISTA DE PASSEIOS      */}
        {/* ======================================= */}
        <aside className="w-1/3 md:w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold" style={{ color: 'var(--verde-oliva)' }}>Meus Passeios</h2>
            <Link to="/criar-passeio" title="Criar Novo Passeio">
                <PlusCircle size={22} className="text-[var(--verde-vibrante)] hover:opacity-80 transition-opacity" />
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {mockPasseios.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedPasseio(p)}
                className={`p-4 border-b cursor-pointer transition-colors ${selectedPasseio.id === p.id ? 'bg-green-50/50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}
              >
                <h3 className="font-semibold text-gray-800 truncate">{p.nome}</h3>
                <p className="text-sm text-gray-500">{p.data}</p>
              </div>
            ))}
          </nav>
        </aside>

        {/* ======================================= */}
        {/* PAINEL DIREITA - ÁREA DE TRABALHO       */}
        {/* ======================================= */}
        <main className="flex-1 flex flex-col bg-gray-50/50 overflow-y-auto">
          {/* Header da Área de Trabalho */}
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center sticky top-20 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedPasseio.nome}</h2>
              <p className="text-sm text-gray-500">Gerenciamento do Grupo</p>
            </div>
            <Link to={`/passeio/${selectedPasseio.id}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                <Eye size={16} /> Ver Página Pública
            </Link>
          </div>
          {/* Abas */}
          <div className="border-b border-gray-200 bg-white flex overflow-x-auto">
            <TabButton label="Visão Geral" activeTab={activeTab} setActiveTab={setActiveTab}/>
            <TabButton label="Participantes" activeTab={activeTab} setActiveTab={setActiveTab}/>
            <TabButton label="Chat do Grupo" activeTab={activeTab} setActiveTab={setActiveTab}/>
            <TabButton label="Editar Passeio" activeTab={activeTab} setActiveTab={setActiveTab}/>
            <TabButton label="Finanças" activeTab={activeTab} setActiveTab={setActiveTab}/>
            <TabButton label="Configurações" activeTab={activeTab} setActiveTab={setActiveTab}/>
          </div>
          
          {/* Conteúdo das Abas */}
          <div className="p-4 md:p-6 space-y-6">
            {activeTab === 'visão geral' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border"><h4 className="text-sm text-gray-500">Participantes</h4><p className="text-2xl font-bold">{selectedPasseio.participantes} / {selectedPasseio.capacidade}</p></div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border"><h4 className="text-sm text-gray-500">Receita Estimada</h4><p className="text-2xl font-bold">R$ {receitaEstimada.toFixed(2)}</p></div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border"><h4 className="text-sm text-gray-500">Próxima Data</h4><p className="text-2xl font-bold">{selectedPasseio.data}</p></div>
              </div>
            )}
            {activeTab === 'participantes' && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-bold mb-4" style={{color: 'var(--verde-oliva)'}}>Lista de Participantes</h3>
                  <ul className="space-y-3">
                      {mockParticipantes.map(p => <li key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                          <div className="flex items-center gap-3"><img src={p.avatar} className="w-8 h-8 rounded-full"/><span className="font-medium text-gray-700">{p.nome}</span></div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span>
                      </li>)}
                  </ul>
              </div>
            )}
            {activeTab === 'chat do grupo' && (
              <div className="bg-white rounded-lg shadow-sm border h-[60vh] flex flex-col">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Mensagens aqui */}
                    <div className="flex gap-2"><img src="https://i.pravatar.cc/40?u=a" className="w-8 h-8 rounded-full"/><div className="bg-gray-100 p-3 rounded-lg max-w-lg"><strong>Ana Clara:</strong> Pessoal, o ponto de encontro é na entrada do parque mesmo?</div></div>
                  </div>
                  <div className="p-4 border-t flex items-center gap-2">
                    <input type="text" placeholder="Enviar mensagem para o grupo..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-verde-vibrante" />
                    <button className="p-3 text-white rounded-full" style={{backgroundColor: 'var(--verde-vibrante)'}}><Send size={20}/></button>
                  </div>
              </div>
            )}
            {activeTab === 'editar passeio' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold mb-4" style={{color: 'var(--verde-oliva)'}}>Editar Informações do Passeio</h3>
                {/* Aqui seria renderizado o mesmo formulário da página 'CreateActivityPage', preenchido com os dados do passeio. */}
                <p className="text-gray-600">O formulário de edição do passeio apareceria aqui, permitindo alterar título, descrição, preços, etc.</p>
              </div>
            )}
            {activeTab === 'finanças' && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold mb-4" style={{color: 'var(--verde-oliva)'}}>Relatório Financeiro</h3>
                 <p className="text-gray-600">Uma tabela com o resumo de pagamentos dos participantes seria exibida aqui.</p>
              </div>
            )}
            {activeTab === 'configurações' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
                <h3 className="text-lg font-bold text-red-700 mb-4">Ações Destrutivas</h3>
                <div className="flex items-center justify-between p-4 border-t border-red-200">
                  <div>
                    <p className="font-semibold text-gray-800">Cancelar Passeio</p>
                    <p className="text-sm text-gray-600">Isso irá notificar todos os participantes e iniciar o processo de reembolso.</p>
                  </div>
                   <button className="px-4 py-2 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50">Cancelar Passeio</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}