import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { atualizarOrcamento } from "../services/orcamentoService";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { validarCNPJ, aplicarMascaraCNPJ } from "../utils/validacoes";

type EditarOrcamentoRouteProp = RouteProp<RootStackParamList, "EditarOrcamento">;

export default function EditarOrcamentoScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditarOrcamentoRouteProp>();
  const { id, empresaAtual, cnpjAtual, localAtual } = route.params;

  const [empresa, setEmpresa] = useState(empresaAtual);
  const [cnpj, setCnpj] = useState(cnpjAtual);
  const [local, setLocal] = useState(localAtual || "");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validar(): boolean {
    if (!empresa.trim() || !local.trim()) {
      setErro("Preencha todos os campos obrigatórios");
      return false;
    }
    if (!validarCNPJ(cnpj)) {
      setErro("CNPJ inválido");
      return false;
    }
    return true;
  }

  async function handleSalvar() {
    setErro("");
    if (!validar()) return;

    setCarregando(true);
    try {
      await atualizarOrcamento(id, empresa.trim(), cnpj.replace(/\D/g, ""), local.trim());
      navigation.goBack();
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Erro ao atualizar orçamento");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color="#a8adc0" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Editar orçamento</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Empresa</Text>
        <TextInput style={styles.input} value={empresa} onChangeText={setEmpresa} />

        <Text style={styles.label}>CNPJ</Text>
        <TextInput
          style={styles.input}
          value={cnpj}
          onChangeText={(v) => setCnpj(aplicarMascaraCNPJ(v))}
          keyboardType="numeric"
          maxLength={18}
        />

        <Text style={styles.label}>Local</Text>
        <TextInput style={styles.input} value={local} onChangeText={setLocal} />
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity onPress={handleSalvar} disabled={carregando} activeOpacity={0.85}>
        <LinearGradient
          colors={["#ff8a1e", "#ff4d1c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.botao}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar alterações</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1220", padding: 20 },
  voltar: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 },
  voltarTexto: { color: "#a8adc0", fontSize: 14 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 16,
    marginBottom: 16,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#a8adc0", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#2a3040",
    borderRadius: 8,
    padding: 12,
    color: "#000",
    backgroundColor: "#f1f1f3",
  },
  erro: { color: "#ff6b6b", marginBottom: 12, textAlign: "center" },
  botao: { padding: 14, borderRadius: 8, alignItems: "center" },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});