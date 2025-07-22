import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/useAuth";
import RestricaoService, { Restricao } from "@/services/restricaoService";
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


interface CreateRestricaoData {
  descricao: string;
}

export default function AdminRestricaoPage() {
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [restricoes, setRestricoes] = useState<Restricao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRestricao, setEditingRestricao] = useState<Restricao | null>(null);
  const navigate = useNavigate();

  const { isLoading, isAdmin } = useUser();

  const [formData, setFormData] = useState<CreateRestricaoData>({ descricao: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isLoading) return;
    if (!isAdmin()) {
      toast.error("Acesso negado.");
      navigate("/");
    }
  }, [isLoading, isAdmin, navigate]);

  useEffect(() => {
    const loadRestricoes = async () => {
      try {
        setLoadingPage(true);
        const data = await RestricaoService.getAllRestricoes();
        setRestricoes(data);
      } catch {
        toast.error("Erro ao carregar restrições.");
      } finally {
        setLoadingPage(false);
      }
    };
    if (isAdmin()) {
      loadRestricoes();
    }
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }
    setLoading(true);
    try {
      let savedRestricao: Restricao;
      
      if (editingRestricao) {
        savedRestricao = await RestricaoService.updateRestricao(editingRestricao.id, formData);
        setRestricoes(prev => prev.map(r => r.id === editingRestricao.id ? savedRestricao : r));
        toast.success("Restrição atualizada com sucesso!");
      } else {
        savedRestricao = await RestricaoService.createRestricao(formData);
        setRestricoes(prev => [...prev, savedRestricao]);
        toast.success("Restrição criada com sucesso!");
      }
      
      setShowForm(false);
      setEditingRestricao(null);
      setFormData({ descricao: "" });
    } catch {
      toast.error("Erro ao salvar restrição.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restricao: Restricao) => {
    setEditingRestricao(restricao);
    setFormData({ descricao: restricao.descricao });
    setShowForm(true);
  };

  const handleDelete = async (restricao: Restricao) => {
    if (!confirm("Tem certeza que deseja excluir esta restrição?")) return;
    
    try {
      await RestricaoService.deleteRestricao(restricao.id);
      setRestricoes(prev => prev.filter(r => r.id !== restricao.id));
      toast.success("Restrição excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir restrição.");
    }
  };

  const handleNewRestricao = () => {
    setEditingRestricao(null);
    setFormData({ descricao: "" });
    setShowForm(true);
  };

  if (loadingPage || isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="admin-restricao-container flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-12">
        <Link
					to="/configuracoes"
					className="flex items-center gap-2 font-semibold mb-6 transition-colors hover:underline"
					style={{ color: "var(--marrom-dourado)" }}
				>
					<ArrowLeft size={20} />
					Voltar para o painel do Admin
				</Link>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--verde-oliva)" }}>
            Gerenciar Restrições
          </h1>
          <button
            onClick={handleNewRestricao}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm"
            style={{ backgroundColor: "var(--verde-vibrante)" }}
          >
            <Plus size={18} /> Nova Restrição
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md border mb-6">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold" style={{ color: "var(--verde-oliva)" }}>
                {editingRestricao ? "Editar Restrição" : "Adicionar Nova Restrição"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Restrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Proibido menores de 18 anos que não estejam acompanhados de um responsável"
                  />
                  {errors.descricao && (
                    <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-white rounded-lg disabled:opacity-50"
                    style={{ backgroundColor: "var(--verde-vibrante)" }}
                  >
                    {loading ? "Salvando..." : "Salvar Restrição"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-4">Descrição</th>
                <th className="p-4">Data de Criação</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {restricoes.map((restricao) => (
                <tr key={restricao.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{restricao.descricao}</td>
                  <td className="p-4">
                    {new Date(restricao.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(restricao)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(restricao)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}