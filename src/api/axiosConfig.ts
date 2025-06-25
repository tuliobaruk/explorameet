import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

let isRefreshing = false;
let refreshSubscribers: Array<(token?: string) => void> = [];

function subscribeTokenRefresh(cb: (token?: string) => void) {
	refreshSubscribers.push(cb);
}

function onRrefreshed(token?: string) {
	refreshSubscribers.map((cb) => cb(token));
	refreshSubscribers = [];
}

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		return config;
	},
	(error) => {
		console.error("Request Error:", error);
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest.url?.includes("/refresh") &&
			!originalRequest.url?.includes("/login")
		) {
			if (isRefreshing) {
				return new Promise((resolve) => {
					subscribeTokenRefresh((token?: string) => {
						if (token) {
							resolve(apiClient.request(originalRequest));
						} else {
							resolve(Promise.reject(error));
						}
					});
				});
			}

			isRefreshing = true;

			try {
				const refreshResponse = await apiClient.post("/auth/refresh");

				if (refreshResponse.status === 200) {
					onRrefreshed("success");
					isRefreshing = false;

					return apiClient.request(originalRequest);
				}
			} catch (refreshError) {
				onRrefreshed();
				isRefreshing = false;

				if (
					!window.location.pathname.includes("/login") &&
					!window.location.pathname.includes("/cadastro") &&
					!window.location.pathname.includes("/esqueci-senha")
				) {
					sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
					window.location.href = "/login";
				}

				return Promise.reject(refreshError);
			}
		}

		const apiError = new ApiError(
			(error.response?.data as { message?: string })?.message || error.message || "Erro de conexão",
			error.response?.status || 0,
			error.response?.data,
		);

		console.error("API Error:", apiError);
		return Promise.reject(apiError);
	},
);

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public data?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export default apiClient;
