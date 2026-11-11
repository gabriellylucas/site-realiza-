import { redis } from "../config/redis";
import { logger } from "../utils/logger";

const TTL_PADRAO_SEGUNDOS = 60;

export async function lerCache<T>(chave: string): Promise<T | null> {
  try {
    const valor = await redis.get(chave);

    if (valor) {
      logger.info("Cache HIT", { chave });
      return JSON.parse(valor) as T;
    }

    logger.info("Cache MISS", { chave });
    return null;
  } catch (error) {
    logger.error("Falha ao ler o cache", { chave, erro: (error as Error).message });
    return null;
  }
}

export async function gravarCache(
  chave: string,
  valor: unknown,
  ttlSegundos: number = TTL_PADRAO_SEGUNDOS
): Promise<void> {
  try {
    await redis.set(chave, JSON.stringify(valor), "EX", ttlSegundos);
  } catch (error) {
    logger.error("Falha ao gravar no cache", { chave, erro: (error as Error).message });
  }
}

export async function invalidarCachePorPrefixo(prefixo: string): Promise<void> {
  try {
    const chaves = await redis.keys(`${prefixo}*`);

    if (chaves.length > 0) {
      await redis.del(...chaves);
      logger.info("Cache invalidado", { prefixo, chaves: chaves.length });
    }
  } catch (error) {
    logger.error("Falha ao invalidar o cache", { prefixo, erro: (error as Error).message });
  }
}