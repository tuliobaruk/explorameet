import { createBrowserRouter } from "react-router-dom";

// Páginas Públicas
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
	// Rotas Públicas
	{
		path: "/",
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
]);

export default router;
