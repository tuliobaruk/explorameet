import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Mail, KeyRound, UserCircle } from "lucide-react";
import { useState } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import AuthInput from "@/components/auth/AuthInput";
import { AuthService } from "@/services/authService";

import "@/pages/AuthPage.css";
import { registerStep1Schema, RegisterStep1Data } from "@/schemas/authSchemas";

export default function RegisterPage() {
	const navigate = useNavigate();
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);
	const [emailError, setEmailError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setError,
	} = useForm<RegisterStep1Data>({
		resolver: zodResolver(registerStep1Schema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
			userType: "CLIENTE",
		},
	});

	const userType = watch("userType");

	const checkEmailExists = async (email: string) => {
		if (!email || !email.includes("@")) return;

		setIsCheckingEmail(true);
		setEmailError(null);

		try {
			const emailExists = await AuthService.checkEmailExists(email);
			
			if (emailExists) {
				setError("email", {
					type: "manual",
					message: "Este email já está cadastrado. Tente fazer login ou use outro email.",
				});
				setEmailError("Este email já está cadastrado. Tente fazer login ou use outro email.");
			} else {
				// Limpar o erro se o email estiver disponível
				setError("email", { type: "manual", message: undefined });
				setEmailError(null);
			}
		} catch (error) {
			console.error("Erro ao verificar email:", error);
			setEmailError("Erro ao verificar email. Tente novamente.");
		} finally {
			setIsCheckingEmail(false);
		}
	};

	const handleNextStep = async (data: RegisterStep1Data) => {
		console.log("Dados validados da Etapa 1:", data);
		
		setIsCheckingEmail(true);
		setEmailError(null);

		try {
			const emailExists = await AuthService.checkEmailExists(data.email);
			
			if (emailExists) {
				setError("email", {
					type: "manual",
					message: "Este email já está cadastrado. Tente fazer login ou use outro email.",
				});
				setEmailError("Este email já está cadastrado. Tente fazer login ou use outro email.");
				return;
			}

			// Se chegou até aqui, o email não existe, prosseguir para próxima etapa
			navigate("/cadastro/detalhes", {
				state: data,
			});
		} catch (error) {
			console.error("Erro ao verificar email:", error);
			setEmailError("Erro ao verificar email. Tente novamente.");
		} finally {
			setIsCheckingEmail(false);
		}
	};

	return (
		<AuthLayout headerText="Já tem uma conta?" headerLinkTo="/login" headerButtonText="Acessar">
			<AuthCardHeader
				icon={UserPlus}
				title="Crie sua Conta"
				subtitle="Junte-se à comunidade ExploraMeet!"
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleNextStep)}>
				{emailError && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
						{emailError}
					</div>
				)}

				<AuthInput
					label="Nome Completo"
					id="fullName"
					type="text"
					autoComplete="name"
					required
					icon={UserCircle}
					placeholder="Seu nome completo"
					{...register("fullName")}
					error={errors.fullName?.message}
				/>

				<AuthInput
					label="Email"
					id="email"
					type="email"
					autoComplete="email"
					required
					icon={Mail}
					placeholder="seuemail@exemplo.com"
					{...register("email")}
					onBlur={(e) => checkEmailExists(e.target.value)}
					error={errors.email?.message}
				/>

				<AuthInput
					label="Senha"
					id="password"
					type="password"
					autoComplete="new-password"
					required
					icon={KeyRound}
					placeholder="Crie uma senha forte"
					{...register("password")}
					error={errors.password?.message}
				/>

				<AuthInput
					label="Confirmar Senha"
					id="confirmPassword"
					type="password"
					autoComplete="new-password"
					required
					icon={KeyRound}
					placeholder="Confirme sua senha"
					{...register("confirmPassword")}
					error={errors.confirmPassword?.message}
				/>

				<div>
					<label className="block font-medium text-verde-oliva text-sm mb-2">Tipo de Usuário</label>
					<div className="flex gap-4">
						<div className="flex items-center">
							<input
								type="radio"
								id="userTypeNormal"
								value="CLIENTE"
								checked={userType === "CLIENTE"}
								className="auth-terms-checkbox"
								{...register("userType")}
							/>
							<label htmlFor="userTypeNormal" className="auth-terms-label !ml-2 cursor-pointer">
								Explorador
							</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="userTypeGuia"
								value="GUIA"
								checked={userType === "GUIA"}
								className="auth-terms-checkbox"
								{...register("userType")}
							/>
							<label htmlFor="userTypeGuia" className="auth-terms-label !ml-2 cursor-pointer">
								Guia
							</label>
						</div>
					</div>
					{errors.userType && <p className="error-message">{errors.userType.message}</p>}
				</div>

				<div className="pt-1">
					<button type="submit" className="auth-button-primary" disabled={isCheckingEmail}>
						{isCheckingEmail ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Verificando email...
							</div>
						) : (
							"Próxima Etapa"
						)}
					</button>
				</div>
			</form>

			<AuthSwitchLink mainText="Já possui uma conta?" linkText="Faça login" linkTo="/login" />
		</AuthLayout>
	);
}
