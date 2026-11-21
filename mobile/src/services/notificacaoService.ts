import api from "./api";

export interface Notificacao {
  id: number;
  tipo: string;
  orcamento_id: number;
  mensagem: string;
  lida: boolean | number;
  created_at: string;
}

export interface RespostaNotificacoes {
  notificacoes: Notificacao[];
  naoLidas: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listarNotificacoes(
  page = 1,
  limit = 20
): Promise<RespostaNotificacoes> {
  const response = await api.get<RespostaNotificacoes>("/notificacoes", {
    params: { page, limit },
  });

  return response.data;
}

export async function marcarNotificacaoComoLida(
  id: number
): Promise<void> {
  await api.patch(`/notificacoes/${id}/lida`);
}
