import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, IdCard, Phone, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSelect from "@/components/auth/AuthSelect";
import { useRegister } from "@/hooks/useRegister";
import {
	RegisterStep1Data,
	RegisterStep2FormData,
	createRegisterStep2Schema,
} from "@/schemas/authSchemas";
import { Genero } from "@/types/Usuario";
import { maskCadastur, maskCPF, maskCpfCnpj, maskPhone } from "@/utils/masks";

import "@/pages/AuthPage.css";

export default function RegisterDetailsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const registerState = location.state as RegisterStep1Data;
	const { loading, error, success, registerCliente, registerGuia, clearError, clearSuccess } =
		useRegister();

	const userType = registerState?.userType || "CLIENTE";

	useEffect(() => {
		if (!registerState || !registerState.fullName || !registerState.userType) {
			alert("Por favor, preencha a primeira etapa do cadastro.");
			navigate("/cadastro");
		}
	}, [registerState, navigate]);

	useEffect(() => {
		clearError();
		clearSuccess();
	}, [clearError, clearSuccess]);

	useEffect(() => {
		if (success) {
			navigate("/confirmar-email", {
				state: {
					email: registerState?.email,
					password: registerState?.password,
					message: "Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.",
				},
			});
		}
	}, [success, navigate, registerState?.email, registerState?.password]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RegisterStep2FormData>({
		resolver: zodResolver(createRegisterStep2Schema(userType)),
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

	const celularValue = watch("celular");
	const cpfValue = watch("cpf");
	const cpfCnpjValue = watch("cpfCnpj");
	const numCadastroValue = watch("numCadastro");

	const handleSubmitFinal: SubmitHandler<RegisterStep2FormData> = async (data) => {
		if (!registerState) {
			alert("Erro: Dados da etapa anterior não encontrados. Redirecionando.");
			navigate("/cadastro");
			return;
		}

		console.log("termsAccepted no formulário:", data.termsAccepted);

		const baseProfile = {
			nome: registerState.fullName,
			celular: data.celular,
			genero: data.genero,
			idade: data.idade,
			foto: data.foto || "",
		};

		const baseUser = {
			email: registerState.email,
			password: registerState.password,
			termsAccepted: data.termsAccepted,
		};

		try {
			if (registerState.userType === "CLIENTE") {
				const payload = {
					cpf: data.cpf || "",
					perfil: baseProfile,
					usuario: baseUser,
				};

				console.log("Payload Cliente:", payload);
				await registerCliente(payload);
			} else {
				const payload = {
					cpf_cnpj: data.cpfCnpj || "",
					num_cadastro:
						data.numCadastro && data.numCadastro.trim() !== "" ? data.numCadastro : undefined,
					verificado: false,
					perfil: baseProfile,
					usuario: baseUser,
				};

				console.log("Payload Guia:", payload);
				await registerGuia(payload);
			}
		} catch (err) {
			console.error("Erro durante o cadastro:", err);
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
						? "Complete seu Cadastro (Explorador)"
						: "Complete seu Cadastro (Guia)"
				}
				subtitle="Quase lá! Agora precisamos de alguns detalhes."
			/>

			<form className="auth-form" onSubmit={handleSubmit(handleSubmitFinal)}>
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
						{error}
					</div>
				)}

				<AuthInput
					label="Celular"
					id="celular"
					type="tel"
					autoComplete="tel"
					required
					icon={Phone}
					placeholder="(XX) XXXXX-XXXX"
					{...register("celular")}
					value={celularValue || ""}
					onChange={(e) => {
						const masked = maskPhone(e.target.value);
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
					<option value="" disabled>
						Selecione o gênero
					</option>
					<option value={Genero.Masculino}>{Genero.Masculino}</option>
					<option value={Genero.Feminino}>{Genero.Feminino}</option>
					<option value={Genero.Outro}>{Genero.Outro}</option>
					<option value={Genero.PrefiroNaoDizer}>{Genero.PrefiroNaoDizer}</option>
				</AuthSelect>

				<AuthInput
					label="Idade"
					id="idade"
					type="number"
					required
					icon={Calendar}
					min={16}
					max={120}
					placeholder="Ex: 30"
					{...register("idade", { valueAsNumber: true })}
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
						{...register("cpf")}
						value={cpfValue || ""}
						onChange={(e) => {
							const masked = maskCPF(e.target.value);
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
							{...register("cpfCnpj")}
							value={cpfCnpjValue || ""}
							onChange={(e) => {
								const masked = maskCpfCnpj(e.target.value);
								setValue("cpfCnpj", masked);
							}}
							error={errors.cpfCnpj?.message}
						/>

						<AuthInput
							label="Número de Cadastro Cadastur"
							id="numCadastro"
							type="text"
							icon={IdCard}
							placeholder="XX.XXXXXX.XX-X"
							{...register("numCadastro")}
							value={numCadastroValue || ""}
							onChange={(e) => {
								const masked = maskCadastur(e.target.value);
								setValue("numCadastro", masked);
							}}
							error={errors.numCadastro?.message}
						/>
					</>
				)}

				<div className="auth-terms-container">
					<input
						id="terms"
						type="checkbox"
						className="auth-terms-checkbox"
						{...register("termsAccepted", { required: "Você deve aceitar os termos de serviço" })}
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
					<button type="submit" className="auth-button-primary" disabled={loading}>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Finalizando...
							</div>
						) : (
							"Finalizar Cadastro"
						)}
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
