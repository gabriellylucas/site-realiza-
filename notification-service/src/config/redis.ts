import Redis from "ioredis";
import { logger } from "../utils/logger";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redis.on("connect", () => logger.info("Redis conectado com sucesso"));
redis.on("error", (erro) =>
  logger.error("Erro de conexão com o Redis", { erro: erro.message })
);