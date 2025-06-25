import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function LoginSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/explorar", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-oliva to-verde-escuro flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-verde-oliva mb-4">
          Login realizado com sucesso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Você será redirecionado automaticamente...
        </p>
        
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-verde-oliva border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <button
          onClick={() => navigate("/feed", { replace: true })}
          className="mt-6 w-full bg-verde-oliva text-white py-3 px-4 rounded-lg font-medium hover:bg-verde-escuro transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}