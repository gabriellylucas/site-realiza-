export {};

declare global {
  type TipoEquipamento = "ABT" | "ACF" | "ABTS" | "AT" | "KIT";

  interface Equipamento {
    tipo: TipoEquipamento;
    litragem: number;
    quantidade: number;
  }

  interface Solicitante {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
  }

  interface Orcamento {
    empresa: string;
    cnpj: string;
    local?: string | null;
    equipamentos: Equipamento[];
    solicitante: Solicitante;
  }
}