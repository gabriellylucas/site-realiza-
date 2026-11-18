import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connection } from "./services/database";
import userRoutes from "./routes/userRoutes";
import ProdutoRoutes from "./routes/ProdutoRoutes";
import OrcamentoRoutes from "./routes/OrcamentoRoutes";
import contatoRoutes from "./routes/ContatoRoutes";
import adminRoutes from "./routes/adminRoutes";
import relatorioRoutes from "./routes/relatorioRoutes";
import "./config/redis";
import { logger } from "./utils/logger";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(requestLogger);

app.use("/users", userRoutes);
app.use("/produtos", ProdutoRoutes);
app.use("/orcamentos", OrcamentoRoutes);
app.use("/contatos", contatoRoutes);
app.use("/admin", adminRoutes);
app.use("/relatorios", relatorioRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "API funcionando 🚀" });
});

app.use(notFoundHandler);
app.use(errorHandler);

process.on("unhandledRejection", (motivo) => {
  logger.error("Promessa rejeitada sem tratamento", { erro: String(motivo) });
});

connection.getConnection()
  .then((conexao) => {
    conexao.release();
    logger.info("Banco conectado com sucesso");
  })
  .catch((error: Error) => {
    logger.error("Erro ao conectar no banco", { erro: error.message });
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});