import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { logger } from "../utils/logger";

export interface NovaNotificacao {
  eventoId: string;
  tipo: string;
  destinatarioTipo: "ADMIN" | "CLIENTE";
  destinatarioUserId: number | null;
  orcamentoId: number;
  mensagem: string;
}

export async function criarTabelaNotificacoes(): Promise<void> {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS notificacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      evento_id VARCHAR(36) NOT NULL UNIQUE,
      tipo VARCHAR(50) NOT NULL,
      destinatario_tipo ENUM('ADMIN', 'CLIENTE') NOT NULL,
      destinatario_user_id INT NULL,
      orcamento_id INT NOT NULL,
      mensagem VARCHAR(255) NOT NULL,
      lida TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  logger.info("Tabela notificacoes pronta");
}

export async function salvarNotificacao(notificacao: NovaNotificacao): Promise<boolean> {
  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT IGNORE INTO notificacoes
      (evento_id, tipo, destinatario_tipo, destinatario_user_id, orcamento_id, mensagem)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      notificacao.eventoId,
      notificacao.tipo,
      notificacao.destinatarioTipo,
      notificacao.destinatarioUserId,
      notificacao.orcamentoId,
      notificacao.mensagem,
    ]
  );

  return resultado.affectedRows > 0;
}

export interface EscopoUsuario {
  role: "admin" | "usuario";
  userId: number;
}

interface NotificacaoRow extends RowDataPacket {
  id: number;
  tipo: string;
  orcamento_id: number;
  mensagem: string;
  lida: number;
  created_at: string;
}

interface ContagemRow extends RowDataPacket {
  total: number;
  nao_lidas: number;
}

// Admin vê os avisos do administrador; cliente vê só os avisos dele
function filtroDoEscopo(escopo: EscopoUsuario): { sql: string; params: number[] } {
  if (escopo.role === "admin") {
    return { sql: "destinatario_tipo = 'ADMIN'", params: [] };
  }

  return {
    sql: "destinatario_tipo = 'CLIENTE' AND destinatario_user_id = ?",
    params: [escopo.userId],
  };
}

export async function listarNotificacoes(escopo: EscopoUsuario, limit: number, offset: number) {
  const filtro = filtroDoEscopo(escopo);

  const [notificacoes] = await pool.query<NotificacaoRow[]>(
    `SELECT id, tipo, orcamento_id, mensagem, lida, created_at
     FROM notificacoes
     WHERE ${filtro.sql}
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...filtro.params, limit, offset]
  );

  const [contagem] = await pool.query<ContagemRow[]>(
    `SELECT COUNT(*) AS total, COALESCE(SUM(lida = 0), 0) AS nao_lidas
     FROM notificacoes
     WHERE ${filtro.sql}`,
    filtro.params
  );

  return {
    notificacoes,
    total: Number(contagem[0].total),
    naoLidas: Number(contagem[0].nao_lidas),
  };
}

export async function marcarComoLida(id: number, escopo: EscopoUsuario): Promise<boolean> {
  const filtro = filtroDoEscopo(escopo);

  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE notificacoes SET lida = 1 WHERE id = ? AND ${filtro.sql}`,
    [id, ...filtro.params]
  );

  return resultado.affectedRows > 0;
}