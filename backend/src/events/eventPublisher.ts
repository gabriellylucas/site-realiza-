import { randomUUID } from "crypto";
import { redis } from "../config/redis";
import { Canal, DadosOrcamento, EventoOrcamento } from "./eventos";

function log(nivel: "INFO" | "ERROR", mensagem: string, contexto: Record<string, unknown>): void {
  const linha = JSON.stringify({
    timestamp: new Date().toISOString(),
    servico: "backend",
    nivel,
    mensagem,
    ...contexto,
  });

  if (nivel === "ERROR") {
    console.error(linha);
  } else {
    console.log(linha);
  }
}

export async function publicarEvento(canal: Canal, dados: DadosOrcamento): Promise<void> {
  const evento: EventoOrcamento = {
    id: randomUUID(),
    tipo: canal,
    ocorridoEm: new Date().toISOString(),
    dados,
  };

  try {
    const inscritos = await redis.publish(canal, JSON.stringify(evento));
    log("INFO", "Evento publicado", {
      eventoId: evento.id,
      canal,
      orcamentoId: dados.orcamentoId,
      inscritos,
    });
  } catch (error) {
    log("ERROR", "Falha ao publicar evento", {
      eventoId: evento.id,
      canal,
      orcamentoId: dados.orcamentoId,
      erro: (error as Error).message,
    });
  }
}