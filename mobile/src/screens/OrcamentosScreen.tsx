import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { listarOrcamentos, Orcamento } from "../services/orcamentoService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Orcamentos">;

function statusInfo(status: string) {
  const s = status?.toUpperCase();
  if (s === "APROVADO") {
    return { label: "Aprovado", bg: "#1e3a2a", cor: "#5fd08a" };
  }
  if (s === "REJEITADO" || s === "RECUSADO") {
    return { label: "Recusado", bg: "#3a1e1e", cor: "#ff6b6b" };
  }
  return { label: "Em análise", bg: "#3a301a", cor: "#e8b455" };
}

export default function OrcamentosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarOrcamentos() {
    try {
      setErro("");
      const resultado = await listarOrcamentos();
      setOrcamentos(resultado.orcamentos);

      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setNomeUsuario(user.nome?.split(" ")[0] || "");
      }
    } catch (error: any) {
      setErro("Erro ao carregar orçamentos");
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarOrcamentos();
    }, [])
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#ff7a2a" />
      </View>
    );
  }

    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.saudacao}>Olá, {nomeUsuario} 👋</Text>
      <Text style={styles.titulo}>Meus orçamentos</Text>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={orcamentos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={carregando}
            onRefresh={carregarOrcamentos}
            tintColor="#ff7a2a"
          />
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum orçamento encontrado</Text>
        }
        renderItem={({ item }) => {
          const status = statusInfo(item.status);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.empresa}>{item.empresa}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeTexto, { color: status.cor }]}>
                    {status.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.info}>{item.cnpj}</Text>

              <View style={styles.linha}>
                <Ionicons name="location-outline" size={13} color="#a8adc0" />
                <Text style={styles.infoLocal}>{item.local || "Não informado"}</Text>
              </View>

              <Text style={styles.info}>
                Quantidade: <Text style={styles.destaque}>{item.quantidade_total_kg} kg</Text>
              </Text>

              <View style={styles.rodapeCard}>
                <View>
                  <Text style={styles.investimentoLabel}>Investimento</Text>
                  <Text style={styles.investimentoValor}>
                    R$ {Number(item.investimento_total).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("CriarOrcamento")}
        activeOpacity={0.85}
        style={styles.botaoFlutuante}
      >
        <LinearGradient
          colors={["#ff8a1e", "#ff4d1c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.botaoGradiente}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Novo orçamento</Text>
                </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1220", padding: 16, paddingTop: 50 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1220" },
  saudacao: { color: "#a8adc0", fontSize: 14, marginBottom: 2 },
  titulo: { color: "#ff7a2a", fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  erro: { color: "#ff6b6b", marginBottom: 12 },
  vazio: { textAlign: "center", marginTop: 40, color: "#a8adc0" },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  empresa: { color: "#fff", fontSize: 15, fontWeight: "bold", flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { fontSize: 11, fontWeight: "600" },
  info: { color: "#a8adc0", fontSize: 12, marginTop: 4 },
  linha: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  infoLocal: { color: "#a8adc0", fontSize: 12 },
  destaque: { color: "#fff", fontWeight: "600" },
  rodapeCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#232a3d",
  },
  investimentoLabel: { color: "#a8adc0", fontSize: 11 },
  investimentoValor: { color: "#5fd08a", fontSize: 16, fontWeight: "bold" },
  botaoFlutuante: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  botaoGradiente: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 14,
    borderRadius: 12,
  },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});