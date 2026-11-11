import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

interface TokenPayload {
  id: number;
  role: "admin" | "usuario";
}

export interface AuthRequest extends Request {
  userId: number;
  userRole: "admin" | "usuario";
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    logger.error("JWT_SECRET não configurado no ambiente");
    return res.status(500).json({ message: "Serviço mal configurado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, segredo) as TokenPayload;
    (req as AuthRequest).userId = decoded.id;
    (req as AuthRequest).userRole = decoded.role;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}