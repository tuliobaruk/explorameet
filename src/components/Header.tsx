import { useUser } from "@/hooks/useAuth";
import { Menu, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
	isSidebarOpen?: boolean;
	toggleSidebar?: () => void;
	variant?: "default" | "homepage";
}

export const LogoEM = () => (
	<div className="w-12 h-12 flex items-center font-bold rounded mr-2">
		<img src="/EM_logo.svg" alt="ExploraMeet Logo" className="w-12 h-12" />
		<span className="text-2xl ml-1 hidden sm:inline" style={{ color: "var(--verde-oliva)" }}>
			ExploraMeet
		</span>
	</div>
);

export function Header({ isSidebarOpen = false, toggleSidebar, variant = "default" }: HeaderProps) {
	const { name, avatarUrl, isLoading, isAuthenticated } = useUser();

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
			className="shadow-sm z-50 fixed top-0 left-0 w-full h-20 flex items-center bg-white"
			style={{
				borderBottom: "1px solid rgba(137, 143, 41, 0.2)",
				backgroundColor: "var(--background-claro)",
			}}
		>
			<div className="max-w-8xl mx-auto w-full h-full md:px-6">
				<div className="flex items-center justify-between h-full">
					<div className="flex items-center gap-2">
						{toggleSidebar && (
							<>
								<button
									className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 lg:hidden"
									style={{ color: "var(--marrom-dourado)" }}
									onClick={toggleSidebar}
									aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
									aria-expanded={isSidebarOpen}
								>
									{isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
								</button>

								<button
									className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 hidden lg:block"
									style={{ color: "var(--marrom-dourado)" }}
									onClick={toggleSidebar}
									aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
									aria-expanded={isSidebarOpen}
								>
									{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
								</button>
							</>
						)}
						<Link to={"/"} className="flex items-center">
							<div className="header-logo text-3xl font-bold flex items-center gap-2">
								<LogoEM />
							</div>
						</Link>
					</div>

					<div className="flex items-center">
						{isAuthenticated ? (
							<div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
			</div>
		</header>
	);
}
