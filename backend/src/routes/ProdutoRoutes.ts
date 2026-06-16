import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, ProdutoController.create);
router.get("/", authMiddleware, ProdutoController.list);
router.put("/:id", authMiddleware, ProdutoController.update);
router.delete("/:id", authMiddleware, ProdutoController.delete);

export default router;