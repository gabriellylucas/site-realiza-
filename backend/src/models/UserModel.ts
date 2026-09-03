import { connection } from "../services/database";
import { RowDataPacket } from "mysql2";

interface CountRow extends RowDataPacket {
  total: number;
}

interface UserDB extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  role: "admin" | "usuario";
  foto_url?: string | null;
  created_at?: string;
}

export class UserModel {
  static async create(nome: string, email: string, senha: string, cpf: string) {
    const query = `
      INSERT INTO users (nome, email, senha, cpf)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [nome, email, senha, cpf]);
    return result;
  }

  static async findByEmail(email: string) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await connection.execute<UserDB[]>(query, [email]);
    return rows;
  }

  static async findById(id: number) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute<UserDB[]>(query, [id]);
    return rows;
  }

  static async findAllWithPagination(limit: number, offset: number) {
    const countSql = `SELECT COUNT(*) as total FROM users`;
    const [countRows] = await connection.execute<CountRow[]>(countSql);
    const total = countRows[0].total;
    const sql = `
      SELECT id, nome, email, cpf, role, created_at
      FROM users
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;
    const [rows] = await connection.query<UserDB[]>(sql);
    return {
      usuarios: rows,
      total
    };
  }

  static async updateWithoutEmail(id: number, nome: string, senha: string, cpf: string) {
    const query = `
      UPDATE users
      SET nome = ?, senha = ?, cpf = ?
      WHERE id = ?
    `;

    await connection.execute(query, [nome, senha, cpf, id]);
  }

    static async delete(id: number) {
    const query = `DELETE FROM users WHERE id = ?`;
    await connection.execute(query, [id]);
  }

  static async atualizarFoto(id: number, fotoUrl: string) {
    const query = `UPDATE users SET foto_url = ? WHERE id = ?`;
    await connection.execute(query, [fotoUrl, id]);
  }
}