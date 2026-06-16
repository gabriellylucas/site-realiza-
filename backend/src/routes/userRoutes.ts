import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", authMiddleware, UserController.list);

router.get("/perfil", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Você acessou uma rota protegida 🔐" });
});

router.put("/update/:id", authMiddleware, UserController.update);
router.delete("/delete/:id", authMiddleware, UserController.delete);

export default router;