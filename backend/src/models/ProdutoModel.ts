import { connection } from "../services/database";
import { RowDataPacket } from "mysql2";

interface CountRow extends RowDataPacket {
  total: number;
}

interface ProdutoDB extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export class ProdutoModel {
  static async create(nome: string, descricao: string, preco: number) {
    const sql = `
      INSERT INTO produtos (nome, descricao, preco)
      VALUES (?, ?, ?)
    `;

    await connection.execute(sql, [nome, descricao, preco]);
  }

  static async findAllWithPagination(limit: number, offset: number) {
    const countSql = `SELECT COUNT(*) as total FROM produtos`;
    const [countRows] = await connection.execute<CountRow[]>(countSql);
    const total = countRows[0].total;

    const sql = `SELECT * FROM produtos LIMIT ? OFFSET ?`;
    const [rows] = await connection.execute<ProdutoDB[]>(sql, [limit, offset]);

    return {
      produtos: rows,
      total
    };
  }

  static async findById(id: number) {
    const sql = `SELECT * FROM produtos WHERE id = ?`;
    const [rows] = await connection.execute<ProdutoDB[]>(sql, [id]);
    return rows[0];
  }

  static async update(id: number, nome: string, descricao: string, preco: number) {
    const sql = `
      UPDATE produtos
      SET nome = ?, descricao = ?, preco = ?
      WHERE id = ?
    `;

    await connection.execute(sql, [nome, descricao, preco, id]);
  }

  static async delete(id: number) {
    const sql = `DELETE FROM produtos WHERE id = ?`;
    await connection.execute(sql, [id]);
  }
}