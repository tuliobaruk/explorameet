import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSocialButtons from "@/components/auth/AuthSocialButtons";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import { useAuthContext, useAuthLocal } from "@/hooks/useAuth";
import { AuthService } from "@/services/authService";

import { LoginFormData, loginSchema } from "../../schemas/authSchemas";
import "../AuthPage.css";

export default function LoginPage() {
	const navigate = useNavigate();

	const { loading, error, login: loginLocal, clearError } = useAuthLocal();

	const { user, isLoading, checkAuthStatus } = useAuthContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (!isLoading && user && user.id) {
			console.log(user);
			navigate("/explorar");
		}
	}, [user, isLoading, navigate]);

	useEffect(() => {
		clearError();
	}, [clearError]);

	const handleLogin = async (data: LoginFormData) => {
		try {
			const loginSuccessfully = await loginLocal(data.email, data.password);

			if (loginSuccessfully) {
				await checkAuthStatus();

				navigate("/login-success");
			}
		} catch (err) {
			console.error("Erro durante login:", err);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = AuthService.getGoogleLoginUrl();
	};

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

			<form className="auth-form" onSubmit={handleSubmit(handleLogin)}>
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
						{error}
					</div>
				)}

				<AuthInput
					label="Email"
					id="email"
					type="email"
					autoComplete="email"
					required
					icon={Mail}
					placeholder="seuemail@exemplo.com"
					{...register("email")}
					error={errors.email?.message}
				/>

				<div>
					<div className="flex items-center justify-between mb-1">
						<label htmlFor="password" className="block font-medium text-verde-oliva text-sm">
							Senha
						</label>
						<Link to="/esqueci-senha" className="auth-link">
							Esqueceu a senha?
						</Link>
					</div>
					<AuthInput
						label=""
						id="password"
						type="password"
						autoComplete="current-password"
						required
						icon={KeyRound}
						placeholder="Sua senha"
						{...register("password")}
						error={errors.password?.message}
					/>
				</div>

				<div>
					<button type="submit" className="auth-button-primary" disabled={loading}>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Entrando...
							</div>
						) : (
							"Entrar"
						)}
					</button>
				</div>
			</form>

			<AuthDivider text="Ou entre com" />

			<AuthSocialButtons actionText="Continuar com" onGoogleClick={handleGoogleLogin} />

			<AuthSwitchLink
				mainText="Ainda não tem uma conta?"
				linkText="Crie uma agora!"
				linkTo="/cadastro"
			/>
		</AuthLayout>
	);
}
