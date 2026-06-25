import { RowDataPacket } from "mysql2";
import { connection } from "../services/database";

interface CountRow extends RowDataPacket {
  total: number;
}

interface Contato extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
  created_at: string;
}

export class ContatoModel {
  static async create(nome: string, email: string, mensagem: string) {
    const query = `
      INSERT INTO contatos (nome, email, mensagem)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.execute(query, [nome, email, mensagem]);
    return result;
  }

  static async findAllWithPagination(limit: number, offset: number) {
  try {
    console.log("ENTROU NO findAllWithPagination");

    const countQuery = `SELECT COUNT(*) as total FROM contatos`;
    const [countRows] = await connection.execute<CountRow[]>(countQuery);

    console.log("COUNT OK", countRows);

    const total = countRows[0].total;

    const query = `
      SELECT * FROM contatos
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await connection.execute<Contato[]>(query, [limit, offset]);

    console.log("SELECT OK", rows);

    return {
      contatos: rows,
      total
    };
  } catch (error) {
    console.error("ERRO MODEL:", error);
    throw error;
  }
}

  static async findById(id: number) {
    const query = `SELECT * FROM contatos WHERE id = ?`;
    const [rows] = await connection.execute<Contato[]>(query, [id]);
    return rows[0];
  }

  static async update(id: number, nome: string, email: string, mensagem: string) {
    const query = `
      UPDATE contatos
      SET nome = ?, email = ?, mensagem = ?
      WHERE id = ?
    `;

    await connection.execute(query, [nome, email, mensagem, id]);
  }

  static async delete(id: number) {
    const query = `DELETE FROM contatos WHERE id = ?`;
    await connection.execute(query, [id]);
  }
}