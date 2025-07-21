import { Link } from "react-router-dom";
import { LogoEM } from "./Header"; // Reutilizando o componente LogoEM do seu Header

export function Footer() {
	return (
		<footer className="w-full bg-white" style={{ borderTop: "1px solid rgba(137, 143, 41, 0.2)" }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="text-center md:text-left">
						<Link to="/">
							<LogoEM />
						</Link>
						<p className="text-sm text-gray-500 mt-2">Conectando você à natureza brasileira.</p>
					</div>
					<nav
						className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium"
						style={{ color: "var(--verde-oliva)" }}
					>
						<Link to="/sobre" className="hover:underline">
							Sobre
						</Link>
						<Link to="/explorar" className="hover:underline">
							Explorar
						</Link>
						<Link to="/termos" className="hover:underline">
							Termos de Uso
						</Link>
						<Link to="/privacidade" className="hover:underline">
							Privacidade
						</Link>
					</nav>
				</div>
				<div
					className="text-center text-xs text-gray-400 mt-8 pt-6"
					style={{ borderTop: "1px solid rgba(137, 143, 41, 0.1)" }}
				>
					© {new Date().getFullYear()} ExploraMeet. Todos os direitos reservados. Jaboatão dos
					Guararapes, PE - Brasil.
				</div>
			</div>
		</footer>
	);
}
