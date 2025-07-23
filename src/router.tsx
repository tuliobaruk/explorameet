import { createBrowserRouter } from "react-router-dom";

import { PublicRoute } from "@/components/PublicRoute";
import EmailConfirmationPage from "@/pages/auth/EmailConfirmationPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import FeedPage from "@/pages/FeedPage/FeedPage";
import GuideOwnActivityListPage from "@/pages/guideOwnActivityList/guideOwnActivityPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import LoginSuccessPage from "@/pages/login/LoginSuccessPage";
import NotFoundPage from "@/pages/NotFoundPage";
import CompleteGoogleRegistrationPage from "@/pages/register/CompleteGoogleRegistrationPage";
import RegisterDetailsPage from "@/pages/register/RegisterDetailsPage";
import RegisterPage from "@/pages/register/RegisterPage";
import { AdminRoute } from "./components/AdminRoute";
import ActivityDetailPage from "./pages/ActivityDetailPage/ActivityDetailPage";
import AdminCategoriaPage from "./pages/admin/AdminCategoriaPage";
import AdminGuiasPage from "./pages/admin/AdminGuiasPage";
import AdminPlansPage from "./pages/admin/AdminPlansPage";
import AdminRestricaoPage from "./pages/admin/AdminRestricaoPage";
import ClientSubscriptionsPage from "./pages/ClientSubscriptionsPage/ClientSubscriptionsPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage/ConfiguracoesPage";
import GuidePublicProfilePage from "./pages/GuidePublicProfilePage/GuidePublicProfilePage";
import GuideSubscriptionsPage from "./pages/GuideSubscriptionsPage/GuideSubscriptionsPage";
import HorarioPasseioPage from "./pages/horarioPasseio/HorarioPasseioPage";
import CreateLocalizacaoPage from "./pages/localizacao/CreateLocalizacaoPage";
import CreatePasseioPage from "./pages/passeio/PasseioCreatePage";
import EditPasseioPage from "./pages/passeio/PasseioEditPage";
import ProfileEditPage from "./pages/ProfilePage/ProfileEditPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SubscriptionCancelPage from "./pages/subscription/SubscriptionCancelPage";
import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import SubscriptionSuccessPage from "./pages/subscription/SubscriptionSuccessPage";
import TermsAndPrivacyPage from "./pages/TermsAndPrivacyPage/TermsAndPrivacyPage";

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
		path: "perfil/editar",
		element: <ProfileEditPage />,
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
		path: "/cadastrar-localizacao",
		element: <CreateLocalizacaoPage />,
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
		element: <GuideOwnActivityListPage />,
	},
	{
		path: "/editar-passeio/:passeioId",
		element: <EditPasseioPage />,
	},
	{
		path: "/admin/planos",
		element: (
			<AdminRoute>
				<AdminPlansPage />
			</AdminRoute>
		),
	},
	{
		path: "/admin/restricoes",
		element: (
			<AdminRoute>
				<AdminRestricaoPage />
			</AdminRoute>
		),
	},
	{
		path: "/admin/categorias",
		element: (
			<AdminRoute>
				<AdminCategoriaPage />
			</AdminRoute>
		),
	},
	{
		path: "/admin/guias",
		element: (
			<AdminRoute>
				<AdminGuiasPage />
			</AdminRoute>
		),
	},
	{
		path: "/configuracoes",
		element: (
			<AdminRoute>
				<ConfiguracoesPage />
			</AdminRoute>
		),
	},
	{
		path: "/assinatura",
		element: <SubscriptionPage />,
	},
	{
		path: "/assinatura/sucesso",
		element: <SubscriptionSuccessPage />,
	},
	{
		path: "/assinatura/cancelado",
		element: <SubscriptionCancelPage />,
	},
	{
		path: "/guia/inscricoes",
		element: <GuideSubscriptionsPage />,
	},
	{
		path: "/minhas-inscricoes",
		element: <ClientSubscriptionsPage />,
	},
]);

export default router;
