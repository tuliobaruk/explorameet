import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, IdCard, Phone, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { maskCPF, maskCpfCnpj, maskPhone } from "@/utils/masks";

import "@/pages/AuthPage.css";
import { RegisterStep1Data, RegisterStep2Data, registerStep2Schema } from "@/schemas/authSchemas";
import { z } from "zod";
import AuthSelect from "../../components/auth/AuthSelect";
import { Genero } from "@/types/Usuario";

export default function RegisterDetailsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const registerState = location.state as RegisterStep1Data;

	const [celular, setCelular] = useState("");
	const [cpf, setCpf] = useState("");
	const [cpfCnpj, setCpfCnpj] = useState("");

	useEffect(() => {
		if (!registerState || !registerState.fullName || !registerState.userType) {
			alert("Por favor, preencha a primeira etapa do cadastro.");
			navigate("/cadastro");
		}
	}, [registerState, navigate]);

	const conditionalRegisterStep2Schema = registerStep2Schema.superRefine((data, ctx) => {
		if (registerState?.userType === "CLIENTE") {
			if (!data.cpf || data.cpf.length === 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "CPF é obrigatório para usuários normais.",
					path: ["cpf"],
				});
			}
		} else if (registerState?.userType === "GUIA") {
			if (!data.cpfCnpj || data.cpfCnpj.length === 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "CPF/CNPJ é obrigatório para guias.",
					path: ["cpfCnpj"],
				});
			}
		}
	});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<RegisterStep2Data>({
		resolver: zodResolver(conditionalRegisterStep2Schema),
		defaultValues: {
			celular: "",
			genero: "",
			idade: undefined,
			foto: "",
			cpf: "",
			cpfCnpj: "",
			numCadastro: "",
			termsAccepted: false,
		},
	});

	const handleSubmitFinal = async (data: RegisterStep2Data) => {
		if (!registerState) {
			alert("Erro: Dados da etapa anterior não encontrados. Redirecionando.");
      console.log("Dados da etapa anterior não encontrados:", data, registerState);
			navigate("/cadastro");
			return;
		}

		let payload;
		const baseProfile = {
			nome: registerState.fullName,
			celular: data.celular,
			genero: data.genero,
			idade: data.idade,
			foto: data.foto,
		};
		const baseUser = {
			email: registerState.email,
			password: registerState.password,
		};

		if (registerState.userType === "CLIENTE") {
			payload = {
				cpf: data.cpf,
				perfil: baseProfile,
				usuario: baseUser,
			};
		} else {
			payload = {
				cpf_cnpj: data.cpfCnpj,
				num_cadastro:
					data.numCadastro && data.numCadastro.trim() !== "" ? data.numCadastro : "null",
				verificado: false,
				perfil: baseProfile,
				usuario: baseUser,
			};
		}

		try {
			const apiEndpoint =
				registerState.userType === "CLIENTE" ? "/auth/register/cliente" : "/auth/register/guia";
			const response = await fetch(apiEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				alert("Cadastro realizado com sucesso!");
				navigate("/login");
			} else {
				const errorData = await response.json();
				alert(`Erro no cadastro: ${errorData.message || response.statusText}`);
			}
		} catch (error) {
			console.error("Erro ao enviar dados de cadastro:", error);
			alert("Ocorreu um erro ao tentar cadastrar. Tente novamente.");
		}
	};

	if (!registerState || !registerState.fullName) {
		return (
			<AuthLayout headerText="Já tem uma conta?" headerLinkTo="/login" headerButtonText="Acessar">
				<div className="auth-card">
					<p className="auth-subtitle text-center">
						Carregando detalhes do cadastro ou dados não encontrados. Redirecionando...
					</p>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout headerText="Já tem uma conta?" headerLinkTo="/login" headerButtonText="Acessar">
			<AuthCardHeader
				icon={UserPlus}
				title={
					registerState.userType === "CLIENTE"
						? "Complete seu Cadastro (Usuário)"
						: "Complete seu Cadastro (Guia)"
				}
				subtitle="Quase lá! Agora precisamos de alguns detalhes."
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleSubmitFinal)}>
				<AuthInput
					label="Celular"
					id="celular"
					type="tel"
					autoComplete="tel"
					required
					icon={Phone}
					placeholder="(XX) XXXXX-XXXX"
					value={celular}
					onChange={(e) => {
						const masked = maskPhone(e.target.value);
						setCelular(masked);
						setValue("celular", masked);
					}}
					error={errors.celular?.message}
				/>
        
        <AuthSelect
          icon={UserPlus}
          label="Gênero"
          id="genero"
          {...register("genero")}
          error={errors.genero?.message}
          required
        >
          <option value="" disabled>Selecione o gênero</option>
          <option value={Genero.Masculino}>{Genero.Masculino}</option>
          <option value={Genero.Feminino}>{Genero.Feminino}</option>
          <option value={Genero.Outro}>{Genero.Outro}</option>
          <option value={Genero.PrefiroNaoDizer}>{Genero.PrefiroNaoDizer}</option>
        </AuthSelect>

				<AuthInput
					label="Idade"
					id="idade"
					type="text"
					required
					icon={Calendar}
          maxLength={3}
					placeholder="Ex: 30"
					{...register("idade")}
					error={errors.idade?.message}
				/>

				{registerState.userType === "CLIENTE" && (
					<AuthInput
						label="CPF"
						id="cpf"
						type="text"
						required
						icon={IdCard}
						placeholder="XXX.XXX.XXX-XX"
						value={cpf}
						onChange={(e) => {
							const masked = maskCPF(e.target.value);
							setCpf(masked);
							setValue("cpf", masked);
						}}
						error={errors.cpf?.message}
					/>
				)}

				{registerState.userType === "GUIA" && (
					<>
						<AuthInput
							label="CPF ou CNPJ"
							id="cpfCnpj"
							type="text"
							required
							icon={IdCard}
							placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/XXXX-XX"
							value={cpfCnpj}
							onChange={(e) => {
								const masked = maskCpfCnpj(e.target.value);
								setCpfCnpj(masked);
								setValue("cpfCnpj", masked);
							}}
							error={errors.cpfCnpj?.message}
						/>

						<AuthInput
							label="Número de Cadastro Cadastur (Opcional)"
							id="numCadastro"
							type="text"
							icon={IdCard}
							placeholder="Ex: G12345"
							{...register("numCadastro")}
							error={errors.numCadastro?.message}
						/>
					</>
				)}

				<div className="auth-terms-container">
					<input
						id="terms"
						type="checkbox"
						required
						className="auth-terms-checkbox"
						{...register("termsAccepted")}
					/>
					<label htmlFor="terms" className="auth-terms-label">
						Eu concordo com os{" "}
						<Link to="/termos" className="auth-link">
							Termos de Serviço
						</Link>
					</label>
				</div>
				{errors.termsAccepted && <p className="error-message">{errors.termsAccepted.message}</p>}

				<div className="pt-1">
					<button type="submit" className="auth-button-primary">
						Finalizar Cadastro
					</button>
				</div>
			</form>

			<p className="auth-switch-link-text">
				Voltar para a etapa anterior?{" "}
				<Link to="/cadastro" className="auth-link">
					Clique aqui
				</Link>
			</p>
		</AuthLayout>
	);
}
