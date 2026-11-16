import api from "./api";

export interface Equipamento {
  tipo: string;
  litragem?: number;
  quantidade: number;
}

export interface Orcamento {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  empresa: string;
  cnpj: string;
  local: string | null;
  equipamentos: string;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

export interface NovoOrcamento {
  solicitante: {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
  };
  empresa: string;
  cnpj: string;
  local?: string;
  equipamentos: Equipamento[];
}

export async function listarOrcamentos(page = 1, limit = 10) {
  const response = await api.get(`/orcamentos?page=${page}&limit=${limit}`);
  return response.data as { orcamentos: Orcamento[]; pagination: any };
}

export async function criarOrcamento(dados: NovoOrcamento) {
  const response = await api.post("/orcamentos", dados);
  return response.data;
}

export async function buscarOrcamento(id: number) {
  const response = await api.get(`/orcamentos/${id}`);
  return response.data as Orcamento;
}

export async function atualizarOrcamento(id: number, empresa: string, cnpj: string, local: string | null) {
  const response = await api.put(`/orcamentos/${id}`, { empresa, cnpj, local });
  return response.data;
}

export async function deletarOrcamento(id: number) {
  const response = await api.delete(`/orcamentos/${id}`);
  return response.data;
}