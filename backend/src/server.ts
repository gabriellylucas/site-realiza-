import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connection } from "./services/database";
import userRoutes from "./routes/userRoutes";
import ProdutoRoutes from "./routes/ProdutoRoutes";
import OrcamentoRoutes from "./routes/OrcamentoRoutes";
import contatoRoutes from "./routes/ContatoRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/users", userRoutes);
app.use("/produtos", ProdutoRoutes);
app.use("/orcamentos", OrcamentoRoutes);
app.use("/contatos", contatoRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "API funcionando 🚀" });
});

connection.getConnection()
  .then(() => {
    console.log("Banco conectado com sucesso ✅");
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco ❌", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});