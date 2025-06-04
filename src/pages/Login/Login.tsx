// LoginPage.tsx (Exemplo de adaptação)
import { Link } from "react-router-dom";
import { Mountain, LogIn, Mail, KeyRound, Chrome, Facebook, Apple } from "lucide-react";
import '../AuthPage.css'; // <<< IMPORTAR O NOVO CSS

export default function LoginPage() {
  return (
    <div className="auth-page-container"> {/* Usa a classe do AuthPage.css */}
      <header className="auth-header"> {/* Usa a classe do AuthPage.css */}
        <Link to="/" className="header-logo-link"> {/* Nova classe para o link do logo */}
          <Mountain size={32} />
          <span>ExploraMeet</span>
        </Link>
        <nav className="auth-header-nav flex gap-3 sm:gap-4 items-center"> {/* Nova classe para a nav */}
          <span>Não tem uma conta?</span>
          <Link to="/cadastro">
            <button className="auth-nav-button"> {/* Nova classe para o botão */}
              Cadastre-se
            </button>
          </Link>
        </nav>
      </header>

      <main className="auth-main-content"> {/* Usa a classe do AuthPage.css */}
        <div className="auth-card"> {/* Usa a classe do AuthPage.css */}
          <div className="auth-card-header"> {/* Nova classe */}
            <LogIn size={48} className="auth-icon" /> {/* Nova classe para o ícone */}
            <h1 className="auth-title">Acessar sua Conta</h1> {/* Usa a classe do AuthPage.css */}
            <p className="auth-subtitle mt-1">Bem-vindo de volta! Insira seus dados.</p> {/* Usa a classe do AuthPage.css */}
          </div>

          <form className="auth-form"> {/* Usa a classe do AuthPage.css */}
            <div>
              <label htmlFor="email">Email</label>
              <div className="auth-input-container mt-1"> {/* Nova classe */}
                <Mail size={18} className="auth-input-icon" /> {/* Nova classe */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input" /* Usa a classe do AuthPage.css */
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password">Senha</label>
                <Link to="/esqueci-senha" className="auth-link"> {/* Usa a classe do AuthPage.css */}
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="auth-input-container"> {/* Nova classe */}
                <KeyRound size={18} className="auth-input-icon" /> {/* Nova classe */}
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="auth-input" /* Usa a classe do AuthPage.css */
                  placeholder="Sua senha"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="auth-button-primary"> {/* Usa a classe do AuthPage.css */}
                Entrar
              </button>
            </div>
          </form>

          <div className="auth-divider"> {/* Usa a classe do AuthPage.css */}
            <span className="auth-divider-text">Ou entre com</span> {/* Nova classe */}
          </div>

          <div className="auth-social-buttons-container"> {/* Nova classe */}
            <button type="button" className="auth-button-social"> {/* Usa a classe do AuthPage.css */}
              <Chrome size={20} className="social-icon" /> {/* Nova classe para ícone social */}
              Continuar com Google
            </button>
            <button type="button" className="auth-button-social">
              <Facebook size={20} className="social-icon" style={{ color: '#1877F2' }} /> {/* Cor específica para o ícone do FB */}
              Continuar com Facebook
            </button>
             <button type="button" className="auth-button-social">
              <Apple size={20} className="social-icon" />
              Continuar com Apple
            </button>
          </div>

          <p className="auth-switch-link-text"> {/* Nova classe */}
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" className="auth-link"> {/* Usa a classe do AuthPage.css */}
              Crie uma agora!
            </Link>
          </p>
        </div>
      </main>

      <footer className="auth-footer"> {/* Usa a classe do AuthPage.css */}
        <span className="auth-footer-text"> {/* Nova classe */}
          Copyright ©{new Date().getFullYear()} ExploraMeet. Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
}