// Status válidos de um orçamento
export const STATUS_VALIDOS: string[] = ["EM_ANALISE", "APROVADO", "RECUSADO"];

// DTO de entrada para o administrador alterar o status de um orçamento
export interface AtualizarStatusDTO {
  status: string;
}