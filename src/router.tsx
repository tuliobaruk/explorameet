import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import RegisterDetailsPage from "@/pages/register/RegisterDetailsPage";
import CompleteGoogleRegistrationPage from "@/pages/register/CompleteGoogleRegistrationPage";
import LoginSuccessPage from "@/pages/login/LoginSuccessPage";
import EmailConfirmationPage from "@/pages/auth/EmailConfirmationPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import FeedPage from "@/pages/FeedPage/FeedPage";
import { PublicRoute } from "@/components/PublicRoute";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<PublicRoute>
				<HomePage />
			</PublicRoute>
		),
		errorElement: <NotFoundPage />,
	},
	{
		path: "/login",
		element: (
			<PublicRoute>
				<LoginPage />
			</PublicRoute>
		),
	},
	{
		path: "/cadastro",
		element: (
			<PublicRoute>
				<RegisterPage />
			</PublicRoute>
		),
	},
	{
		path: "/cadastro/detalhes",
		element: (
			<PublicRoute>
				<RegisterDetailsPage />
			</PublicRoute>
		),
	},
	{
		path: "/complete-registration",
		element: (
			<PublicRoute>
				<CompleteGoogleRegistrationPage />
			</PublicRoute>
		),
	},
	{
		path: "/login-success",
		element: (
			<PublicRoute>
				<LoginSuccessPage />
			</PublicRoute>
		),
	},
	{
		path: "/confirmar-email",
		element: (
			<PublicRoute>
				<EmailConfirmationPage />
			</PublicRoute>
		),
	},
	{
		path: "/esqueci-senha",
		element: (
			<PublicRoute>
				<ForgotPasswordPage />
			</PublicRoute>
		),
	},
	{
		path: "/redefinir-senha",
		element: (
			<PublicRoute>
				<ResetPasswordPage />
			</PublicRoute>
		),
	},
	{
		path: "/explorar",
		element: <FeedPage />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
