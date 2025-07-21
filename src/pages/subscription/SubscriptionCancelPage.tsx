import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SubscriptionCancelPage() {
	return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--background-claro)" }}>
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-verde-oliva mb-4">Pagamento Cancelado</h1>
                    <p className="text-gray-600 mb-6">Sua assinatura não foi concluída. Você pode tentar novamente a qualquer momento na página de planos.</p>
                    <Link to="/assinatura">
                        <button className="w-full bg-verde-oliva text-white py-3 px-4 rounded-lg font-medium hover:bg-verde-escuro transition-colors">
                            Ver Planos
                        </button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
	);
}
