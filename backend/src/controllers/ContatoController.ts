import { Request, Response } from "express";
import { ContatoModel } from "../models/ContatoModel";

interface Paginacao {
  page: number;
  limit: number;
  offset: number;
}

interface DadosContato {
  nome: string;
  email: string;
  mensagem: string;
}

function validarContato(nome: string, email: string, mensagem: string): void {
  if (!nome || !email || !mensagem) throw new Error("Todos os campos são obrigatórios");
}

function obterId(id: string): number {
  return Number(id);
}

function obterPaginacao(req: Request): Paginacao {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  return { page, limit, offset: (page - 1) * limit };
}

function montarPaginacao(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function buscarContatoOuLancarErro(id: number) {
  const contato = await ContatoModel.findById(id);
  if (!contato) throw new Error("Contato não encontrado");
  return contato;
}

function extrairDadosContato(body: DadosContato): DadosContato {
  return { nome: body.nome, email: body.email, mensagem: body.mensagem };
}

async function criarContato(dados: DadosContato): Promise<void> {
  validarContato(dados.nome, dados.email, dados.mensagem);
  await ContatoModel.create(dados.nome, dados.email, dados.mensagem);
}

async function atualizarContato(id: number, dados: DadosContato): Promise<void> {
  validarContato(dados.nome, dados.email, dados.mensagem);
  await buscarContatoOuLancarErro(id);
  await ContatoModel.update(id, dados.nome, dados.email, dados.mensagem);
}

async function deletarContato(id: number): Promise<void> {
  await buscarContatoOuLancarErro(id);
  await ContatoModel.delete(id);
}

async function listarContatos(req: Request) {
  const { page, limit, offset } = obterPaginacao(req);
  const { contatos, total } = await ContatoModel.findAllWithPagination(limit, offset);
  return { contatos, pagination: montarPaginacao(page, limit, total) };
}

function tratarErro(error: Error, res: Response, mensagemPadrao: string) {
  if (error.message === "Todos os campos são obrigatórios") {
    return res.status(400).json({ message: error.message });
  }
  if (error.message === "Contato não encontrado") {
    return res.status(404).json({ message: error.message });
  }
  return res.status(500).json({ message: mensagemPadrao });
}

export class ContatoController {
  static async create(req: Request, res: Response) {
    try {
      await criarContato(extrairDadosContato(req.body));
      return res.status(201).json({ message: "Mensagem enviada com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao enviar mensagem");
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const resultado = await listarContatos(req);
      return res.status(200).json(resultado);
    } catch (error) {
      console.error("ERRO CONTATOS:", error);
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar mensagens");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = obterId(req.params.id as string);
      await atualizarContato(id, extrairDadosContato(req.body));
      return res.status(200).json({ message: "Mensagem atualizada com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao atualizar mensagem");
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await deletarContato(obterId(req.params.id as string));
      return res.status(200).json({ message: "Mensagem deletada com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao deletar mensagem");
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const contato = await buscarContatoOuLancarErro(obterId(req.params.id as string));
      return res.status(200).json(contato);
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar contato");
    }
  }
}