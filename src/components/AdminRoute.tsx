import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

interface AdminRouteProps {
	children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
	const { isAdmin, isLoading, isAuthenticated } = useUser();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-verde-oliva">Verificando permissões...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!isAdmin()) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
