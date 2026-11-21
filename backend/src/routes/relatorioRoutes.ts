import { Router } from "express";
import { RelatorioController } from "../controllers/RelatorioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.get("/orcamentos", authMiddleware, isAdmin, RelatorioController.exportarOrcamentos);

export default router;