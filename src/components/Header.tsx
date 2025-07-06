import { useUser } from "@/hooks/useAuth";
import { Menu, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}
export const LogoEM = () => (
	<div
		style={{
			width: "48px",
			height: "48px",
			display: "flex",
			alignItems: "center",
			fontWeight: "bold",
			borderRadius: "4px",
			marginRight: "0.5rem",
		}}
	>
		<img src="/EM_logo.svg" alt="ExploraMeet Logo" />
		<span className="text-3xl header-logo-link">ExploraMeet</span>
	</div>
);

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
	const { name, avatarUrl, isLoading, isAuthenticated } = useUser();

	if (isLoading) {
		return (
			<header className="auth-header">
				{/* Adicionar depóis um Skeleton loader*/}
			</header>
		);
	}

	return (
		<header className="auth-header">
			<div className="flex items-center gap-2">
				<button
					className={`sidebar-toggle-button ${isSidebarOpen ? "sidebar-open" : ""}`}
					onClick={toggleSidebar}
					aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
					aria-expanded={isSidebarOpen}
				>
					{isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
				<div className="feed-header-logo">
					<LogoEM />
				</div>
			</div>

			<div className="flex items-center">
				{isAuthenticated ? (
					<div className="feed-user-profile">
						{avatarUrl ? (
							<img
								src={avatarUrl}
								alt={name || "Usuário"}
								className="user-avatar"
								onError={(e) =>
									(e.currentTarget.src = "https://placehold.co/32x32/cccccc/333333?text=U")
								}
							/>
						) : (
							<div className="user-avatar-placeholder">
								<UserRound size={22} className="text-gray-600" />
							</div>
						)}
						<span className="user-name">{name}</span>
					</div>
				) : (
					<Link to="/login">
						<button className="nav-button-acessar text-white font-bold px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
							Acessar
						</button>
					</Link>
				)}
			</div>
		</header>
	);
}
