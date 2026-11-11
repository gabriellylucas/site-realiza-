type Nivel = "INFO" | "WARN" | "ERROR";

type Contexto = Record<string, unknown>;

function registrar(nivel: Nivel, mensagem: string, contexto?: Contexto): void {
  const linha = JSON.stringify({
    timestamp: new Date().toISOString(),
    servico: "notification-service",
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

export const logger = {
  info: (mensagem: string, contexto?: Contexto) => registrar("INFO", mensagem, contexto),
  warn: (mensagem: string, contexto?: Contexto) => registrar("WARN", mensagem, contexto),
  error: (mensagem: string, contexto?: Contexto) => registrar("ERROR", mensagem, contexto),
};