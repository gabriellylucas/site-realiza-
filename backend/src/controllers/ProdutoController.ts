import { Request, Response } from "express";
import { ProdutoModel } from "../models/ProdutoModel";

interface ProdutoBody {
  nome: string;
  descricao: string;
  preco: number;
}

interface Paginacao {
  page: number;
  limit: number;
  offset: number;
}

function validarProduto(nome: string, descricao: string, preco: number): void {
  if (!nome || !descricao || !preco) {
    throw new Error("Todos os campos são obrigatórios");
  }

  if (preco <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }
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

function extrairDadosProduto(body: ProdutoBody): ProdutoBody {
  return {
    nome: body.nome,
    descricao: body.descricao,
    preco: body.preco
  };
}

async function buscarProdutoOuLancarErro(id: number) {
  const produto = await ProdutoModel.findById(id);
  if (!produto) throw new Error("Produto não encontrado");
  return produto;
}

async function criarProduto(dados: ProdutoBody): Promise<void> {
  validarProduto(dados.nome, dados.descricao, dados.preco);
  await ProdutoModel.create(dados.nome, dados.descricao, dados.preco);
}

async function atualizarProduto(id: number, dados: ProdutoBody): Promise<void> {
  validarProduto(dados.nome, dados.descricao, dados.preco);
  await buscarProdutoOuLancarErro(id);
  await ProdutoModel.update(id, dados.nome, dados.descricao, dados.preco);
}

async function deletarProduto(id: number): Promise<void> {
  await buscarProdutoOuLancarErro(id);
  await ProdutoModel.delete(id);
}

async function listarProdutos(req: Request) {
  const { page, limit, offset } = obterPaginacao(req);
  const { produtos, total } = await ProdutoModel.findAllWithPagination(limit, offset);
  return { produtos, pagination: montarPaginacao(page, limit, total) };
}

function tratarErro(error: Error, res: Response, mensagemPadrao: string) {
  if (error.message === "Todos os campos são obrigatórios") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Preço deve ser maior que zero") {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Produto não encontrado") {
    return res.status(404).json({ message: error.message });
  }

  return res.status(500).json({ message: mensagemPadrao });
}

export class ProdutoController {
  static async create(req: Request, res: Response) {
    try {
      await criarProduto(extrairDadosProduto(req.body));
      return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao criar produto");
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const resultado = await listarProdutos(req);
      return res.status(200).json(resultado);
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao buscar produtos");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = obterId(req.params.id as string);
      await atualizarProduto(id, extrairDadosProduto(req.body));
      return res.status(200).json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao atualizar produto");
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await deletarProduto(obterId(req.params.id as string));
      return res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      const erroTratado = error instanceof Error ? error : new Error("Erro inesperado");
      return tratarErro(erroTratado, res, "Erro ao deletar produto");
    }
  }
}