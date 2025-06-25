import { createContext, useState, useEffect, ReactNode } from "react";
import AuthService, { AuthUser, LoginData, ApiError } from "../services/authService";

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginData) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const checkAuthStatus = async () => {
		try {
			setIsLoading(true);
			const response = await AuthService.getMe();

			if (response.user) {
				setUser(response.user);
				setIsAuthenticated(true);
			} else {
				setUser(null);
				setIsAuthenticated(false);
			}
		} catch (error) {
			console.error("Usuário não autenticado: ", error);
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (credentials: LoginData) => {
		try {
			setIsLoading(true);
			const response = await AuthService.login(credentials);

			await checkAuthStatus();

			console.log("Login realizado com sucesso:", response.message);
		} catch (error) {
			setUser(null);
			setIsAuthenticated(false);

			if (error instanceof ApiError) {
				throw new Error(error.message);
			}
			throw new Error("Erro durante o login");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setIsLoading(true);
			await AuthService.logout();
		} catch (error) {
			console.error("Erro durante logout:", error);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	useEffect(() => {
		const handleFocus = () => {
			if (isAuthenticated) {
				checkAuthStatus();
			}
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, [isAuthenticated]);

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		logout,
		checkAuthStatus,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
