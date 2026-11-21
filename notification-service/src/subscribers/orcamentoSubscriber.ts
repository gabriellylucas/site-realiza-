import { redis } from "../config/redis";
import { EventoOrcamento, TODOS_OS_CANAIS } from "../events/eventos";
import { processarEvento } from "../handlers/orcamentoHandlers";
import { logger } from "../utils/logger";

export async function iniciarSubscriber(): Promise<void> {
  // Conexão exclusiva para escutar: no Pub/Sub ela não pode executar outros comandos
  const subscriber = redis.duplicate();

  subscriber.on("error", (erro) =>
    logger.error("Erro na conexão do subscriber", { erro: erro.message })
  );

  subscriber.on("message", async (canal, mensagem) => {
    let evento: EventoOrcamento;

    try {
      evento = JSON.parse(mensagem) as EventoOrcamento;
    } catch {
      logger.error("Mensagem inválida recebida (JSON malformado)", { canal });
      return;
    }

    logger.info("Evento recebido", {
      eventoId: evento.id,
      canal,
      orcamentoId: evento.dados?.orcamentoId,
    });

    try {
      await processarEvento(evento);
      logger.info("Evento processado", { eventoId: evento.id, canal });
    } catch (error) {
      logger.error("Falha ao processar evento", {
        eventoId: evento.id,
        canal,
        erro: (error as Error).message,
      });
    }
  });

  await subscriber.subscribe(...TODOS_OS_CANAIS);
  logger.info("Inscrito nos canais de eventos", { canais: TODOS_OS_CANAIS });
}