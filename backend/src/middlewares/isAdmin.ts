import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  userId: number;
  userRole: "admin" | "usuario";
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userRole = (req as AuthRequest).userRole;

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }

  return next();
}