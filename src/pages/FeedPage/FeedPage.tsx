import React, { useState } from "react";
import { Link } from "react-router-dom"; // Se houver links de navegação
import {
	Menu,
	X,
	Search,
	Home,
	Compass,
	Users,
	Settings,
	LogOut,
	ThumbsUp,
	MessageSquare,
	Share2,
	UserCircle,
} from "lucide-react";
import "./FeedPage.css";

const loggedInUser = {
	name: "Ana Exploradora",
	avatarUrl: "https://placehold.co/100x100/82b55b/FFFFFF?text=AE&font=roboto", // Usando placeholder com cor --verde-vibrante
};

// Mock de posts do feed
const mockFeedPosts = [
	{
		id: 1,
		author: "Pedro Pascoa",
		authorAvatar: "https://placehold.co/80x80/898f29/FFFFFF?text=PP&font=roboto",
		title: "Trilha dos Altos",
		images: [
			"https://placehold.co/600x400/cccccc/333333?text=Paisagem+Ampla+1",
			"https://placehold.co/300x200/cccccc/333333?text=Detalhe+Trilha+1",
			"https://placehold.co/300x200/cccccc/333333?text=Cachoeira+Escondida+1",
		],
		imageLayout: "grid", // 'grid' ou 'single'
		caption:
			"Uma aventura incrível pela Trilha dos Altos, com vistas de tirar o fôlego e contato direto com a natureza exuberante da região. Recomendo a todos os amantes de ecoturismo!",
		likes: 123,
		comments: 15,
	},
	{
		id: 2,
		author: "Ian Lucas",
		authorAvatar: "https://placehold.co/80x80/8c742d/FFFFFF?text=IL&font=roboto",
		title: "Ciclo Parques Urbanos",
		images: ["https://placehold.co/800x500/cccccc/333333?text=Ciclovia+Parque+2"],
		imageLayout: "single",
		caption:
			"Explorando os parques urbanos de bicicleta. Uma ótima forma de relaxar e se exercitar ao mesmo tempo. #ciclismo #parques #vidasaudavel",
		likes: 88,
		comments: 7,
	},
	{
		id: 3,
		author: "Juliana Silva",
		authorAvatar: "https://placehold.co/80x80/82b55b/FFFFFF?text=JS&font=roboto",
		title: "Amanhecer na Montanha Encantada",
		images: [
			"https://placehold.co/600x400/cccccc/333333?text=Amanhecer+1",
			"https://placehold.co/300x200/cccccc/333333?text=Neblina+Vale+1",
			"https://placehold.co/300x200/cccccc/333333?text=Primeiros+Raios+1",
		],
		imageLayout: "grid",
		caption:
			"Nada se compara a ver o sol nascer do topo da Montanha Encantada. A energia deste lugar é surreal!",
		likes: 210,
		comments: 25,
	},
];

interface NavItemProps {
	to: string;
	icon: React.ElementType;
	label: string;
	isActive?: boolean;
	onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive, onClick }) => (
	<li>
		<Link to={to} className={isActive ? "active" : ""} onClick={onClick}>
			<Icon size={20} className="nav-icon" />
			{label}
		</Link>
	</li>
);

export default function FeedPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [activePage, setActivePage] = useState("explorar");

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleNavClick = (pageName: string) => {
		setActivePage(pageName);
		if (window.innerWidth < 768) {
			setIsSidebarOpen(false);
		}
	};

	const LogoEM = () => (
		<div
			style={{
				width: "32px",
				height: "32px",
				backgroundColor: "#FFF",
				display: "flex",
				alignItems: "center",
				fontWeight: "bold",
				borderRadius: "4px",
				marginRight: "0.5rem",
			}}
		>
			<img src="/EM_logo.svg" alt="ExploraMeet Logo" />
		</div>
	);

	return (
		<div className="feed-page-layout">
			{/* --- Header --- */}
			<header className="feed-header">
				<button
					className={`sidebar-toggle-button ${isSidebarOpen ? "sidebar-open" : ""}`}
					onClick={toggleSidebar}
					aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
					aria-expanded={isSidebarOpen ? true : false}
				>
					{isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
				<div className="feed-header-logo">
					<LogoEM />
					<span className="logo-text-explorameet">ExploraMeet</span>
				</div>
				<div className="feed-search-container">
					<div className="feed-search-bar">
						<Search size={18} className="search-icon" />
						<input type="text" placeholder="Buscar trilhas, guias, exploradores..." />
					</div>
				</div>
				<div className="feed-user-profile">
					<img
						src={loggedInUser.avatarUrl}
						alt={loggedInUser.name}
						onError={(e) =>
							(e.currentTarget.src = "https://placehold.co/32x32/cccccc/333333?text=User")
						}
					/>
					<span className="user-name">{loggedInUser.name}</span>
					{/* Adicionar um dropdown aqui seria interessante */}
				</div>
			</header>

			{/* --- Main Wrapper (Sidebar + Content) --- */}
			<div className="feed-main-wrapper">
				{/* --- Sidebar --- */}
				<aside className={`feed-sidebar ${isSidebarOpen ? "open" : ""}`}>
					<nav>
						<ul>
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
							<NavItem
								to="/perfil"
								icon={UserCircle}
								label="Meu Perfil"
								isActive={activePage === "perfil"}
								onClick={() => handleNavClick("perfil")}
							/>
							<hr className="my-4 border-t border-[var(--verde-oliva)] opacity-20" />
							<NavItem
								to="/configuracoes"
								icon={Settings}
								label="Configurações"
								isActive={activePage === "configuracoes"}
								onClick={() => handleNavClick("configuracoes")}
							/>
							<NavItem
								to="/logout"
								icon={LogOut}
								label="Sair"
								onClick={() => alert("Funcionalidade de Logout")}
							/>
						</ul>
					</nav>
				</aside>

				{/* --- Área de Conteúdo do Feed --- */}
				<main className={`feed-content-area ${isSidebarOpen ? "sidebar-open" : ""}`}>
					{mockFeedPosts.map((post) => (
						<article key={post.id} className="feed-post-card">
							<div className="post-header">
								<img
									src={post.authorAvatar}
									alt={post.author}
									className="post-author-img"
									onError={(e) =>
										(e.currentTarget.src = "https://placehold.co/40x40/cccccc/333333?text=P")
									}
								/>
								<div>
									<h2 className="post-title">{post.title}</h2>
									<p className="post-author-name">Por: {post.author}</p>
								</div>
							</div>

							{post.imageLayout === "grid" && post.images.length >= 3 ? (
								<div className="post-image-grid">
									<img
										src={post.images[0]}
										alt={`${post.title} - Imagem Principal`}
										className="img-large"
										onError={(e) =>
											(e.currentTarget.src = "https://placehold.co/600x400?text=Erro")
										}
									/>
									<img
										src={post.images[1]}
										alt={`${post.title} - Imagem Secundária 1`}
										className="img-small-1"
										onError={(e) =>
											(e.currentTarget.src = "https://placehold.co/300x200?text=Erro")
										}
									/>
									<img
										src={post.images[2]}
										alt={`${post.title} - Imagem Secundária 2`}
										className="img-small-2"
										onError={(e) =>
											(e.currentTarget.src = "https://placehold.co/300x200?text=Erro")
										}
									/>
								</div>
							) : (
								post.images.length > 0 && (
									<div className="post-single-image">
										<img
											src={post.images[0]}
											alt={post.title}
											onError={(e) =>
												(e.currentTarget.src = "https://placehold.co/800x500?text=Erro")
											}
										/>
									</div>
								)
							)}

							{post.caption && (
								<div className="post-content-text">
									<p>{post.caption}</p>
								</div>
							)}

							<div className="post-actions">
								<button>
									<ThumbsUp size={18} /> {post.likes > 0 && <span>{post.likes}</span>}{" "}
									<span className="sr-only">Curtir</span>
								</button>
								<button>
									<MessageSquare size={18} /> {post.comments > 0 && <span>{post.comments}</span>}{" "}
									<span className="sr-only">Comentar</span>
								</button>
								<button>
									<Share2 size={18} /> <span className="sr-only">Compartilhar</span>
								</button>
							</div>
						</article>
					))}
				</main>
			</div>
		</div>
	);
}
