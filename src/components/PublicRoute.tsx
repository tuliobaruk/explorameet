import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuth";

interface PublicRouteProps {
	children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
	const { isAuthenticated, isLoading } = useAuthContext();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-verde-oliva">Carregando...</p>
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/explorar" replace />;
	}

	return <>{children}</>;
}
