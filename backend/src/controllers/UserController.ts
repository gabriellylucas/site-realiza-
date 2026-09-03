import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { OrcamentoModel } from "../models/OrcamentoModel";
import fs from "fs";
import path from "path";

interface AuthRequest extends Request {
  userId: number;
}

interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  role: "admin" | "usuario";
  foto_url?: string | null;
}

interface RegisterBody {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
}

interface LoginBody {
  email: string;
  senha: string;
}

interface UpdateUserBody {
  nome: string;
  senha: string;
  cpf: string;
  email?: string;
}

interface Paginacao {
  page: number;
  limit: number;
  offset: number;
}

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto = 0;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.substring(10, 11));
}

function validarEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function validarSenhaForte(senha: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha);
}

function obterId(id: string): number {
  return Number(id);
}

function obterPaginacao(req: Request): Paginacao {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  return { page, limit, offset: (page - 1) * limit };
}

function montarPaginacao(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

function extrairRegistro(body: RegisterBody): RegisterBody {
  return {
    nome: body.nome,
    email: body.email,
    senha: body.senha,
    cpf: body.cpf
  };
}

function extrairLogin(body: LoginBody): LoginBody {
  return {
    email: body.email,
    senha: body.senha
  };
}

function extrairAtualizacao(body: UpdateUserBody): UpdateUserBody {
  return {
    nome: body.nome,
    senha: body.senha,
    cpf: body.cpf,
    email: body.email
  };
}

function validarCamposCadastro(dados: RegisterBody): void {
  if (!dados.nome || !dados.email || !dados.senha || !dados.cpf) {
    throw new Error("Todos os campos são obrigatórios");
  }
}

function validarCamposLogin(dados: LoginBody): void {
  if (!dados.email || !dados.senha) {
    throw new Error("Email e senha são obrigatórios");
  }
}

function validarCamposAtualizacao(dados: UpdateUserBody): void {
  if (!dados.nome || !dados.senha || !dados.cpf) {
    throw new Error("Todos os campos são obrigatórios: nome, senha, CPF");
  }
}

function validarDadosPessoais(email: string, cpf: string): void {
  if (!validarEmail(email)) throw new Error("Email inválido");
  if (!validarCPF(cpf)) throw new Error("CPF inválido");
}

function validarSenhaCadastro(senha: string): void {
  if (!validarSenhaForte(senha)) {
    throw new Error("Senha deve ter letras e números, mínimo 6 caracteres");
  }
}

function validarUsuarioAutenticado(id: number, userId: number): void {
  if (id !== userId) {
    throw new Error("Você só pode alterar seu próprio usuário");
  }
}

function validarEmailImutavel(email: string | undefined, emailAtual: string): void {
  if (email && email !== emailAtual) {
    throw new Error("Não é permitido alterar o email");
  }
}

async function buscarUsuarioOuLancarErro(id: number): Promise<User> {
  const usuario = await UserModel.findById(id) as User[];

  if (!usuario || usuario.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return usuario[0];
}

async function buscarUsuarioPorEmailOuLancarErro(email: string): Promise<User> {
  const usuario = await UserModel.findByEmail(email) as User[];

  if (!usuario || usuario.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  return usuario[0];
}

async function gerarSenhaHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10);
}

function gerarToken(user: User): string {
  return jwt.sign({ id: user.id, role: user.role }, "segredo_super_secreto", { expiresIn: "1h" });
}

function montarRespostaLogin(user: User, token: string) {
  return {
    message: "Login realizado com sucesso",
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      role: user.role
    }
  };
}

async function criarUsuario(dados: RegisterBody): Promise<void> {
  validarCamposCadastro(dados);
  validarDadosPessoais(dados.email, dados.cpf);
  validarSenhaCadastro(dados.senha);

  const senhaHash = await gerarSenhaHash(dados.senha);
  await UserModel.create(dados.nome, dados.email, senhaHash, dados.cpf);
}

async function autenticarUsuario(dados: LoginBody) {
  validarCamposLogin(dados);

  const user = await buscarUsuarioPorEmailOuLancarErro(dados.email);
  const senhaValida = await bcrypt.compare(dados.senha, user.senha);

  if (!senhaValida) throw new Error("Senha inválida");

  return montarRespostaLogin(user, gerarToken(user));
}

async function listarUsuarios(req: Request) {
  const { page, limit, offset } = obterPaginacao(req);
  const { usuarios, total } = await UserModel.findAllWithPagination(limit, offset);
  return { usuarios, pagination: montarPaginacao(page, limit, total) };
}

async function atualizarUsuario(id: number, userId: number, dados: UpdateUserBody): Promise<void> {
  validarUsuarioAutenticado(id, userId);
  const usuarioAtual = await buscarUsuarioOuLancarErro(id);

  validarCamposAtualizacao(dados);
  validarEmailImutavel(dados.email, usuarioAtual.email);
  if (!validarCPF(dados.cpf)) throw new Error("CPF inválido");
  validarSenhaCadastro(dados.senha);

  const senhaHash = await gerarSenhaHash(dados.senha);
  await UserModel.updateWithoutEmail(id, dados.nome, senhaHash, dados.cpf);
}

async function deletarUsuario(id: number, userId: number): Promise<void> {
  validarUsuarioAutenticado(id, userId);
  await buscarUsuarioOuLancarErro(id);

  const temOrcamento = await OrcamentoModel.existePorUserId(userId);
  if (temOrcamento) {
    throw new Error("Você possui orçamento(s) cadastrado(s). Exclua-os antes de excluir sua conta.");
  }

  await UserModel.delete(id);
}

function tratarErro(error: Error, res: Response, mensagemPadrao: string) {
  if (error.message === "Todos os campos são obrigatórios") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Email e senha são obrigatórios") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Todos os campos são obrigatórios: nome, senha, CPF") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Email inválido") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "CPF inválido") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Senha deve ter letras e números, mínimo 6 caracteres") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Usuário não encontrado") {
    return res.status(404).json({ message: error.message });
  }

  if (error.message === "Senha inválida") {
    return res.status(401).json({ message: error.message });
  }

  if (error.message === "Não é permitido alterar o email") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Você só pode alterar seu próprio usuário") {
    return res.status(403).json({
      message: "Você só pode editar ou deletar seu próprio usuário"
    });
  }

  if (error.message === "Você possui orçamento(s) cadastrado(s). Exclua-os antes de excluir sua conta.") {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: mensagemPadrao });
}

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      await criarUsuario(extrairRegistro(req.body as RegisterBody));
      return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao cadastrar usuário");
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const resultado = await autenticarUsuario(extrairLogin(req.body as LoginBody));
      return res.status(200).json(resultado);
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao fazer login");
    }
  }

     static async list(req: Request, res: Response) {
    try {
      const resultado = await listarUsuarios(req);
      return res.status(200).json(resultado);
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar usuÃ¡rios");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = obterId(req.params.id as string);
      const userId = (req as AuthRequest).userId;
      const dados = extrairAtualizacao(req.body as UpdateUserBody);

      await atualizarUsuario(id, userId, dados);

      return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao atualizar usuário");
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const id = obterId(req.params.id as string);
      const userId = (req as AuthRequest).userId;

      await deletarUsuario(id, userId);

      return res.status(200).json({ message: "UsuÃ¡rio deletado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao deletar usuÃ¡rio");
    }
  }

  static async uploadFoto(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).userId;
      const arquivo = req.file;

      if (!arquivo) {
        return res.status(400).json({ message: "Nenhuma imagem enviada" });
      }

      const usuario = await buscarUsuarioOuLancarErro(userId);

      if (usuario.foto_url) {
        const caminhoAntigo = path.join(__dirname, "..", "..", "uploads", path.basename(usuario.foto_url));
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      const fotoUrl = `/uploads/${arquivo.filename}`;
      await UserModel.atualizarFoto(userId, fotoUrl);

      return res.status(200).json({ message: "Foto atualizada com sucesso", fotoUrl });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao atualizar foto");
    }
  }
}
