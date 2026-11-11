export const CANAIS = {
  ORCAMENTO_CRIADO: "orcamento.criado",
  ORCAMENTO_APROVADO: "orcamento.aprovado",
  ORCAMENTO_RECUSADO: "orcamento.recusado",
} as const;

export type Canal = (typeof CANAIS)[keyof typeof CANAIS];

export const TODOS_OS_CANAIS: Canal[] = Object.values(CANAIS);

export interface DadosOrcamento {
  orcamentoId: number;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
}

export interface EventoOrcamento {
  id: string;
  tipo: Canal;
  ocorridoEm: string;
  dados: DadosOrcamento;
}