import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../services/api";

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
  const d = new Date(data);
  const dois = (n: number) => String(n).padStart(2, "0");

  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState<number>(0);
  const [aberto, setAberto] = useState<boolean>(false);
  const [indisponivel, setIndisponivel] = useState<boolean>(false);

  const carregar = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<RespostaNotificacoes>("/notificacoes", {
        params: { limit: 10 },
      });

      setNotificacoes(response.data.notificacoes || []);
      setNaoLidas(response.data.naoLidas || 0);
      setIndisponivel(false);
    } catch (error) {
      console.log("[Notificações] indisponível:", (error as Error).message);
      setIndisponivel(true);
    }
  }, []);

  useEffect(() => {
    carregar();
    const temporizador = setInterval(carregar, INTERVALO_ATUALIZACAO_MS);
    return () => clearInterval(temporizador);
  }, [carregar]);

  async function marcarComoLida(id: number): Promise<void> {
    try {
      await api.patch(`/notificacoes/${id}/lida`);

      setNotificacoes((atual) =>
        atual.map((n) => (n.id === id ? { ...n, lida: 1 } : n))
      );
      setNaoLidas((atual) => Math.max(atual - 1, 0));
    } catch {
      return;
    }
  }

  // Se o serviço de notificações estiver fora do ar, a tela continua funcionando normalmente
  if (indisponivel) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={() => setAberto((atual) => !atual)}>
        <Text style={styles.botaoTexto}>🔔 Notificações</Text>

        {naoLidas > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{naoLidas}</Text>
          </View>
        )}
      </TouchableOpacity>

      {aberto && (
        <View style={styles.painel}>
          {notificacoes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma notificação por enquanto.</Text>
          ) : (
            notificacoes.map((n) => {
              const naoLida = Number(n.lida) === 0;

              return (
                <View key={n.id} style={[styles.item, naoLida && styles.itemNovo]}>
                  <View style={styles.itemTexto}>
                    <Text style={styles.mensagem}>{n.mensagem}</Text>
                    <Text style={styles.data}>{formatarData(n.created_at)}</Text>
                  </View>

                  {naoLida && (
                    <TouchableOpacity style={styles.botaoLida} onPress={() => marcarComoLida(n.id)}>
                      <Text style={styles.botaoLidaTexto}>Marcar como lida</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff6b00",
  },
  botaoTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  badge: {
    minWidth: 22,
    height: 22,
    marginLeft: 8,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b00",
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  painel: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fafafa",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  itemNovo: {
    borderLeftWidth: 3,
    borderLeftColor: "#ff6b00",
    backgroundColor: "#fff4ec",
  },
  itemTexto: {
    flex: 1,
    marginRight: 8,
  },
  mensagem: {
    fontSize: 14,
    color: "#222222",
  },
  data: {
    marginTop: 4,
    fontSize: 12,
    color: "#777777",
  },
  botaoLida: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff6b00",
  },
  botaoLidaTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff6b00",
  },
  vazio: {
    fontSize: 14,
    color: "#777777",
  },
});