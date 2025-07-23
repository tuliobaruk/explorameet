import { useCallback, useEffect, useState } from "react";
import { apiClient, ApiError } from "../api/axiosConfig";
import { useUser } from "./useAuth";

export interface Notification {
	id: string;
	titulo: string;
	mensagem: string;
	tipo: "INSCRICAO_CLIENTE" | "CONFIRMACAO_GUIA" | "CANCELAMENTO" | "NOVO_GUIA_CADASTRO" | "GUIA_APROVADO" | "GUIA_REJEITADO";
	lida: boolean;
	usuarioId: string;
	passeioId?: string;
	inscricaoId?: string;
	createdAt: string;
	updatedAt: string;
}

interface UseNotificationsReturn {
	notifications: Notification[];
	unreadCount: number;
	loading: boolean;
	error: string | null;
	fetchNotifications: () => Promise<void>;
	markAsRead: (id: string) => Promise<void>;
	markAllAsRead: () => Promise<void>;
	deleteNotification: (id: string) => Promise<void>;
	refreshNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const { isAuthenticated, user } = useUser();

	const fetchNotifications = useCallback(async () => {
		if (!isAuthenticated) return;

		setLoading(true);
		setError(null);

		try {
			console.log("Buscando notificações para usuário:", user?.sub);
      console.log(user)
			const response = await apiClient.get(`/notificacoes?t=${Date.now()}`);
			console.log(
				"Notificações recebidas:",
				response.data.map((n: Notification) => ({ id: n.id, titulo: n.titulo, usuarioId: n.usuarioId })),
			);
			setNotifications(response.data);
		} catch (err) {
			const errorMessage = err instanceof ApiError ? err.message : "Erro desconhecido";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, user]);

	const fetchUnreadCount = useCallback(async () => {
		if (!isAuthenticated) return;

		try {
			console.log("Buscando contagem para usuário:", user?.sub);
			const response = await apiClient.get(`/notificacoes/unread/count?t=${Date.now()}`);
			console.log("Contagem recebida:", response.data.count);
			setUnreadCount(response.data.count);
		} catch (err) {
			console.error("Erro ao buscar contagem:", err);
		}
	}, [isAuthenticated, user]);

	const markAsRead = useCallback(async (id: string) => {
		try {
			await apiClient.patch(`/notificacoes/${id}/read`);

			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === id ? { ...notification, lida: true } : notification,
				),
			);

			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch (err) {
			const errorMessage = err instanceof ApiError ? err.message : "Erro desconhecido";
			setError(errorMessage);
		}
	}, []);

	const markAllAsRead = useCallback(async () => {
		try {
			await apiClient.patch("/notificacoes/read/all");

			setNotifications((prev) => prev.map((notification) => ({ ...notification, lida: true })));

			setUnreadCount(0);
		} catch (err) {
			const errorMessage = err instanceof ApiError ? err.message : "Erro desconhecido";
			setError(errorMessage);
		}
	}, []);

	const deleteNotification = useCallback(
		async (id: string) => {
			try {
				await apiClient.delete(`/notificacoes/${id}`);

				const wasUnread = notifications.find((n) => n.id === id)?.lida === false;

				setNotifications((prev) => prev.filter((notification) => notification.id !== id));

				if (wasUnread) {
					setUnreadCount((prev) => Math.max(0, prev - 1));
				}
			} catch (err) {
				const errorMessage = err instanceof ApiError ? err.message : "Erro desconhecido";
				setError(errorMessage);
			}
		},
		[notifications],
	);

	const refreshNotifications = useCallback(async () => {
		if (isAuthenticated && user) {
			await Promise.all([fetchNotifications(), fetchUnreadCount()]);
		}
	}, [isAuthenticated, user, fetchNotifications, fetchUnreadCount]);

	useEffect(() => {
		if (isAuthenticated && user) {
			if (currentUserId && currentUserId !== user.sub) {
				console.log("Usuário mudou, limpando notificações antigas");
				setNotifications([]);
				setUnreadCount(0);
				setError(null);
			}
			setCurrentUserId(user.sub);
		} else {
			setNotifications([]);
			setUnreadCount(0);
			setCurrentUserId(null);
			setError(null);
		}
	}, [isAuthenticated, user, currentUserId]);

	useEffect(() => {
		if (isAuthenticated && user && currentUserId === user.sub) {
			fetchNotifications();
			fetchUnreadCount();

			const interval = setInterval(() => {
				if (!document.hidden) {
					fetchNotifications();
					fetchUnreadCount();
				}
			}, 10000);

			const handleVisibilityChange = () => {
				if (!document.hidden) {
					fetchNotifications();
					fetchUnreadCount();
				}
			};

			document.addEventListener("visibilitychange", handleVisibilityChange);

			return () => {
				clearInterval(interval);
				document.removeEventListener("visibilitychange", handleVisibilityChange);
			};
		}
	}, [isAuthenticated, user, currentUserId, fetchNotifications, fetchUnreadCount]);

	return {
		notifications,
		unreadCount,
		loading,
		error,
		fetchNotifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		refreshNotifications,
	};
}
