// src/hooks/useAuth.ts
import { useContext, useState, useCallback } from "react";
import AuthContext from "../contexts/AuthContext";
import { AuthService, AuthUser, ApiError } from "../services/authService";

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: any) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

export function useAuthContext(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
	}

	return context;
}

export function useAuth() {
	const { user, isLoading, isAuthenticated } = useAuthContext();

	return {
		user,
		isLoading,
		isAuthenticated,
		hasRole: (role: string) => user?.role === role,
		isClient: () => user?.role === "CLIENTE",
		isGuide: () => user?.role === "GUIA",
		isAdmin: () => user?.role === "ADMIN",
	};
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
			setUser(userStatus.user);

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
		} catch (err) {
			console.error("Erro durante logout:", err);
		} finally {
			setUser(null);
			setLoading(false);
		}
	}, []);

	const checkAuthStatus = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const userStatus = await AuthService.getMe();
			setUser(userStatus.user);
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
