import { useState, useEffect, useCallback } from "react";
import PasseioService, {
	Passeio,
	PasseiosResponse,
	PaginationParams,
} from "@/services/passeioService";
import { toast } from "react-toastify";

interface UsePasseiosOptions {
	initialPage?: number;
	initialLimit?: number;
	autoLoad?: boolean;
	disponiveis?: boolean;
}

interface UsePasseiosReturn {
	passeios: Passeio[];
	loading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
	loadPasseios: (params?: PaginationParams) => Promise<void>;
	searchPasseios: (searchTerm: string, params?: PaginationParams) => Promise<void>;
	refreshPasseios: () => Promise<void>;
	goToPage: (page: number) => Promise<void>;
	nextPage: () => Promise<void>;
	prevPage: () => Promise<void>;
}

export const usePasseios = (options: UsePasseiosOptions = {}): UsePasseiosReturn => {
	const { initialPage = 1, initialLimit = 10, autoLoad = true, disponiveis = true } = options;

	const [passeios, setPasseios] = useState<Passeio[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrev, setHasPrev] = useState(false);
	const [lastParams, setLastParams] = useState<PaginationParams & { searchTerm?: string }>({});

	const loadPasseios = useCallback(
		async (params: PaginationParams = {}) => {
			try {
				setLoading(true);
				setError(null);

				const requestParams = {
					page: initialPage,
					limit: initialLimit,
					disponiveis,
					...params,
				};

				setLastParams(requestParams);

				const response: PasseiosResponse = await PasseioService.getAllPasseios(requestParams);

				const sanitizedPasseios = (response.data || []).filter(
					(passeio) => passeio && passeio.id && passeio.titulo,
				);

				setPasseios(sanitizedPasseios);
				setCurrentPage(response.currentPage || 1);
				setTotalPages(response.totalPages || 1);
				setHasNext(!!response.next);
				setHasPrev(!!response.previous);
			} catch (err) {
				const errorMessage = "Erro ao carregar passeios";
				setError(errorMessage);
				setPasseios([]);
				toast.error(errorMessage);
				console.error("Erro ao carregar passeios:", err);
			} finally {
				setLoading(false);
			}
		},
		[initialPage, initialLimit, disponiveis],
	);

	const searchPasseios = useCallback(
		async (searchTerm: string, params: PaginationParams = {}) => {
			try {
				setLoading(true);
				setError(null);

				const requestParams = {
					page: 1,
					limit: initialLimit,
					disponiveis,
					...params,
				};

				setLastParams({ ...requestParams, searchTerm });

				const response: PasseiosResponse = await PasseioService.searchPasseios(
					searchTerm,
					requestParams,
				);

				const sanitizedPasseios = (response.data || []).filter(
					(passeio) => passeio && passeio.id && passeio.titulo,
				);

				setPasseios(sanitizedPasseios);
				setCurrentPage(response.currentPage || 1);
				setTotalPages(response.totalPages || 1);
				setHasNext(!!response.next);
				setHasPrev(!!response.previous);
			} catch (err) {
				const errorMessage = "Erro ao buscar passeios";
				setError(errorMessage);
				setPasseios([]);
				toast.error(errorMessage);
				console.error("Erro ao buscar passeios:", err);
			} finally {
				setLoading(false);
			}
		},
		[initialLimit, disponiveis],
	);

	const refreshPasseios = useCallback(async () => {
		if (lastParams.searchTerm) {
			await searchPasseios(lastParams.searchTerm, lastParams);
		} else {
			await loadPasseios(lastParams);
		}
	}, [lastParams, loadPasseios, searchPasseios]);

	const goToPage = useCallback(
		async (page: number) => {
			if (page >= 1 && page <= totalPages && page !== currentPage) {
				const params = { ...lastParams, page };

				if (lastParams.searchTerm) {
					await searchPasseios(lastParams.searchTerm, params);
				} else {
					await loadPasseios(params);
				}
			}
		},
		[currentPage, totalPages, lastParams, loadPasseios, searchPasseios],
	);

	const nextPage = useCallback(async () => {
		if (hasNext) {
			await goToPage(currentPage + 1);
		}
	}, [hasNext, currentPage, goToPage]);

	const prevPage = useCallback(async () => {
		if (hasPrev) {
			await goToPage(currentPage - 1);
		}
	}, [hasPrev, currentPage, goToPage]);

	useEffect(() => {
		if (autoLoad) {
			loadPasseios();
		}
	}, [autoLoad, loadPasseios]);

	return {
		passeios,
		loading,
		error,
		currentPage,
		totalPages,
		hasNext,
		hasPrev,
		loadPasseios,
		searchPasseios,
		refreshPasseios,
		goToPage,
		nextPage,
		prevPage,
	};
};
