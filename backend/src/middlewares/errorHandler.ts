import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ message: "Rota não encontrada" });
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (error as Error & { status?: number }).status;

  // Erros do cliente (por exemplo, JSON malformado no corpo da requisição)
  if (status && status >= 400 && status < 500) {
    logger.warn("Requisição inválida", {
      metodo: req.method,
      rota: req.originalUrl,
      erro: error.message,
    });
    return res.status(status).json({ message: "Requisição inválida" });
  }

  logger.error("Erro não tratado", {
    metodo: req.method,
    rota: req.originalUrl,
    erro: error.message,
  });

  return res.status(500).json({ message: "Erro interno do servidor" });
}