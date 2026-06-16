import { Request, Response } from "express";
import { OrcamentoModel } from "../models/OrcamentoModel";

interface AuthRequest extends Request {
  userId: number;
}

interface OrcamentoComDono {
  user_id: number;
}

interface MontarOrcamentoParams {
  userId: number;
  dados: Orcamento;
  totalKg: number;
  invest: number;
}

interface OrcamentoUpdateBody {
  empresa: string;
  cnpj: string;
  local: string | null;
}

interface Paginacao {
  page: number;
  limit: number;
  offset: number;
}

function validarOrcamento(
  empresa: string,
  cnpj: string,
  equipamentos: Equipamento[]
): void {
  if (!empresa || !cnpj || !equipamentos || equipamentos.length === 0) {
    throw new Error("Empresa, CNPJ e equipamentos são obrigatórios");
  }
}

function calcularTotalKg(equipamentos: Equipamento[]): number {
  let total = 0;

  equipamentos.forEach((item) => {
    const { tipo, litragem, quantidade } = item;

    if (!tipo || !quantidade) return;
    if (tipo === "KIT") total += quantidade * 80;
    if (litragem) total += (litragem * 0.5 * quantidade) / 1000;
  });

  return Number(total.toFixed(2));
}

function calcularInvestimento(totalKg: number): number {
  return Number((totalKg * 3960).toFixed(2));
}

function montarSolicitante(solicitante: Solicitante) {
  return {
    nome: solicitante.nome,
    email: solicitante.email,
    cpf: solicitante.cpf,
    telefone: solicitante.telefone
  };
}

function montarOrcamentoBase(params: MontarOrcamentoParams) {
  return {
    userId: params.userId,
    quantidadeTotalKg: params.totalKg,
    investimentoTotal: params.invest,
    empresa: params.dados.empresa,
    cnpj: params.dados.cnpj,
    local: params.dados.local || null,
    equipamentos: JSON.stringify(params.dados.equipamentos),
    status: "EM_ANALISE"
  };
}

function montarOrcamento(params: MontarOrcamentoParams) {
  return {
    ...montarSolicitante(params.dados.solicitante),
    ...montarOrcamentoBase(params)
  };
}

function obterPaginacao(req: Request): Paginacao {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

function obterBodyUpdate(body: Partial<OrcamentoUpdateBody>): OrcamentoUpdateBody {
  return {
    empresa: body.empresa || "",
    cnpj: body.cnpj || "",
    local: body.local ?? null
  };
}

async function buscarOrcamento(id: number): Promise<OrcamentoComDono> {
  const orcamento = await OrcamentoModel.findById(id);
  if (!orcamento) throw new Error("Orçamento não encontrado");
  return orcamento as OrcamentoComDono;
}

function validarDono(orcamento: OrcamentoComDono, userId: number): void {
  if (orcamento.user_id !== userId) throw new Error("Sem permissão");
}

function tratarErro(error: Error, res: Response, msg: string) {
  if (error.message === "Orçamento não encontrado") {
    return res.status(404).json({ message: error.message });
  }

  if (error.message === "Sem permissão") {
    return res.status(403).json({ message: "Você não tem permissão" });
  }

  if (error.message.includes("obrigatórios")) {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Campos obrigatórios") {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: msg });
}

async function criarOrcamento(userId: number, dados: Orcamento): Promise<void> {
  validarOrcamento(dados.empresa, dados.cnpj, dados.equipamentos);
  const totalKg = calcularTotalKg(dados.equipamentos);
  const investimento = calcularInvestimento(totalKg);

  const orcamento = montarOrcamento({
    userId,
    dados,
    totalKg,
    invest: investimento
  });

  await OrcamentoModel.create(orcamento);
}

async function atualizarOrcamento(
  id: number,
  userId: number,
  body: Partial<OrcamentoUpdateBody>
): Promise<void> {
  const { empresa, cnpj, local } = obterBodyUpdate(body);
  if (!empresa || !cnpj) throw new Error("Campos obrigatórios");

  const orcamento = await buscarOrcamento(id);
  validarDono(orcamento, userId);
  await OrcamentoModel.update(id, empresa, cnpj, local);
}

async function deletarOrcamento(id: number, userId: number): Promise<void> {
  const orcamento = await buscarOrcamento(id);
  validarDono(orcamento, userId);
  await OrcamentoModel.delete(id);
}

export class OrcamentoController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const dados = req.body as Orcamento;
      await criarOrcamento(userId, dados);
      return res.status(201).json({ message: "Orçamento criado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao criar orçamento");
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const { page, limit, offset } = obterPaginacao(req);
      const { orcamentos, total } = await OrcamentoModel.findAllWithPagination(
        userId,
        limit,
        offset
      );

      return res.status(200).json({
        orcamentos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar orçamentos");
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const id = Number(req.params.id);
      const orcamento = await buscarOrcamento(id);
      validarDono(orcamento, userId);
      return res.status(200).json(orcamento);
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar orçamento");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const id = Number(req.params.id);
      await atualizarOrcamento(id, userId, req.body as Partial<OrcamentoUpdateBody>);
      return res.status(200).json({ message: "Orçamento atualizado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao atualizar orçamento");
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const id = Number(req.params.id);
      await deletarOrcamento(id, userId);
      return res.status(200).json({ message: "Orçamento deletado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao deletar orçamento");
    }
  }
}