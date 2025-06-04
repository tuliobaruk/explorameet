import { Link } from "react-router-dom";
import { Mountain, UserPlus, Mail, KeyRound, UserCircle, Chrome, Facebook, Apple } from "lucide-react";
import '../AuthPage.css'; // <<< IMPORTAR O AuthPage.css

export default function CadastroPage() {
  return (
    <div className="auth-page-container">
      <header className="auth-header">
        <Link to="/" className="header-logo-link">
          <Mountain size={32} />
          <span>ExploraMeet</span>
        </Link>
        <nav className="auth-header-nav">
          <span>Já tem uma conta?</span>
          <Link to="/login">
            <button className="auth-nav-button">
              Acessar
            </button>
          </Link>
        </nav>
      </header>

      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <UserPlus size={48} className="auth-icon" />
            <h1 className="auth-title">Crie sua Conta</h1>
            <p className="auth-subtitle mt-1">Junte-se à comunidade ExploraMeet!</p>
          </div>

          <form className="auth-form">
            <div>
              <label htmlFor="fullName">Nome Completo</label>
              <div className="auth-input-container mt-1">
                <UserCircle size={18} className="auth-input-icon" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="auth-input"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
               <div className="auth-input-container mt-1">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password">Senha</label>
              <div className="auth-input-container mt-1">
                <KeyRound size={18} className="auth-input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="auth-input"
                  placeholder="Crie uma senha forte"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className="auth-input-container mt-1">
                 <KeyRound size={18} className="auth-input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="auth-input"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>
            
            <div className="auth-terms-container">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="auth-terms-checkbox"
              />
              <label htmlFor="terms" className="auth-terms-label">
                Eu concordo com os{" "}
                <Link to="/termos" className="auth-link">
                  Termos de Serviço
                </Link>
              </label>
            </div>

            <div className="pt-1"> {/* Pequeno espaço adicional antes do botão principal */}
              <button type="submit" className="auth-button-primary">
                Criar Conta
              </button>
            </div>
          </form>

          <div className="auth-divider">
            <span className="auth-divider-text">Ou cadastre-se com</span>
          </div>

          <div className="auth-social-buttons-container">
            <button type="button" className="auth-button-social">
              <Chrome size={20} className="social-icon" />
              Cadastrar com Google
            </button>
            <button type="button" className="auth-button-social">
              <Facebook size={20} className="social-icon" style={{ color: '#1877F2' }} />
              Cadastrar com Facebook
            </button>
            <button type="button" className="auth-button-social">
              <Apple size={20} className="social-icon" />
              Cadastrar com Apple
            </button>
          </div>

          <p className="auth-switch-link-text">
            Já possui uma conta?{" "}
            <Link to="/login" className="auth-link">
              Faça login
            </Link>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <span className="auth-footer-text">
          Copyright ©{new Date().getFullYear()} ExploraMeet. Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
}
