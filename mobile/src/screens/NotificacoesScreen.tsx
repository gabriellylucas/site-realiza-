import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  listarNotificacoes,
  marcarNotificacaoComoLida,
  Notificacao,
} from "../services/notificacaoService";

function formatarData(data: string) {
  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return "Data indisponível";
  }

  return dataObj.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificacoesScreen() {
  const navigation = useNavigation();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async (manual = false) => {
    try {
      if (manual) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      const resposta = await listarNotificacoes(1, 50);
      setNotificacoes(resposta.notificacoes || []);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function marcarComoLida(id: number) {
    try {
      await marcarNotificacaoComoLida(id);

      setNotificacoes((atuais) =>
        atuais.map((item) =>
          item.id === id ? { ...item, lida: 1 } : item
        )
      );
    } catch {
      Alert.alert("Erro", "Não foi possível marcar a notificação como lida.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.botaoVoltar}
        >
          <Ionicons name="arrow-back" size={23} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Notificações</Text>

        <View style={{ width: 40 }} />
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#ff7a2a" />
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar(true)}
              tintColor="#ff7a2a"
            />
          }
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={42}
                color="#a8adc0"
              />
              <Text style={styles.vazio}>
                Nenhuma notificação por enquanto.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const naoLida = Number(item.lida) === 0;

            return (
              <View
                style={[
                  styles.card,
                  naoLida && styles.cardNaoLido,
                ]}
              >
                <View style={styles.linha}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={naoLida ? "#ff7a2a" : "#a8adc0"}
                  />

                  <View style={styles.conteudo}>
                    <Text style={styles.mensagem}>{item.mensagem}</Text>

                    <Text style={styles.data}>
                      {formatarData(item.created_at)}
                    </Text>

                    <Text style={styles.orcamento}>
                      Orçamento #{item.orcamento_id}
                    </Text>
                  </View>

                  {naoLida && (
                    <View style={styles.indicador} />
                  )}
                </View>

                {naoLida && (
                  <TouchableOpacity
                    style={styles.botaoLida}
                    onPress={() => marcarComoLida(item.id)}
                  >
                    <Text style={styles.botaoLidaTexto}>
                      Marcar como lida
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1220",
    padding: 16,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  titulo: {
    color: "#ff7a2a",
    fontSize: 22,
    fontWeight: "bold",
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lista: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 14,
    marginBottom: 12,
  },
  cardNaoLido: {
    borderLeftWidth: 3,
    borderLeftColor: "#ff7a2a",
    backgroundColor: "#1d2232",
  },
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  conteudo: {
    flex: 1,
  },
  mensagem: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  data: {
    color: "#a8adc0",
    fontSize: 12,
    marginTop: 6,
  },
  orcamento: {
    color: "#ff9a5c",
    fontSize: 12,
    marginTop: 5,
  },
  indicador: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#ff7a2a",
    marginTop: 5,
  },
  botaoLida: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff7a2a",
  },
  botaoLidaTexto: {
    color: "#ff9a5c",
    fontSize: 12,
    fontWeight: "600",
  },
  vazioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  vazio: {
    color: "#a8adc0",
    fontSize: 14,
    textAlign: "center",
  },
});
