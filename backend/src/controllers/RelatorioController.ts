import { Request, Response } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { connection } from "../services/database";
import { RowDataPacket } from "mysql2";

interface OrcamentoRelatorio extends RowDataPacket {
  id: number;
  nome: string;
  empresa: string;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  cliente?: string;
}

function formatarStatus(status: string): string {
  if (status === "EM_ANALISE") return "Pendente";
  if (status === "APROVADO") return "Aprovado";
  if (status === "RECUSADO") return "Recusado";
  return status;
}

async function buscarOrcamentosFiltrados(filtros: FiltrosRelatorio): Promise<OrcamentoRelatorio[]> {
  const condicoes: string[] = [];
  const valores: (string)[] = [];

  if (filtros.dataInicio) {
    condicoes.push("created_at >= ?");
    valores.push(`${filtros.dataInicio} 00:00:00`);
  }

  if (filtros.dataFim) {
    condicoes.push("created_at <= ?");
    valores.push(`${filtros.dataFim} 23:59:59`);
  }

  if (filtros.status) {
    condicoes.push("status = ?");
    valores.push(filtros.status);
  }

  if (filtros.cliente) {
    condicoes.push("(nome LIKE ? OR empresa LIKE ?)");
    valores.push(`%${filtros.cliente}%`, `%${filtros.cliente}%`);
  }

  const whereClause = condicoes.length > 0 ? `WHERE ${condicoes.join(" AND ")}` : "";

  const sql = `
    SELECT id, nome, empresa, quantidade_total_kg, investimento_total, status, created_at
    FROM orcamentos
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const [rows] = await connection.execute<OrcamentoRelatorio[]>(sql, valores);
  return rows;
}

async function gerarExcel(orcamentos: OrcamentoRelatorio[], res: Response): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orçamentos");

  sheet.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Cliente", key: "cliente", width: 28 },
    { header: "Empresa", key: "empresa", width: 28 },
    { header: "Quantidade (kg)", key: "quantidade", width: 16 },
    { header: "Investimento (R$)", key: "investimento", width: 18 },
    { header: "Status", key: "status", width: 14 },
    { header: "Data", key: "data", width: 14 }
  ];

  orcamentos.forEach((orcamento) => {
    sheet.addRow({
      id: orcamento.id,
      cliente: orcamento.nome,
      empresa: orcamento.empresa,
      quantidade: Number(orcamento.quantidade_total_kg),
      investimento: Number(orcamento.investimento_total),
      status: formatarStatus(orcamento.status),
      data: new Date(orcamento.created_at).toLocaleDateString("pt-BR")
    });
  });

  sheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=orcamentos.xlsx");

  await workbook.xlsx.write(res);
  res.end();
}

function gerarPDF(orcamentos: OrcamentoRelatorio[], res: Response): void {
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=orcamentos.pdf");

  doc.pipe(res);

  doc.fontSize(16).text("Relatório de Orçamentos - Realiza AntiChamas", { align: "center" });
  doc.moveDown();

  orcamentos.forEach((orcamento) => {
    const linha = `#${orcamento.id} | ${orcamento.nome} | ${orcamento.empresa} | ${orcamento.quantidade_total_kg}kg | R$ ${Number(orcamento.investimento_total).toFixed(2)} | ${formatarStatus(orcamento.status)} | ${new Date(orcamento.created_at).toLocaleDateString("pt-BR")}`;
    doc.fontSize(10).text(linha);
    doc.moveDown(0.3);
  });

  if (orcamentos.length === 0) {
    doc.fontSize(12).text("Nenhum orçamento encontrado para os filtros selecionados.");
  }

  doc.end();
}

export class RelatorioController {
  static async exportarOrcamentos(req: Request, res: Response) {
    try {
      const formato = (req.query.formato as string) || "xlsx";
      const filtros: FiltrosRelatorio = {
        dataInicio: req.query.dataInicio as string | undefined,
        dataFim: req.query.dataFim as string | undefined,
        status: req.query.status as string | undefined,
        cliente: req.query.cliente as string | undefined
      };

      const orcamentos = await buscarOrcamentosFiltrados(filtros);

      if (formato === "pdf") {
        gerarPDF(orcamentos, res);
        return;
      }

      await gerarExcel(orcamentos, res);
    } catch {
      res.status(500).json({ message: "Erro ao gerar relatório" });
    }
  }
}