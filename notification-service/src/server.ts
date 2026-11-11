import "dotenv/config";
import express from "express";
import { logger } from "./utils/logger";
import { redis } from "./config/redis";
import { pool } from "./config/database";
import { criarTabelaNotificacoes } from "./services/notificacaoService";
import { iniciarSubscriber } from "./subscribers/orcamentoSubscriber";
import notificacaoRoutes from "./routes/notificacaoRoutes";

const app = express();
app.use(express.json());
app.use("/notificacoes", notificacaoRoutes);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    servico: "notification-service",
    status: "ok",
    redis: redis.status,
  });
});

async function iniciar(): Promise<void> {
  try {
    const conexao = await pool.getConnection();
    conexao.release();
    logger.info("MySQL conectado com sucesso");
  } catch (error) {
    logger.error("Erro ao conectar no MySQL", { erro: (error as Error).message });
  }

  try {
    await criarTabelaNotificacoes();
    await iniciarSubscriber();
  } catch (error) {
    logger.error("Erro ao iniciar o subscriber", { erro: (error as Error).message });
  }

  const porta = Number(process.env.NOTIFICATION_PORT) || 3001;
  app.listen(porta, () => {
    logger.info(`notification-service rodando na porta ${porta}`);
  });
}

iniciar();