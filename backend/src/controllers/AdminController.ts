import { Request, Response } from "express";
import { connection } from "../services/database";
import { RowDataPacket } from "mysql2";
import { OrcamentoModel } from "../models/OrcamentoModel";
import { UserModel } from "../models/UserModel";

interface CountRow extends RowDataPacket {
  total: number;
}

interface SomaRow extends RowDataPacket {
  total: number | null;
}

interface PorMesRow extends RowDataPacket {
  mes: string;
  total: number;
}

interface PorStatusRow extends RowDataPacket {
  status: string;
  total: number;
}

interface UltimoOrcamentoRow extends RowDataPacket {
  id: number;
  nome: string;
  empresa: string;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

interface AuthRequest extends Request {
  userId: number;
}

async function contarPorStatus(status: string): Promise<number> {
  const sql = `SELECT COUNT(*) as total FROM orcamentos WHERE status = ?`;
  const [rows] = await connection.execute<CountRow[]>(sql, [status]);
  return rows[0].total;
}

async function contarTotal(): Promise<number> {
  const sql = `SELECT COUNT(*) as total FROM orcamentos`;
  const [rows] = await connection.execute<CountRow[]>(sql);
  return rows[0].total;
}

async function somarInvestimentoTotal(): Promise<number> {
  const sql = `SELECT COALESCE(SUM(investimento_total), 0) as total FROM orcamentos`;
  const [rows] = await connection.execute<SomaRow[]>(sql);
  return Number(rows[0].total) || 0;
}

async function somarKgTotal(): Promise<number> {
  const sql = `SELECT COALESCE(SUM(quantidade_total_kg), 0) as total FROM orcamentos`;
  const [rows] = await connection.execute<SomaRow[]>(sql);
  return Number(rows[0].total) || 0;
}

async function buscarOrcamentosPorMes(): Promise<PorMesRow[]> {
  const sql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total
    FROM orcamentos
    GROUP BY mes
    ORDER BY mes ASC
    LIMIT 12
  `;
  const [rows] = await connection.execute<PorMesRow[]>(sql);
  return rows;
}

async function buscarDistribuicaoPorStatus(): Promise<PorStatusRow[]> {
  const sql = `
    SELECT status, COUNT(*) as total
    FROM orcamentos
    GROUP BY status
  `;
  const [rows] = await connection.execute<PorStatusRow[]>(sql);
  return rows;
}

async function buscarUltimosOrcamentos(): Promise<UltimoOrcamentoRow[]> {
  const sql = `
    SELECT id, nome, empresa, quantidade_total_kg, investimento_total, status, created_at
    FROM orcamentos
    ORDER BY created_at DESC
    LIMIT 5
  `;
  const [rows] = await connection.execute<UltimoOrcamentoRow[]>(sql);
  return rows;
}

async function montarDashboard() {
  const [
    total,
    pendentes,
    aprovados,
    recusados,
    investimentoTotal,
    kgTotal,
    porMes,
    porStatus,
    ultimos
  ] = await Promise.all([
    contarTotal(),
    contarPorStatus("EM_ANALISE"),
    contarPorStatus("APROVADO"),
    contarPorStatus("RECUSADO"),
    somarInvestimentoTotal(),
    somarKgTotal(),
    buscarOrcamentosPorMes(),
    buscarDistribuicaoPorStatus(),
    buscarUltimosOrcamentos()
  ]);

  return {
    cards: {
      totalOrcamentos: total,
      pendentes,
      aprovados,
      recusados,
      investimentoTotal,
      kgTotal
    },
    orcamentosPorMes: porMes,
    distribuicaoPorStatus: porStatus,
    ultimosOrcamentos: ultimos
  };
}

const STATUS_VALIDOS = ["EM_ANALISE", "APROVADO", "RECUSADO"];

export class AdminController {
  static async dashboard(req: Request, res: Response) {
    try {
      const dados = await montarDashboard();
      return res.status(200).json(dados);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar dados do dashboard" });
    }
  }

  static async listarOrcamentos(req: Request, res: Response) {
    try {
      const orcamentos = await OrcamentoModel.findAll();
      return res.status(200).json({ orcamentos });
    } catch {
      return res.status(500).json({ message: "Erro ao buscar orçamentos" });
    }
  }

  static async atualizarStatusOrcamento(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status: string };

      if (!STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      await OrcamentoModel.updateStatus(id, status);
      return res.status(200).json({ message: "Status atualizado com sucesso" });
    } catch {
      return res.status(500).json({ message: "Erro ao atualizar status" });
    }
  }

  static async listarUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await UserModel.findAll();
      return res.status(200).json({ usuarios });
    } catch {
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  static async deletarUsuario(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userIdLogado = (req as AuthRequest).userId;

      if (id === userIdLogado) {
        return res.status(400).json({ message: "Você não pode excluir sua própria conta por aqui" });
      }

      await UserModel.delete(id);
      return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch {
      return res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  }
}