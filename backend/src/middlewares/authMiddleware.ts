import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: "admin" | "usuario";
}

interface AuthRequest extends Request {
  userId: number;
  userRole: "admin" | "usuario";
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "segredo_super_secreto") as TokenPayload;
    (req as AuthRequest).userId = decoded.id;
    (req as AuthRequest).userRole = decoded.role;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}