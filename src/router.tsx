import { createBrowserRouter } from "react-router-dom";

// Páginas Públicas
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/LoginPage";

const router = createBrowserRouter([
	// Rotas Públicas
	{
		path: "/",
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
	{
		path: "/login",
		element: <LoginPage />
	}
]);

export default router;
