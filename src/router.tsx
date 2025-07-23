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
import CreateLocalizacaoPage from "./pages/localizacao/CreateLocalizacaoPage";
import HorarioPasseioPage from "./pages/horarioPasseio/HorarioPasseioPage";
import TermsAndPrivacyPage from "./pages/TermsAndPrivacyPage/TermsAndPrivacyPage";
// import MeusPasseiosPage from "./pages/MeusPasseiosPage/MeusPasseiosPage";
import EditPasseioPage from "./pages/passeio/PasseioEditPage";
import GuideOwnActivityListPage from "@/pages/guideOwnActivityList/guideOwnActivityPage";
import ProfileEditPage from "./pages/ProfilePage/ProfileEditPage";
import { AdminRoute } from "./components/AdminRoute";
import AdminPlansPage from "./pages/admin/AdminPlansPage";
import AdminRestricaoPage from "./pages/admin/AdminRestricaoPage";
import AdminCategoriaPage from "./pages/admin/AdminCategoriaPage";
import AdminGuiasPage from "./pages/admin/AdminGuiasPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage/ConfiguracoesPage";
import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import SubscriptionSuccessPage from "./pages/subscription/SubscriptionSuccessPage";
import SubscriptionCancelPage from "./pages/subscription/SubscriptionCancelPage";
import GuideSubscriptionsPage from "./pages/GuideSubscriptionsPage/GuideSubscriptionsPage";
import ClientSubscriptionsPage from "./pages/ClientSubscriptionsPage/ClientSubscriptionsPage";

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
