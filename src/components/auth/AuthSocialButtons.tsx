import { Chrome, Facebook, Apple } from "lucide-react";

interface AuthSocialButtonsProps {
	actionText: "Continuar com" | "Cadastrar com";
}

export default function AuthSocialButtons({ actionText }: AuthSocialButtonsProps) {
	return (
		<div className="auth-social-buttons-container">
			<button type="button" className="auth-button-social">
				<Chrome size={20} className="social-icon" />
				{actionText} Google
			</button>
			<button type="button" className="auth-button-social">
				<Facebook size={20} className="social-icon" />
				{actionText} Facebook
			</button>
			<button type="button" className="auth-button-social">
				<Apple size={20} className="social-icon" />
				{actionText} Apple
			</button>
		</div>
	);
}
