
export const STATUS_VALIDOS: string[] = ["EM_ANALISE", "APROVADO", "RECUSADO"];


export interface AtualizarStatusDTO {
  status: string;
}