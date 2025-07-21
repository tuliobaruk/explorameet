import { useUser, useAuthContext } from "@/hooks/useAuth";
import {
	UserRound,
	Compass,
	UserCircle,
	Plus,
	Settings,
	LogOut,
	MapPinCheckIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
	variant?: "default" | "homepage";
}

export const LogoEM = () => (
	<div className="flex items-center gap-2 mr-4 select-none" style={{ minWidth: 0 }}>
		<img
			src="/EM_logo.svg"
			alt="ExploraMeet Logo"
			className="w-10 h-10 object-contain"
			style={{ display: "block" }}
		/>
		<span
			className="text-2xl font-bold whitespace-nowrap"
			style={{ color: "var(--verde-oliva)", lineHeight: 1 }}
		>
			ExploraMeet
		</span>
	</div>
);

export function Header({ variant = "default" }: HeaderProps) {
	const { user, isLoading, isAuthenticated, name, avatarUrl } = useUser();
	const { logout } = useAuthContext();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const canCreatePasseio = Boolean(user && (user.role === "GUIA" || user.role === "ADMIN"));

	// Fecha o dropdown ao clicar fora
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		}
		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [dropdownOpen]);

	if (isLoading && variant === "default") {
		return (
			<header
				className="bg-white shadow-sm relative z-50 h-16"
				style={{ borderBottom: "1px solid rgba(137, 143, 41, 0.2)" }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-32 h-6 bg-gray-200 rounded ml-2 animate-pulse hidden sm:block"></div>
					</div>
					<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
				</div>
			</header>
		);
	}

	if (variant === "homepage") {
		return (
			<header className="auth-header w-full h-20 fixed top-0 left-0 right-0 z-50 flex justify-between items-center mx-auto py-4 px-4 md:px-10 shadow-sm">
				<a href="#">
					<div className="header-logo text-3xl font-bold flex items-center gap-2">
						<LogoEM />
					</div>
				</a>

				<nav className="hidden md:flex justify-around gap-3 text-lg items-center ">
					<a
						href="#"
						className="nav-link text-gray-700 px-2 py-2 rounded-md transition duration-300"
					>
						Início
					</a>
					<a
						href="#para-turistas"
						className="nav-link text-gray-700 px-2 py-2 rounded-md transition duration-300"
					>
						Para Turistas
					</a>
					<a
						href="#para-guias"
						className="nav-link text-gray-700 px-2 py-2 rounded-md transition duration-300"
					>
						Para Guias
					</a>
					<Link to="/login">
						<button
							className="text-white font-bold px-6 py-1 m-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
							style={{ backgroundColor: "var(--marrom-dourado)" }}
						>
							Acessar
						</button>
					</Link>
				</nav>

				<div className="md:hidden">
					<Link to="/login">
						<button
							className="text-white font-bold px-4 py-2 m-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
							style={{ backgroundColor: "var(--marrom-dourado)" }}
						>
							Acessar
						</button>
					</Link>
				</div>
			</header>
		);
	}

	return (
		<header
			className="z-50 fixed top-0 left-0 w-full h-20 flex items-center bg-white shadow-sm"
			style={{
				borderBottom: "1px solid #e5e7eb",
			}}
		>
			<div className="max-w-7xl mx-auto w-full h-full px-4 sm:px-8 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Link to={"/"} className="flex items-center">
						<div className="header-logo text-3xl font-bold flex items-center gap-2">
							<LogoEM />
						</div>
					</Link>
					<nav className="hidden md:flex gap-2 ml-6">
						<Link
							to="/explorar"
							className="flex items-center gap-1 px-3 py-2 rounded-md font-medium text-verde-oliva hover:bg-green-50 transition-all"
						>
							<Compass size={18} className="mr-1" /> Explorar
						</Link>
						{isAuthenticated && (
							<>
								{canCreatePasseio && (
									<>
										<Link
											to="/meus-passeios"
											className="flex items-center gap-1 px-3 py-2 rounded-md font-medium text-verde-oliva hover:bg-green-50 transition-all"
										>
											<MapPinCheckIcon size={18} className="mr-1" /> Meus Passeios
										</Link>
										<Link
											to="/criar-passeio"
											className="flex items-center gap-1 px-3 py-2 rounded-md font-medium text-verde-oliva hover:bg-green-50 transition-all"
										>
											<Plus size={18} className="mr-1" /> Criar Passeio
										</Link>
									</>
								)}
							</>
						)}
					</nav>
				</div>
				<div className="flex items-center relative">
					{isAuthenticated ? (
						<div
							className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
							onClick={() => setDropdownOpen((v) => !v)}
							ref={dropdownRef}
						>
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={name || "Usuário"}
									className="w-8 h-8 rounded-full object-cover border border-gray-300"
									onError={(e) =>
										(e.currentTarget.src = "https://placehold.co/32x32/cccccc/333333?text=U")
									}
								/>
							) : (
								<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
									<UserRound size={18} className="text-gray-600" />
								</div>
							)}
							<span
								className="text-sm font-medium"
								style={{
									color: "var(--verde-oliva)",
									maxWidth: 100,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									display: "inline-block",
								}}
							>
								{name && name.length > 10 ? name.slice(0, 10) + "..." : name}
							</span>
							{/* Dropdown */}
							{dropdownOpen && (
								<div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 py-2">
									<Link
										to="/perfil"
										className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
										onClick={() => setDropdownOpen(false)}
									>
										<UserCircle size={16} /> Meu Perfil
									</Link>
									<Link
										to="/configuracoes"
										className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
										onClick={() => setDropdownOpen(false)}
									>
										<Settings size={16} /> Configurações
									</Link>
									<hr className="my-1 border-t border-gray-200" />
									<button
										className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-50 text-red-600"
										onClick={() => {
											setDropdownOpen(false);
											logout();
											navigate("/login");
										}}
									>
										<LogOut size={16} /> Sair
									</button>
								</div>
							)}
						</div>
					) : (
						<Link to="/login">
							<button
								className="text-white font-bold px-6 py-1 m-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
								style={{ backgroundColor: "var(--marrom-dourado)" }}
							>
								Acessar
							</button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
