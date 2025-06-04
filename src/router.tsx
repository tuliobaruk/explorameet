import { createBrowserRouter } from "react-router-dom";

// Páginas Públicas
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
//import LoginPage from "@/pages/LoginPage";
import Login from "@/pages/Login/Login"
import CadastroPage from "./pages/CadastroPage/CadastroPage";
import FeedPage from "./pages/FeedPage/FeedPage";

const router = createBrowserRouter([
	// Rotas Públicas
	{
		path: "/",
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
	//{
	//	path: "/login",
	//	element: <LoginPage />
	//},
	{
		path: "/login",
		element: <Login />,
		errorElement: <NotFoundPage />,	
	},
	{
		path: "/cadastro",
		element: <CadastroPage />,
		errorElement: <NotFoundPage />,
	},
	{
		path: "/FeedPage",
		element: < FeedPage/>,
		errorElement: <NotFoundPage />,
	}

]);

export default router;
