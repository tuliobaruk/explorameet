import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Mail, KeyRound, UserCircle } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import AuthInput from "@/components/auth/AuthInput";

import "@/pages/AuthPage.css";
import { registerStep1Schema, RegisterStep1Data } from "@/schemas/authSchemas";

export default function RegisterPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
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

	const handleNextStep = (data: RegisterStep1Data) => {
		console.log("Dados validados da Etapa 1:", data);

		navigate("/cadastro/detalhes", {
			state: data,
		});
	};

	return (
		<AuthLayout headerText="Já tem uma conta?" headerLinkTo="/login" headerButtonText="Acessar">
			<AuthCardHeader
				icon={UserPlus}
				title="Crie sua Conta"
				subtitle="Junte-se à comunidade ExploraMeet!"
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleNextStep)}>
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
					<button type="submit" className="auth-button-primary">
						Próxima Etapa
					</button>
				</div>
			</form>

			<AuthSwitchLink mainText="Já possui uma conta?" linkText="Faça login" linkTo="/login" />
		</AuthLayout>
	);
}
