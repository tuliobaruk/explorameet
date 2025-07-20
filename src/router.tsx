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
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CreateActivityPage from "./pages/CreateActivityPage/CreateActivityPage";
import ActivityDetailPage from "./pages/ActivityDetailPage/ActivityDetailPage";
import GuidePublicProfilePage from "./pages/GuidePublicProfilePage/GuidePublicProfilePage";
import CreatePasseioPage from "./pages/passeio/PasseioCreatePage";
import HorarioPasseioPage from "./pages/horarioPasseio/HorarioPasseioPage";
import TermsAndPrivacyPage from "./pages/TermsAndPrivacyPage/TermsAndPrivacyPage";
import MeusPasseiosPage from "./pages/MeusPasseiosPage/MeusPasseiosPage";

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
		path: "/complete-registration",
		element: <CompleteGoogleRegistrationPage />,
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
    path: "/passeio/:passeioId",
    element: <ActivityDetailPage />,  
  },
	{
		path: "*",
		element: <NotFoundPage />,
	},
	{
		path: "perfil",
		element: <ProfilePage />,
	},
	{
		path: "criar-atividade",
		element: <CreateActivityPage />,
	},
	{
		path: "atividade-detalhes",
		element: <ActivityDetailPage />,
	},
	{
		path: "/guia/:guideId",
		element: <GuidePublicProfilePage />,
	},
	{
		path: "/criar-passeio",
		element: <CreatePasseioPage />,
	},
	{
		path: "/gerenciar-horarios/:passeioId",
		element: <HorarioPasseioPage />,
	},
	{
		path: "/esqueci-senha",
		element: <ForgotPasswordPage />,
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
    path: "/termos",
    element: <TermsAndPrivacyPage />,
  },
  {
    path: "/privacidade",
    element: <TermsAndPrivacyPage />,
  },
	{
    path: "/meus-passeios",
    element: <MeusPasseiosPage />,
  },
]);

export default router;
