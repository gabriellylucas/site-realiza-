// DTO de entrada para atualizar um orçamento (campos editáveis pelo cliente)
export interface OrcamentoUpdateDTO {
  empresa: string;
  cnpj: string;
  local: string | null;
}