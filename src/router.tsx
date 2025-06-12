import { createBrowserRouter } from "react-router-dom";

// Páginas Públicas
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import RegisterDetailsPage from "@/pages/register/RegisterDetailsPage";
import FeedPage from "@/pages/FeedPage/FeedPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/cadastro",
		element: <RegisterPage />,
	},
	{
		path: "/cadastro/detalhes",
		element: <RegisterDetailsPage />,
	},
	{
		path: "/FeedPage",
		element: <FeedPage />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
