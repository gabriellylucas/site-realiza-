import { Router } from "express";
import { OrcamentoController } from "../controllers/OrcamentoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, OrcamentoController.create);
router.get("/", authMiddleware, OrcamentoController.list);
router.get("/:id", authMiddleware, OrcamentoController.getById);
router.put("/:id", authMiddleware, OrcamentoController.update);
router.delete("/:id", authMiddleware, OrcamentoController.delete);

export default router;