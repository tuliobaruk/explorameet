import {
	ApiError,
	AuthService,
	RegisterClienteData,
	RegisterGuiaData,
} from "@/services/authService";
import { useCallback, useState } from "react";

interface UseRegisterReturn {
	loading: boolean;
	error: string | null;
	success: boolean;
	registerCliente: (data: RegisterClienteData) => Promise<boolean>;
	registerGuia: (data: RegisterGuiaData) => Promise<boolean>;
	clearError: () => void;
	clearSuccess: () => void;
}

export function useRegister(): UseRegisterReturn {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const clearSuccess = useCallback(() => {
		setSuccess(false);
	}, []);

	const registerCliente = useCallback(async (data: RegisterClienteData): Promise<boolean> => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await AuthService.registerCliente(data);

			if (response.message) {
				setSuccess(true);
				return true;
			}

			setError("Erro inesperado durante o cadastro");
			return false;
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message || "Erro durante o cadastro");
			} else {
				setError("Erro de conexão. Tente novamente.");
			}
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	const registerGuia = useCallback(async (data: RegisterGuiaData): Promise<boolean> => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await AuthService.registerGuia(data);

			if (response.message) {
				setSuccess(true);
				return true;
			}

			setError("Erro inesperado durante o cadastro");
			return false;
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message || "Erro durante o cadastro");
			} else {
				setError("Erro de conexão. Tente novamente.");
			}
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		loading,
		error,
		success,
		registerCliente,
		registerGuia,
		clearError,
		clearSuccess,
	};
}
