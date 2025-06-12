import { LucideIcon } from "lucide-react";

interface AuthCardHeaderProps {
	icon: LucideIcon;
	title: string;
	subtitle: string;
}

export default function AuthCardHeader({ icon: Icon, title, subtitle }: AuthCardHeaderProps) {
	return (
		<div className="auth-card-header">
			<Icon size={48} className="auth-icon" />
			<h1 className="auth-title">{title}</h1>
			<p className="auth-subtitle mt-1">{subtitle}</p>
		</div>
	);
}
