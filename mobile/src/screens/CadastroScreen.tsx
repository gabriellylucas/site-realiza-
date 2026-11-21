import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { registrar } from "../services/authService";
import { validarEmail, validarCPF, aplicarMascaraCPF } from "../utils/validacoes";
import CampoTexto from "../components/CampoTexto";
import BotaoGradiente from "../components/BotaoGradiente";

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

export default function CadastroScreen() {
  const navigation = useNavigation<CadastroScreenNavigationProp>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validar(): boolean {
    if (!nome.trim() || !email.trim() || !cpf.trim() || !senha) {
      setErro("Preencha todos os campos");
      return false;
    }
    if (!validarEmail(email)) {
      setErro("Email inválido");
      return false;
    }
    if (!validarCPF(cpf)) {
      setErro("CPF inválido");
      return false;
    }
    if (senha.length < 6) {
      setErro("Senha muito curta");
      return false;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return false;
    }
    return true;
  }

  async function handleCadastro() {
    setErro("");
    if (!validar()) return;

    setCarregando(true);
    try {
      await registrar(nome.trim(), email.trim(), senha, cpf.replace(/\D/g, ""));
      navigation.navigate("Login");
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Crie sua conta gratuitamente</Text>

        <View style={styles.card}>
          <CampoTexto
            label="Nome completo"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <CampoTexto
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <CampoTexto
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(v) => setCpf(aplicarMascaraCPF(v))}
            keyboardType="numeric"
            maxLength={14}
          />

          <CampoTexto
            label="Senha"
            placeholder="••••••••"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <CampoTexto
            label="Confirmar senha"
            placeholder="••••••••"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <BotaoGradiente texto="Cadastrar" onPress={handleCadastro} carregando={carregando} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1220",
    padding: 24,
    justifyContent: "center",
  },
  voltar: {
    marginBottom: 16,
  },
  voltarTexto: {
    color: "#a8adc0",
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#a8adc0",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 20,
  },
  erro: {
    color: "#ff6b6b",
    marginBottom: 12,
    textAlign: "center",
  },
});