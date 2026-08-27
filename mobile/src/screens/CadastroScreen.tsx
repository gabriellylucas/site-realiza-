import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { registrar } from "../services/authService";

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.subtitle}>Crie sua conta gratuitamente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="João da Silva"
          placeholderTextColor="#8a8f99"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#8a8f99"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          placeholderTextColor="#8a8f99"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#8a8f99"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#8a8f99"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity onPress={handleCadastro} disabled={carregando} activeOpacity={0.85}>
          <LinearGradient
            colors={["#ff8a1e", "#ff4d1c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: "#a8adc0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2a3040",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#000",
    backgroundColor: "#f1f1f3",
  },
  erro: {
    color: "#ff6b6b",
    marginBottom: 12,
    textAlign: "center",
  },
  botao: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});