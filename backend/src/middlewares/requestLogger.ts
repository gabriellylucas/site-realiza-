import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // O healthcheck do Docker chama "/" a cada poucos segundos; não vale poluir o log com ele
  if (req.originalUrl === "/") {
    next();
    return;
  }

  const inicio = Date.now();

  res.on("finish", () => {
    const contexto = {
      metodo: req.method,
      rota: req.originalUrl,
      status: res.statusCode,
      duracaoMs: Date.now() - inicio,
    };

    if (res.statusCode >= 500) {
      logger.error("Requisição finalizada com erro", contexto);
    } else if (res.statusCode >= 400) {
      logger.warn("Requisição recusada", contexto);
    } else {
      logger.info("Requisição concluída", contexto);
    }
  });

  next();
}