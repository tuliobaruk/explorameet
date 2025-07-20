import { Compass, Home, LogOut, Plus, Settings, UserCircle, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface NavItemProps {
	to: string;
	icon: React.ElementType;
	label: string;
	isActive?: boolean;
	onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive, onClick }) => (
	<li>
		<Link
			to={to}
			className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-200 font-medium ${
				isActive ? "text-white" : "hover:bg-green-50"
			}`}
			style={
				isActive ? { backgroundColor: "var(--verde-vibrante)" } : { color: "var(--verde-oliva)" }
			}
			onClick={onClick}
		>
			<Icon size={20} className="mr-3" />
			{label}
		</Link>
	</li>
);

interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (open: boolean) => void;
	activePage: string;
	setActivePage: (page: string) => void;
	isAuthenticated: boolean;
	canCreatePasseio: boolean;
	logout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
	isSidebarOpen,
	setIsSidebarOpen,
	activePage,
	setActivePage,
	isAuthenticated,
	canCreatePasseio,
	logout,
}) => {
	const handleNavClick = (pageName: string) => {
		setActivePage(pageName);
		if (window.innerWidth < 1024) {
			setIsSidebarOpen(false);
		}
	};

	return (
		<>
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
					style={{ top: "64px" }}
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<aside
				className={`
		  fixed top-20 left-0 w-64 h-[calc(100vh-64px)] bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out
		  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
		  overflow-y-auto
		  ${isSidebarOpen ? "lg:block" : "lg:hidden"}
		`}
				style={{
					borderRight: "1px solid rgba(137, 143, 41, 0.2)",
				}}
			>
				<div className="px-4">
					<nav>
						<ul className="space-y-1">
							<NavItem
								to="/"
								icon={Home}
								label="Início"
								isActive={activePage === "inicio"}
								onClick={() => handleNavClick("inicio")}
							/>
							<NavItem
								to="/explorar"
								icon={Compass}
								label="Explorar"
								isActive={activePage === "explorar"}
								onClick={() => handleNavClick("explorar")}
							/>
							<NavItem
								to="/comunidade"
								icon={Users}
								label="Comunidade"
								isActive={activePage === "comunidade"}
								onClick={() => handleNavClick("comunidade")}
							/>
							{isAuthenticated && (
								<>
									<NavItem
										to="/perfil"
										icon={UserCircle}
										label="Meu Perfil"
										isActive={activePage === "perfil"}
										onClick={() => handleNavClick("perfil")}
									/>
									{canCreatePasseio && (
										<NavItem
											to="/criar-passeio"
											icon={Plus}
											label="Criar Passeio"
											isActive={activePage === "criar-passeio"}
											onClick={() => handleNavClick("criar-passeio")}
										/>
									)}
									<hr
										className="my-4 border-t"
										style={{ borderColor: "rgba(137, 143, 41, 0.2)" }}
									/>
									<NavItem
										to="/configuracoes"
										icon={Settings}
										label="Configurações"
										isActive={activePage === "configuracoes"}
										onClick={() => handleNavClick("configuracoes")}
									/>
									<NavItem to="" icon={LogOut} label="Sair" onClick={logout} />
								</>
							)}
						</ul>
					</nav>
				</div>
			</aside>
		</>
	);
};
