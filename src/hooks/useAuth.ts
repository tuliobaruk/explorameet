import { useCallback, useContext, useState } from "react";
import AuthContext, { AuthContextType } from "../contexts/AuthContext";
import { ApiError, AuthService, AuthUser } from "../services/authService";

export function useAuthContext(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
	}

	return context;
}

interface UseAuthLocalReturn {
	user: AuthUser | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
	clearError: () => void;
}

export function useUser() {
	const { user, isLoading, isAuthenticated } = useAuthContext();

	const hasRole = useCallback((role: string) => user?.role === role, [user]);
	const isClient = useCallback(() => user?.role === "CLIENTE", [user]);
	const isGuide = useCallback(() => user?.role === "GUIA", [user]);
	const isAdmin = useCallback(() => user?.role === "ADMIN", [user]);
  
	return {
		user,
		isLoading,
		isAuthenticated,
		profile: user?.perfil,
		name: user?.perfil?.nome,
		avatarUrl: user?.perfil?.foto,
		role: user?.role,
		hasRole,
		isClient,
		isGuide,
		isAdmin,

		clienteInfo: user?.perfil?.cliente,
		guiaInfo: user?.perfil?.guia,
	};
}

export function useAuthLocal(): UseAuthLocalReturn {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const login = useCallback(async (email: string, password: string): Promise<boolean> => {
		setLoading(true);
		setError(null);

		try {
			await AuthService.login({ email, password });

			const userStatus = await AuthService.getMe();
			setUser(userStatus);

			return true;
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("Erro inesperado durante o login");
			}
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			await AuthService.logout();
			setUser(null);
		} catch (err) {
			console.error("Erro durante logout:", err);
			setError("Erro ao fazer logout. Tente novamente.");
		} finally {
			setLoading(false);
		}
	}, []);

	const checkAuthStatus = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const userStatus = await AuthService.getMe();
			setUser(userStatus);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		user,
		loading,
		error,
		login,
		logout,
		checkAuthStatus,
		clearError,
	};
}
