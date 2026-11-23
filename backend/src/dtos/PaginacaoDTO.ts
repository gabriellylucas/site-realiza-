// DTO de paginação usado nas listagens (produtos e orçamentos)
export interface PaginacaoDTO {
  page: number;
  limit: number;
  offset: number;
}