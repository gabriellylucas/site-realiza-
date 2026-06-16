import { Router } from "express";
import { ContatoController } from "../controllers/ContatoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", ContatoController.create);
router.get("/", authMiddleware, ContatoController.list);
router.put("/:id", authMiddleware, ContatoController.update);
router.delete("/:id", authMiddleware, ContatoController.delete);
router.get("/:id", authMiddleware, ContatoController.getById);

export default router;