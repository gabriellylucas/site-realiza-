import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.get("/dashboard", authMiddleware, isAdmin, AdminController.dashboard);
router.get("/orcamentos", authMiddleware, isAdmin, AdminController.listarOrcamentos);
router.patch("/orcamentos/:id/status", authMiddleware, isAdmin, AdminController.atualizarStatusOrcamento);
router.get("/usuarios", authMiddleware, isAdmin, AdminController.listarUsuarios);
router.delete("/usuarios/:id", authMiddleware, isAdmin, AdminController.deletarUsuario);

export default router;