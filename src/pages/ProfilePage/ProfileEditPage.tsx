import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUser } from "@/hooks/useAuth";
import { PerfilService, UpdatePerfilData } from "@/services/perfilService";
import { AlertCircle, ArrowLeft, Camera, Save } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const { user, isLoading, checkAuthStatus } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdatePerfilData>({
    nome: "",
    celular: "",
    idade: 0,
  });
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && user) {
      setFormData({
        nome: user.profile?.nome || "",
        celular: user.profile?.celular || "",
        idade: user.profile?.idade || 0,
      });
      setPreview(user.avatarUrl || null);
      setLoadingPage(false);
    }
  }, [isLoading, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await PerfilService.updateMyProfile(formData, newProfilePicture || undefined);
      toast.success("Perfil atualizado com sucesso!");
      await checkAuthStatus(); 
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loadingPage) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold mb-4 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          Voltar para o Perfil
        </button>

        <div className="bg-white rounded-lg shadow-md border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={preview || `https://ui-avatars.com/api/?name=${formData.nome}&background=898f29&color=fff`}
                  alt="Foto de Perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gray-700 text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors">
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              <div className="flex-1">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700">Celular</label>
                <input type="text" id="celular" name="celular" value={formData.celular} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700">Idade</label>
                <input type="number" id="idade" name="idade" value={formData.idade} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button type="button" onClick={() => navigate("/perfil")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancelar</button>
              <button type="submit" disabled={loading} className="px-6 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 font-medium bg-green-600 hover:bg-green-700">
                {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}