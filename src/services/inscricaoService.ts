import api from '@/api/axiosConfig';

export interface Inscricao {
  id: string;
  data_inscricao: string;
  status: string;
  quantidade_pessoas: number;
  passeio: {
    id: string;
    titulo: string;
    descricao: string;
    valor?: string;
  };
  cliente: {
    id: string;
    perfil: {
      nome: string;
      celular: string;
    };
  };
  horarioDisponivel: {
    id: string;
    data_hora: string;
    vagas_disponiveis: number;
  };
}

export interface CreateInscricaoData {
  id_passeio: string;
  id_cliente: string;
  id_horario_disponivel: string;
  quantidade_pessoas?: number;
}

export interface UpdateInscricaoData {
  status?: string;
  quantidade_pessoas?: number;
}

class InscricaoService {
  async create(data: CreateInscricaoData): Promise<Inscricao> {
    const response = await api.post('/inscricoes-passeio', data);
    return response.data;
  }

  async findAll(filters?: {
    clienteId?: string;
    passeioId?: string;
    status?: string;
  }): Promise<Inscricao[]> {
    const params = new URLSearchParams();
    if (filters?.clienteId) params.append('clienteId', filters.clienteId);
    if (filters?.passeioId) params.append('passeioId', filters.passeioId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/inscricoes-passeio?${params.toString()}`);
    return response.data;
  }

  async findById(id: string): Promise<Inscricao> {
    const response = await api.get(`/inscricoes-passeio/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateInscricaoData): Promise<Inscricao> {
    const response = await api.patch(`/inscricoes-passeio/${id}`, data);
    return response.data;
  }

  async cancel(id: string, motivo?: string): Promise<Inscricao> {
    const response = await api.patch(`/inscricoes-passeio/${id}/cancelar`, { motivo });
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await api.delete(`/inscricoes-passeio/${id}`);
  }

  async findByGuia(guiaId: string): Promise<Inscricao[]> {
    const response = await api.get(`/inscricoes-passeio/guia/${guiaId}`);
    return response.data;
  }

  async findByCliente(clienteId: string): Promise<Inscricao[]> {
    const response = await api.get(`/inscricoes-passeio?clienteId=${clienteId}`);
    return response.data;
  }
}

export default new InscricaoService();