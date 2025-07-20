import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import AuthService, { ApiError, AuthUser, LoginData } from "../services/authService";
import PerfilService from "../services/perfilService";
import { Cliente, Guia } from "../types/Usuario";
import { toast } from "react-toastify";

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

export interface AuthenticatedUser {
	id: string;
	email: string;
	role: string;
	perfil?: {
		nome: string;
		foto?: string;
		cliente?: Cliente;
		guia?: Guia;
	};
}

interface ConfirmModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title: string;
	message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onConfirm,
	onCancel,
	title,
	message,
}) => {
	if (!isOpen) return null;

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}
		>
			<div
				style={{
					backgroundColor: "white",
					padding: "24px",
					borderRadius: "8px",
					maxWidth: "400px",
					width: "90%",
					boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
				}}
			>
				<h3 style={{ margin: "0 0 16px 0", color: "#333" }}>{title}</h3>
				<p style={{ margin: "0 0 24px 0", color: "#666" }}>{message}</p>
				<div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
					<button
						onClick={onCancel}
						style={{
							padding: "8px 16px",
							border: "1px solid #ddd",
							borderRadius: "4px",
							backgroundColor: "white",
							cursor: "pointer",
						}}
					>
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						style={{
							padding: "8px 16px",
							border: "none",
							borderRadius: "4px",
							backgroundColor: "#d32f2f",
							color: "white",
							cursor: "pointer",
						}}
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const isAuthenticated = !!user;

	const checkAuthStatus = useCallback(async () => {
		setIsLoading(true);
		try {
			const authStatus = await AuthService.getMe();
			if (authStatus) {
				const perfilData = await PerfilService.getMeuPerfil();
				const fullUser = {
					...authStatus,
					perfil: perfilData,
				};
				setUser(fullUser);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Falha ao verificar status de autenticação (usuário não logado):", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const login = async (credentials: LoginData) => {
		setIsLoading(true);
		try {
			await AuthService.login(credentials);
			await checkAuthStatus();
		} catch (error) {
			setUser(null);
			if (error instanceof ApiError) {
				throw new Error(error.message);
			}
			throw new Error("Ocorreu um erro inesperado durante o login.");
		}
	};

	const logout = async () => {
		setShowLogoutModal(true);
	};

	const confirmLogout = async () => {
		setIsLoading(true);
		setShowLogoutModal(false);

		try {
			await AuthService.logout();
			setUser(null);
			toast.success("Logout realizado com sucesso!");
		} catch (error) {
			console.error("Erro durante o processo de logout:", error);
			toast.error("Erro ao fazer logout. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		logout,
		checkAuthStatus,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
			<ConfirmModal
				isOpen={showLogoutModal}
				onConfirm={confirmLogout}
				onCancel={cancelLogout}
				title="Confirmar Logout"
				message="Tem certeza que deseja sair da sua conta?"
			/>
		</AuthContext.Provider>
	);
}

export default AuthContext;
