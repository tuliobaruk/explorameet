import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, Shield } from "lucide-react";

export default function TermsAndPrivacyPage() {
  const location = useLocation();

  useEffect(() => {
    // Rola para a seção correta com base na URL
    const elementId = location.pathname === "/privacidade" ? "privacidade" : "termos";
    const element = document.getElementById(elementId);
    if (element) {
      // Usamos um timeout para garantir que a rolagem aconteça após a renderização completa
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Usamos a classe 'prose' do Tailwind para um estilo de texto agradável e legível */}
        <article className="prose lg:prose-xl max-w-none prose-h1:text-4xl prose-h2:text-2xl prose-h1:text-[var(--verde-oliva)] prose-h2:text-[var(--verde-oliva)] prose-a:text-[var(--marrom-dourado)]">
          <section id="termos" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-10 h-10" style={{ color: 'var(--verde-oliva)' }} />
              <h1>Termos de Uso</h1>
            </div>
            <p className="text-sm text-gray-500">Última atualização: 20 de julho de 2025</p>

            <h2>1. Bem-vindo ao ExploraMeet!</h2>
            <p>
              Estes Termos de Uso regem seu acesso e uso da plataforma ExploraMeet. Ao se cadastrar ou utilizar nossos serviços, você concorda com estes termos na íntegra.
            </p>

            <h2>2. Objeto do Serviço</h2>
            <p>
              O ExploraMeet é uma plataforma que conecta Turistas interessados em experiências de ecoturismo e aventura com Guias de turismo qualificados que oferecem tais atividades ("Passeios"). Atuamos como intermediários para facilitar essa conexão.
            </p>

            <h2>3. Responsabilidades dos Usuários</h2>
            <p>
              <strong>Turistas:</strong> São responsáveis por ler atentamente a descrição dos passeios, incluindo nível de dificuldade, restrições e itens necessários. Devem seguir as orientações de segurança do Guia durante a atividade.
            </p>
            <p>
              <strong>Guias:</strong> São responsáveis por fornecer informações precisas e completas sobre os passeios, possuir as qualificações e licenças necessárias para a condução das atividades e zelar pela segurança dos participantes.
            </p>

            <h2>4. Pagamentos e Cancelamentos</h2>
            <p>
              As transações financeiras são processadas através de um parceiro de pagamentos seguro. As políticas de cancelamento e reembolso são definidas por cada Guia e devem estar claramente descritas na página do passeio. O ExploraMeet não se responsabiliza por disputas de reembolso, mas pode mediar conflitos quando necessário.
            </p>

            <h2>5. Limitação de Responsabilidade</h2>
            <p>
              O ExploraMeet é uma plataforma de conexão e não executa os passeios. Não nos responsabilizamos por acidentes, lesões, perdas ou danos de qualquer natureza que possam ocorrer durante as atividades. A responsabilidade pela segurança e execução do passeio é integralmente do Guia contratado.
            </p>

            <hr className="my-12" />
          </section>

          <section id="privacidade" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-10 h-10" style={{ color: 'var(--verde-oliva)' }} />
              <h1>Política de Privacidade</h1>
            </div>
            <p className="text-sm text-gray-500">Última atualização: 20 de julho de 2025</p>
            
            <h2>1. Nosso Compromisso</h2>
            <p>
              Sua privacidade é nossa prioridade. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>

            <h2>2. Dados Coletados</h2>
            <p>
              Coletamos os seguintes tipos de dados:
              <ul>
                <li><strong>Dados de Cadastro:</strong> Nome, e-mail, CPF/CNPJ, telefone.</li>
                <li><strong>Dados de Perfil:</strong> Foto, biografia, localização (cidade/estado).</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, cookies, tipo de dispositivo e navegador.</li>
                <li><strong>Dados de Passeio:</strong> Avaliações, comentários e passeios contratados ou criados.</li>
              </ul>
            </p>

            <h2>3. Uso dos Dados</h2>
            <p>
              Utilizamos seus dados para:
              <ul>
                <li>Viabilizar a conexão entre Turistas e Guias.</li>
                <li>Processar pagamentos de forma segura.</li>
                <li>Personalizar sua experiência na plataforma.</li>
                <li>Garantir a segurança e prevenir fraudes.</li>
                <li>Enviar comunicações sobre seus passeios e novidades da plataforma (com seu consentimento).</li>
              </ul>
            </p>
            
            <h2>4. Seus Direitos como Titular (LGPD)</h2>
            <p>
              Você tem o direito de:
              <ul>
                <li>Confirmar a existência de tratamento dos seus dados.</li>
                <li>Acessar seus dados.</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                <li>Solicitar a eliminação dos seus dados, quando aplicável.</li>
                <li>Revogar o consentimento a qualquer momento.</li>
              </ul>
              Para exercer seus direitos, entre em contato conosco através do e-mail: <strong>privacidade@explorameet.social</strong>.
            </p>
             <h2>5. Contato</h2>
            <p>Em caso de dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail mencionado acima.</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}