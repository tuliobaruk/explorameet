import { Link } from "react-router-dom";
import { LogoEM } from "../Header";

interface AuthLayoutProps {
	children: React.ReactNode;
	headerText: string;
	headerLinkTo: string;
	headerButtonText: string;
}

export default function AuthLayout({
	children,
	headerText,
	headerLinkTo,
	headerButtonText,
}: AuthLayoutProps) {
	return (
		<div className="auth-page-container">
			<header className="auth-header">
				<Link to="/" className="header-logo-link">
					<LogoEM />
				</Link>
				<nav className="auth-header-nav flex gap-3 sm:gap-4 items-center">
					<span>{headerText}</span>
					<Link to={headerLinkTo}>
						<button className="auth-nav-button">{headerButtonText}</button>
					</Link>
				</nav>
			</header>

			<main className="auth-main-content">
				<div className="auth-card">{children}</div>
			</main>
		</div>
	);
}
