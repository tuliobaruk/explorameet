import { Link } from "react-router-dom";
import { LogIn, Mail, KeyRound } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout.tsx";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthSocialButtons from "@/components/auth/AuthSocialButtons";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";

import "../AuthPage.css";

export default function LoginPage() {
	return (
		<AuthLayout
			headerText="Não tem uma conta?"
			headerLinkTo="/cadastro"
			headerButtonText="Cadastre-se"
		>
			<AuthCardHeader
				icon={LogIn}
				title="Acessar sua Conta"
				subtitle="Bem-vindo de volta! Insira seus dados."
			/>

			<form className="auth-form">
				<AuthInput
					label="Email"
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					icon={Mail}
					placeholder="seuemail@exemplo.com"
				/>

				<div>
					<div className="flex items-center justify-between mb-1">
						<label htmlFor="password">Senha</label>
						<Link to="/esqueci-senha" className="auth-link">
							Esqueceu a senha?
						</Link>
					</div>
					<AuthInput
						label=""
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						icon={KeyRound}
						placeholder="Sua senha"
					/>
				</div>

				<div>
					<button type="submit" className="auth-button-primary">
						Entrar
					</button>
				</div>
			</form>

			<AuthDivider text="Ou entre com" />

			<AuthSocialButtons actionText="Continuar com" />

			<AuthSwitchLink
				mainText="Ainda não tem uma conta?"
				linkText="Crie uma agora!"
				linkTo="/cadastro"
			/>
		</AuthLayout>
	);
}
