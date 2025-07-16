import { useUser } from "@/hooks/useAuth";
import { Menu, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}

export const LogoEM = () => (
	<div className="w-12 h-12 flex items-center font-bold rounded mr-2">
		<img src="/EM_logo.svg" alt="ExploraMeet Logo" className="w-12 h-12" />
		<span
			className="text-2xl lg:text-3xl ml-2 hidden sm:inline"
			style={{ color: "var(--verde-oliva)" }}
		>
			ExploraMeet
		</span>
	</div>
);

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
	const { name, avatarUrl, isLoading, isAuthenticated } = useUser();

	if (isLoading) {
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

	return (
		<header
			className="shadow-sm z-50 fixed top-0 left-0 w-full h-20 flex items-center bg-white"
			style={{
				borderBottom: "1px solid rgba(137, 143, 41, 0.2)",
				backgroundColor: "var(--background-claro)",
			}}
		>
			<div className="max-w-7xl mx-auto w-full h-full">
				<div className="flex items-center justify-between h-full">
					<div className="flex items-center gap-2">
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
									className="text-white font-bold px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
									style={{ backgroundColor: "var(--verde-vibrante)" }}
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
