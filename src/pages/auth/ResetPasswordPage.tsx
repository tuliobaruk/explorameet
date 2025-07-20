import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound, CheckCircle } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import { AuthService } from "@/services/authService";
import { resetPasswordSchema, ResetPasswordFormData } from "@/schemas/authSchemas";

import "@/pages/AuthPage.css";

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const emailFromState = location.state?.email || "";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: emailFromState,
			code: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const handleResetPassword = async (data: ResetPasswordFormData) => {
		setLoading(true);
		setError(null);

		try {
			await AuthService.resetPassword({
				email: data.email,
				code: data.code,
				newPassword: data.newPassword,
			});

			alert("Senha redefinida com sucesso! Você já pode fazer login com a nova senha.");
			navigate("/login");
		} catch (err: unknown) {
			setError((err as { message?: string }).message || "Erro ao redefinir senha");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout headerText="Lembrou da senha?" headerLinkTo="/login" headerButtonText="Fazer Login">
			<AuthCardHeader
				icon={CheckCircle}
				title="Redefinir Senha"
				subtitle="Digite o código recebido por email e sua nova senha."
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleResetPassword)}>
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
						{error}
					</div>
				)}

				<AuthInput
					disabled
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

				<AuthInput
					label="Código de Verificação"
					id="code"
					type="text"
					required
					icon={CheckCircle}
					placeholder="123456"
					maxLength={6}
					{...register("code")}
					error={errors.code?.message}
				/>

				<AuthInput
					label="Nova Senha"
					id="newPassword"
					type="password"
					autoComplete="new-password"
					required
					icon={KeyRound}
					placeholder="Digite sua nova senha"
					{...register("newPassword")}
					error={errors.newPassword?.message}
				/>

				<AuthInput
					label="Confirmar Nova Senha"
					id="confirmPassword"
					type="password"
					autoComplete="new-password"
					required
					icon={KeyRound}
					placeholder="Confirme sua nova senha"
					{...register("confirmPassword")}
					error={errors.confirmPassword?.message}
				/>

				<div className="pt-1">
					<button type="submit" className="auth-button-primary" disabled={loading}>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Redefinindo...
							</div>
						) : (
							"Redefinir Senha"
						)}
					</button>
				</div>
			</form>

			<p className="auth-switch-link-text">
				Não recebeu o código?{" "}
				<Link to="/esqueci-senha" className="auth-link">
					Solicitar novamente
				</Link>
			</p>
		</AuthLayout>
	);
}
