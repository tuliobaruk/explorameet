import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SubscriptionSuccessPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/perfil", { replace: true });
		}, 3000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div
			className="flex flex-col min-h-screen"
			style={{ backgroundColor: "var(--background-claro)" }}
		>
			<Header />
			<main className="flex-1 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
					<div className="flex justify-center mb-6">
						<CheckCircle className="w-16 h-16 text-green-500" />
					</div>
					<h1 className="text-2xl font-bold text-verde-oliva mb-4">Assinatura Confirmada!</h1>
					<p className="text-gray-600 mb-6">
						Seu plano foi ativado com sucesso. Você será redirecionado em breve.
					</p>
					<div className="flex justify-center">
						<div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin"></div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
