import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, IdCard, Phone, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthCardHeader from "@/components/auth/AuthCardHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSelect from "@/components/auth/AuthSelect";
import AuthService, { ApiError } from "@/services/authService";
import { Genero } from "@/types/Usuario";
import { maskCadastur, maskCPF, maskCpfCnpj, maskPhone } from "@/utils/masks";

import "@/pages/AuthPage.css";
import {
  CompleteGoogleRegistrationData,
  completeGoogleRegistrationSchema,
} from "@/schemas/authSchemas";

export default function CompleteGoogleRegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = searchParams.get("email");
  const googleId = searchParams.get("googleId");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const picture = searchParams.get("picture");
  const needsRegistration = searchParams.get("needsRegistration");

  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompleteGoogleRegistrationData>({
    resolver: zodResolver(completeGoogleRegistrationSchema),
    defaultValues: {
      userType: "CLIENTE",
      celular: "",
      genero: "",
      idade: undefined,
      cpf: "",
      cpfCnpj: "",
      numCadastro: "",
      termsAccepted: false,
    },
  });

  const userType = watch("userType");
  const celularValue = watch("celular");
  const cpfValue = watch("cpf");
  const cpfCnpjValue = watch("cpfCnpj");
  const numCadastroValue = watch("numCadastro");

  useEffect(() => {
    if (!email || !googleId || !needsRegistration) {
      alert(
        "Dados de registro do Google não encontrados. Redirecionando para login."
      );
      navigate("/login");
    }
  }, [email, googleId, needsRegistration, navigate]);

  const handleCompleteRegistration = async (
    data: CompleteGoogleRegistrationData
  ) => {
    if (!email || !googleId || !firstName || !lastName) {
      setError("Dados do Google não encontrados. Tente fazer login novamente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseProfile = {
        nome: fullName,
        celular: data.celular,
        genero: data.genero,
        idade: data.idade,
        ...(picture && picture.trim() !== "" && { foto: picture }),
      };

      const baseUser = {
        email: email,
        termsAccepted: data.termsAccepted,
      };

      if (data.userType === "CLIENTE") {
        const payload = {
          cpf: data.cpf,
          googleId: googleId,
          perfil: baseProfile,
          usuario: baseUser,
        };

        await AuthService.registerClienteWithGoogle(payload);
      } else {
        const payload = {
          cpf_cnpj: data.cpfCnpj,
          num_cadastro: data.numCadastro,
          googleId: googleId,
          perfil: baseProfile,
          usuario: baseUser,
        };
        await AuthService.registerGuiaWithGoogle(payload);
      }

      navigate("/login-success")
    } catch (err) {
      console.error("Ocorreu um erro ao processar o registro:", err);
      if (err instanceof ApiError) {
        setError(err.message || "Ocorreu um erro desconhecido vindo da API.");
      } else {
        setError(
          "Erro de conexão ou de cliente. Verifique o console para mais detalhes."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email || !googleId) {
    return (
      <AuthLayout
        headerText="Problemas?"
        headerLinkTo="/login"
        headerButtonText="Voltar ao Login"
      >
        <div className="auth-card">
          <p className="auth-subtitle text-center">
            Carregando dados do Google ou informações não encontradas.
            Redirecionando...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      headerText="Já tem uma conta?"
      headerLinkTo="/login"
      headerButtonText="Fazer Login"
    >
      <AuthCardHeader
        icon={UserPlus}
        title="Complete seu Registro"
        subtitle={`Olá, ${firstName}! Complete seu cadastro para continuar.`}
      />

      {picture && (
        <div className="flex justify-center mb-4">
          <img
            src={picture}
            alt="Foto do perfil"
            className="w-16 h-16 rounded-full border-2 border-verde-oliva/20"
          />
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit(handleCompleteRegistration, (formErrors) => {
          console.error("Erros de validação do formulário:", formErrors);
        })}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* O restante do formulário JSX permanece o mesmo */}
        <div className="mb-4">
          <label className="block font-medium text-verde-oliva text-sm mb-2">
            Tipo de Usuário
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="userTypeCliente"
                value="CLIENTE"
                className="auth-terms-checkbox"
                {...register("userType")}
              />
              <label
                htmlFor="userTypeCliente"
                className="auth-terms-label !ml-2 cursor-pointer"
              >
                Explorador
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="userTypeGuia"
                value="GUIA"
                className="auth-terms-checkbox"
                {...register("userType")}
              />
              <label
                htmlFor="userTypeGuia"
                className="auth-terms-label !ml-2 cursor-pointer"
              >
                Guia
              </label>
            </div>
          </div>
          {errors.userType && (
            <p className="error-message">{errors.userType.message}</p>
          )}
        </div>

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
          <option value={Genero.PrefiroNaoDizer}>
            {Genero.PrefiroNaoDizer}
          </option>
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

        {userType === "CLIENTE" && (
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

        {userType === "GUIA" && (
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
              required
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
        {errors.termsAccepted && (
          <p className="error-message">{errors.termsAccepted.message}</p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            className="auth-button-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finalizando...
              </div>
            ) : (
              "Finalizar Registro"
            )}
          </button>
        </div>
      </form>

      <p className="auth-switch-link-text">
        Problemas com o registro?{" "}
        <Link to="/login" className="auth-link">
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}
