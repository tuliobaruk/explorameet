import { useCallback, useEffect, useState } from "react";
import { useUser } from "./useAuth";
import LocalizacaoService, { Localizacao } from "@/services/localizacaoService";

export function useLocalizacoes() {
	const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user, isAuthenticated } = useUser();

	const fetchLocalizacoes = useCallback(async () => {
		if (!isAuthenticated || !user?.perfil?.guia?.id) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await LocalizacaoService.getLocalizacoesByGuia(user.perfil.guia.id);
			setLocalizacoes(data || []);
		} catch (err) {
			console.error("Erro ao carregar localizações:", err);
			setError("Erro ao carregar localizações");
			setLocalizacoes([]);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, user?.perfil?.guia?.id]);

	useEffect(() => {
		fetchLocalizacoes();
	}, [fetchLocalizacoes]);

  console.log(localizacoes)
	const hasLocalizacoes = localizacoes.length > 0;

	return {
		localizacoes,
		loading,
		error,
		hasLocalizacoes,
		refetch: fetchLocalizacoes,
	};
}
