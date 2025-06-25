import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import { AuthService } from "@/services/authService";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/authSchemas";

import "@/pages/AuthPage.css";

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const email = watch("email");

	const handleForgotPassword = async (data: ForgotPasswordFormData) => {
		setLoading(true);
		setError(null);

		try {
			await AuthService.forgotPassword(data.email);
			setSuccess(true);
		} catch (err: unknown) {
			setError((err as { message?: string }).message || "Erro ao enviar código de redefinição");
		} finally {
			setLoading(false);
		}
	};

	const handleGoToReset = () => {
		navigate("/redefinir-senha", { state: { email } });
	};

	if (success) {
		return (
			<AuthLayout
				headerText="Lembrou da senha?"
				headerLinkTo="/login"
				headerButtonText="Fazer Login"
			>
				<AuthCardHeader
					icon={Mail}
					title="Email Enviado!"
					subtitle="Se o email existir em nosso sistema, você receberá um código para redefinir sua senha."
				/>

				<div className="space-y-4">
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
						Verifique sua caixa de entrada e spam.
					</div>

					<button onClick={handleGoToReset} className="auth-button-primary">
						Já tenho o código
					</button>

					<p className="auth-switch-link-text">
						Não recebeu o email?{" "}
						<button
							onClick={() => setSuccess(false)}
							className="auth-link bg-transparent border-none p-0 cursor-pointer"
						>
							Tentar novamente
						</button>
					</p>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout headerText="Lembrou da senha?" headerLinkTo="/login" headerButtonText="Fazer Login">
			<AuthCardHeader
				icon={KeyRound}
				title="Esqueceu a Senha?"
				subtitle="Digite seu email para receber um código de redefinição."
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleForgotPassword)}>
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

				<div className="pt-1">
					<button type="submit" className="auth-button-primary" disabled={loading}>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Enviando...
							</div>
						) : (
							"Enviar Código"
						)}
					</button>
				</div>
			</form>

			<p className="auth-switch-link-text">
				Lembrou da senha?{" "}
				<Link to="/login" className="auth-link">
					Fazer Login
				</Link>
			</p>
		</AuthLayout>
	);
}
