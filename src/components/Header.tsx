import { useAuthContext, useUser } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Bell,
  Check,
  Compass,
  Crown,
  LogOut,
  Map,
  MapPinCheckIcon,
  Plus,
  RefreshCw,
  Settings,
  UserCircle,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
			className="text-2xl font-bold whitespace-nowrap hidden min-[440px]:inline"
			style={{ color: "var(--verde-oliva)", lineHeight: 1 }}
		>
			ExploraMeet
		</span>
	</div>
);

export function Header({ variant = "default" }: HeaderProps) {
	const { user, isLoading, isAuthenticated, name, avatarUrl } = useUser();
	const { logout } = useAuthContext();
	const {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		refreshNotifications,
		loading,
	} = useNotifications();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const notificationDropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const canCreatePasseio = Boolean(user && (user.role === "GUIA" || user.role === "ADMIN"));

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
			if (
				notificationDropdownRef.current &&
				!notificationDropdownRef.current.contains(event.target as Node)
			) {
				setNotificationDropdownOpen(false);
			}
		}
		if (dropdownOpen || notificationDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [dropdownOpen, notificationDropdownOpen]);

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
					<Link to={"/explorar"} className="flex items-center">
						<div className="header-logo text-3xl font-bold flex items-center gap-2">
							<LogoEM />
						</div>
					</Link>
					<nav className="hidden min-[928px]:flex gap-2 ml-6">
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
						<div className="flex items-center gap-3">
							<div className="relative" ref={notificationDropdownRef}>
								<Bell
									size={20}
									className="text-verde-oliva hover:text-verde-oliva/80 cursor-pointer transition-colors"
									onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
								/>
								{unreadCount > 0 && (
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
										<span className="text-xs text-white font-bold">
											{unreadCount > 9 ? "9+" : unreadCount}
										</span>
									</div>
								)}

								{notificationDropdownOpen && (
									<div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg w-80 z-50 max-h-96 overflow-y-auto">
										<div className="p-3 border-b border-gray-200 flex justify-between items-center">
											<h3 className="font-semibold text-gray-800">Notificações</h3>
											<div className="flex gap-2">
												<button
													onClick={() => refreshNotifications()}
													disabled={loading}
													className="text-sm text-verde-oliva hover:text-verde-oliva/80 flex items-center gap-1 disabled:opacity-50"
													title="Atualizar notificações"
												>
													<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
												</button>
												{unreadCount > 0 && (
													<button
														onClick={() => markAllAsRead()}
														className="text-sm text-verde-oliva hover:text-verde-oliva/80 flex items-center gap-1"
													>
														<Check size={14} />
														Marcar todas como lidas
													</button>
												)}
											</div>
										</div>

										{notifications.length === 0 ? (
											<div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
										) : (
											<div className="max-h-64 overflow-y-auto">
												{notifications.slice(0, 10).map((notification) => (
													<div
														key={notification.id}
														className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
															!notification.lida ? "bg-blue-50" : ""
														}`}
													>
														<div className="flex justify-between items-start gap-2">
															<div className="flex-1">
																<h4 className="font-medium text-sm text-gray-800">
																	{notification.titulo}
																</h4>
																<p className="text-xs text-gray-600 mt-1">
																	{notification.mensagem}
																</p>
																<span className="text-xs text-gray-400 mt-1 block">
																	{new Date(notification.createdAt).toLocaleDateString("pt-BR", {
																		day: "2-digit",
																		month: "2-digit",
																		year: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</span>
															</div>
															<div className="flex gap-1">
																{!notification.lida && (
																	<button
																		onClick={() => markAsRead(notification.id)}
																		className="text-verde-oliva hover:text-verde-oliva/80 p-1"
																		title="Marcar como lida"
																	>
																		<Check size={14} />
																	</button>
																)}
																<button
																	onClick={() => deleteNotification(notification.id)}
																	className="text-red-500 hover:text-red-700 p-1"
																	title="Remover notificação"
																>
																	<X size={14} />
																</button>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
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
									className="text-sm font-medium hidden min-[440px]:inline"
									style={{
										color: "var(--verde-oliva)",
										maxWidth: 100,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										display: "inline-block",
									}}
								>
									{name && name.length > 15 ? name.slice(0, 15) + "..." : name}
								</span>
								{/* Dropdown */}
								{dropdownOpen && (
									<div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-50 py-2">
										<div className="block min-[928px]:hidden border-b border-gray-200 pb-2 mb-2">
											<Link
												to="/explorar"
												className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
												onClick={() => setDropdownOpen(false)}
											>
												<Compass size={16} /> Explorar
											</Link>
											{isAuthenticated && canCreatePasseio && (
												<>
													<Link
														to="/meus-passeios"
														className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
														onClick={() => setDropdownOpen(false)}
													>
														<MapPinCheckIcon size={16} /> Meus Passeios
													</Link>
													<Link
														to="/criar-passeio"
														className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
														onClick={() => setDropdownOpen(false)}
													>
														<Plus size={16} /> Criar Passeio
													</Link>
												</>
											)}
										</div>
										<Link
											to="/perfil"
											className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
											onClick={() => setDropdownOpen(false)}
										>
											<UserCircle size={16} /> Meu Perfil
										</Link>
										<Link
											to="/assinatura"
											className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
											onClick={() => setDropdownOpen(false)}
										>
											<Crown size={16} /> Assinatura
										</Link>
										<Link
											to="/guia/inscricoes"
											className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-verde-oliva"
										>
											<Map size={16} /> Inscrições
										</Link>
										<Link
											to="/configuracoes"
											className="flex items-center gap-2 px-4 py-2 hov   er:bg-gray-50 text-verde-oliva"
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
