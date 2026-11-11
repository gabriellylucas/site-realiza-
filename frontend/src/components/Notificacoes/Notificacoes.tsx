import { useCallback, useEffect, useState } from "react";
import "../../styles/Notificacoes.css";

interface Notificacao {
  id: number;
  tipo: string;
  orcamento_id: number;
  mensagem: string;
  lida: boolean | number;
  created_at: string;
}

interface RespostaNotificacoes {
  notificacoes: Notificacao[];
  naoLidas: number;
}

const INTERVALO_ATUALIZACAO_MS = 30000;

function formatarData(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function Notificacoes() {
  const token = localStorage.getItem("token");

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState<number>(0);
  const [aberto, setAberto] = useState<boolean>(false);
  const [indisponivel, setIndisponivel] = useState<boolean>(false);

  const carregar = useCallback(async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await fetch("/api/notificacoes?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar notificações");
      }

      const data: RespostaNotificacoes = await response.json();
      setNotificacoes(data.notificacoes || []);
      setNaoLidas(data.naoLidas || 0);
      setIndisponivel(false);
    } catch {
      setIndisponivel(true);
    }
  }, [token]);

  useEffect(() => {
    carregar();
    const temporizador = setInterval(carregar, INTERVALO_ATUALIZACAO_MS);
    return () => clearInterval(temporizador);
  }, [carregar]);

  async function marcarComoLida(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/notificacoes/${id}/lida`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      setNotificacoes((atual) =>
        atual.map((n) => (n.id === id ? { ...n, lida: 1 } : n))
      );
      setNaoLidas((atual) => Math.max(atual - 1, 0));
    } catch {
      return;
    }
  }

  // Se o serviço de notificações estiver fora do ar, a página continua funcionando normalmente
  if (!token || indisponivel) return null;

  return (
    <div className="notificacoes">
      <button
        type="button"
        className="notificacoes-botao"
        onClick={() => setAberto((atual) => !atual)}
      >
        🔔 Notificações
        {naoLidas > 0 && <span className="notificacoes-badge">{naoLidas}</span>}
      </button>

      {aberto && (
        <div className="notificacoes-painel">
          {notificacoes.length === 0 ? (
            <p className="notificacoes-vazio">Nenhuma notificação por enquanto.</p>
          ) : (
            <ul className="notificacoes-lista">
              {notificacoes.map((n) => {
                const naoLida = Number(n.lida) === 0;

                return (
                  <li
                    key={n.id}
                    className={`notificacoes-item ${naoLida ? "notificacoes-item-nova" : ""}`}
                  >
                    <div>
                      <p className="notificacoes-mensagem">{n.mensagem}</p>
                      <span className="notificacoes-data">{formatarData(n.created_at)}</span>
                    </div>

                    {naoLida && (
                      <button
                        type="button"
                        className="notificacoes-ok"
                        onClick={() => marcarComoLida(n.id)}
                      >
                        Marcar como lida
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}