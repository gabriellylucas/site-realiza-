import { Request, Response, Router } from "express";
import { AuthRequest, authMiddleware } from "../middlewares/authMiddleware";
import { listarNotificacoes, marcarComoLida } from "../services/notificacaoService";
import { logger } from "../utils/logger";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = req as AuthRequest;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const offset = (page - 1) * limit;

    const { notificacoes, total, naoLidas } = await listarNotificacoes(
      { role: userRole, userId },
      limit,
      offset
    );

    return res.status(200).json({
      notificacoes,
      naoLidas,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("Erro ao listar notificações", { erro: (error as Error).message });
    return res.status(500).json({ message: "Erro ao buscar notificações" });
  }
});

router.patch("/:id/lida", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = req as AuthRequest;
    const id = Number(String(req.params.id));

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const atualizada = await marcarComoLida(id, { role: userRole, userId });

    if (!atualizada) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }

    return res.status(200).json({ message: "Notificação marcada como lida" });
  } catch (error) {
    logger.error("Erro ao marcar notificação como lida", { erro: (error as Error).message });
    return res.status(500).json({ message: "Erro ao marcar notificação como lida" });
  }
});

export default router;