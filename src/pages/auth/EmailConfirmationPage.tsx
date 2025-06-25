import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthContext } from "@/hooks/useAuth";
import { ConfirmationFormData, confirmationSchema } from "@/schemas/authSchemas";
import { ApiError, AuthService } from "@/services/authService";

import "@/pages/AuthPage.css";

export default function EmailConfirmationPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { checkAuthStatus } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [resendLoading, setResendLoading] = useState(false);
	const [resendMessage, setResendMessage] = useState<string | null>(null);

	const emailFromState = location.state?.email || "";

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ConfirmationFormData>({
		resolver: zodResolver(confirmationSchema),
		defaultValues: {
			email: emailFromState,
			code: "",
		},
	});

	const email = watch("email");

	const handleConfirmation = async (data: ConfirmationFormData) => {
		setLoading(true);
		setError(null);

		try {
			const response = await AuthService.confirmEmail({
				email: data.email,
				code: data.code,
			});

			await checkAuthStatus();

			console.log("Email confirmado:", response.message);
			navigate("/explorar");
		} catch (err: unknown) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Erro ao confirmar email");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		if (!email) {
			setError("Por favor, insira seu email primeiro");
			return;
		}

		setResendLoading(true);
		setError(null);
		setResendMessage(null);

		try {
			await AuthService.resendConfirmation(email);
			setResendMessage("Código reenviado com sucesso!");
		} catch (err: unknown) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Erro ao reenviar código");
			}
		} finally {
			setResendLoading(false);
		}
	};

	return (
		<AuthLayout
			headerText="Já confirmou seu email?"
			headerLinkTo="/login"
			headerButtonText="Fazer Login"
		>
			<AuthCardHeader
				icon={CheckCircle}
				title="Confirme seu Email"
				subtitle="Enviamos um código de confirmação para seu email."
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleConfirmation)}>
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
						{error}
					</div>
				)}

				{resendMessage && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
						{resendMessage}
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
					label="Código de Confirmação"
					id="code"
					type="text"
					required
					icon={CheckCircle}
					placeholder="123456"
					maxLength={6}
					{...register("code")}
					error={errors.code?.message}
				/>

				<div className="space-y-3">
					<button type="submit" className="auth-button-primary" disabled={loading}>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Confirmando...
							</div>
						) : (
							"Confirmar Email"
						)}
					</button>

					<button
						type="button"
						onClick={handleResendCode}
						disabled={resendLoading || !email}
						className="w-full py-2 px-4 border border-verde-oliva text-verde-oliva rounded-md hover:bg-verde-oliva hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{resendLoading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
								Reenviando...
							</div>
						) : (
							"Reenviar Código"
						)}
					</button>
				</div>
			</form>

			<p className="auth-switch-link-text">
				Lembrou que já confirmou?{" "}
				<Link to="/login" className="auth-link">
					Fazer Login
				</Link>
			</p>
		</AuthLayout>
	);
}
