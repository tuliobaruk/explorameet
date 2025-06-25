import { Chrome, Facebook, Apple } from "lucide-react";

interface AuthSocialButtonsProps {
	onGoogleClick?: () => void;
	actionText: "Continuar com" | "Cadastrar com";
}

export default function AuthSocialButtons({ actionText, onGoogleClick }: AuthSocialButtonsProps) {
	return (
		<div className="auth-social-buttons-container">
			<button type="button" className="auth-button-social" onClick={onGoogleClick}>
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
