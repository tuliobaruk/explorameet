import { Chrome } from "lucide-react";

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
		</div>
	);
}
