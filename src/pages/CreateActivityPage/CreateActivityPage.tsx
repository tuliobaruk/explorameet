import { Link } from "react-router-dom";
import { ArrowLeft, ImageUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Definindo um estilo base para os inputs para evitar repetição
const inputStyle = "w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50";

export default function CreateActivityPage() {
  return (
    // 1. Estrutura de layout principal atualizada
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />

      {/* 2. Main com espaçamento correto para o header fixo */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="w-full mb-6">
          <Link 
            to="/perfil" 
            className="flex items-center gap-2 font-semibold transition-colors hover:underline"
            style={{ color: 'var(--marrom-dourado)' }}
          >
            <ArrowLeft size={20} />
            Voltar para o Perfil
          </Link>
        </div>

        {/* 3. Estilos do card e do formulário atualizados para o novo padrão */}
        <div className="w-full bg-white p-8 rounded-lg shadow-md border border-[rgba(137,143,41,0.1)]">
          <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--verde-oliva)' }}>
            Criar Nova Atividade
          </h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Coluna da Esquerda */}
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Atividade
                </label>
                <input
                  type="text"
                  id="title"
                  className={`${inputStyle} focus:ring-verde-vibrante`}
                  placeholder="Ex: Travessia da Serra Fina"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  id="description"
                  rows={5}
                  className={`${inputStyle} focus:ring-verde-vibrante`}
                  placeholder="Conte sobre o roteiro, o que está incluso, etc."
                ></textarea>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localização (Cidade/Estado)
                </label>
                <input
                  type="text"
                  id="location"
                  className={`${inputStyle} focus:ring-verde-vibrante`}
                  placeholder="Ex: Passa Quatro, MG"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Dificuldade
                </label>
                <select id="difficulty" className={`${inputStyle} focus:ring-verde-vibrante`}>
                  <option>Fácil</option>
                  <option>Moderado</option>
                  <option>Difícil</option>
                  <option>Muito Difícil</option>
                </select>
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora
                </label>
                <input type="datetime-local" id="date" className={`${inputStyle} focus:ring-verde-vibrante`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (horas)
                  </label>
                  <input type="number" id="duration" className={`${inputStyle} focus:ring-verde-vibrante`} placeholder="Ex: 8" />
                </div>
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                    Vagas
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    className={`${inputStyle} focus:ring-verde-vibrante`}
                    placeholder="Ex: 10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço por Pessoa (R$)
                </label>
                <input type="number" id="price" className={`${inputStyle} focus:ring-verde-vibrante`} placeholder="Ex: 250.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagens da Atividade</label>
                <div className="mt-1 flex justify-center items-center flex-col px-6 py-10 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <ImageUp size={48} className="text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">
                    Arraste e solte ou <span className="font-semibold" style={{color: 'var(--verde-oliva)'}}>clique para enviar</span>
                  </p>
                  <input type="file" id="images" multiple className="sr-only" />
                </div>
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: 'var(--verde-vibrante)' }}
              >
                Publicar Atividade
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}