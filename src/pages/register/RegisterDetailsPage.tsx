import { Calendar, IdCard, Phone, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSelect from "@/components/auth/AuthSelect";
import { useRegister } from "@/hooks/useRegister";
import { RegisterStep1Data } from "@/schemas/authSchemas";
import { Genero } from "@/types/Usuario";
import { maskCadastur, maskCPF, maskCpfCnpj, maskPhone } from "@/utils/masks";

import "@/pages/AuthPage.css";

export default function RegisterDetailsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const registerState = location.state as RegisterStep1Data;
	const { loading, error, success, registerCliente, registerGuia, clearError, clearSuccess } =
		useRegister();

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

	const { register, handleSubmit, setValue, formState: { errors } } = useForm();

	const getErrorMessage = (error: unknown): string | undefined => {
		if (error && typeof error === 'object' && 'message' in error) {
			return error.message as string;
		}
		return undefined;
	};

	const handleSubmitFinal = async (data: Record<string, unknown>) => {
		if (!registerState) {
			alert("Erro: Dados da etapa anterior não encontrados. Redirecionando.");
			navigate("/cadastro");
			return;
		}

		console.log("termsAccepted no formulário:", data.termsAccepted);

		const baseProfile = {
			nome: registerState.fullName,
			celular: data.celular as string,
			genero: data.genero as string,
			idade: Number(data.idade),
			foto: (data.foto as string) || "",
		};

		const baseUser = {
			email: registerState.email,
			password: registerState.password,
			termsAccepted: Boolean(data.termsAccepted),
		};

		try {
			if (registerState.userType === "CLIENTE") {
				const payload = {
					cpf: (data.cpf as string) || "",
					perfil: baseProfile,
					usuario: baseUser,
				};

				console.log("Payload Cliente:", payload);
				await registerCliente(payload);
			} else {
				const payload = {
					cpf_cnpj: (data.cpfCnpj as string) || "",
					num_cadastro:
						data.numCadastro && typeof data.numCadastro === 'string' && data.numCadastro.trim() !== "" ? data.numCadastro as string : undefined,
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
					maxLength={15}
					{...register("celular")}
					maskFunction={maskPhone}
					onChange={(e) => setValue("celular", e.target.value)}
					error={getErrorMessage(errors.celular)}
				/>

				<AuthSelect
					icon={UserPlus}
					label="Gênero"
					id="genero"
					{...register("genero")}
					error={getErrorMessage(errors.genero)}
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
					type="text"
					required
					icon={Calendar}
					min={16}
					max={120}
					maxLength={3}
					placeholder="Ex: 30"
					{...register("idade", { valueAsNumber: true })}
					error={getErrorMessage(errors.idade)}
				/>

				{registerState.userType === "CLIENTE" && (
					<AuthInput
						label="CPF"
						id="cpf"
						type="text"
						required
						icon={IdCard}
						placeholder="XXX.XXX.XXX-XX"
						maxLength={14}
						{...register("cpf")}
						maskFunction={maskCPF}
						onChange={(e) => setValue("cpf", e.target.value)}
						error={getErrorMessage(errors.cpf)}
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
							maxLength={18}
							{...register("cpfCnpj")}
							maskFunction={maskCpfCnpj}
							onChange={(e) => setValue("cpfCnpj", e.target.value)}
							error={getErrorMessage(errors.cpfCnpj)}
						/>

						<AuthInput
							label="Número de Cadastro Cadastur"
							id="numCadastro"
							type="text"
							icon={IdCard}
							placeholder="XX.XXXXXX.XX-X"
							maxLength={11}
							{...register("numCadastro")}
							maskFunction={maskCadastur}
							onChange={(e) => setValue("numCadastro", e.target.value)}
							error={getErrorMessage(errors.numCadastro)}
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
				{errors.termsAccepted && <p className="error-message">{getErrorMessage(errors.termsAccepted)}</p>}

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
