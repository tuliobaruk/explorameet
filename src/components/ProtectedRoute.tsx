import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuth";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuthContext();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-verde-oliva">Verificando autenticação...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
