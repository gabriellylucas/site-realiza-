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
import { login } from "../services/authService";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos!");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Digite um email válido");
      return;
    }

    if (senha.length < 6) {
      setErro("Senha muito curta");
      return;
    }

    setCarregando(true);

    try {
      await login(email, senha);
      navigation.reset({
        index: 0,
        routes: [{ name: "Orcamentos" }],
      });
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao conectar com o servidor";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.marca}>Realiza</Text>
      <Text style={styles.marcaSubtitulo}>Sistemas de Combate a Incêndio</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

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

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#8a8f99"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity onPress={handleLogin} disabled={carregando} activeOpacity={0.85}>
          <LinearGradient
            colors={["#ff8a1e", "#ff4d1c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>
          Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0d1220",
  },
  marca: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff7a2a",
    textAlign: "center",
    marginBottom: 2,
  },
  marcaSubtitulo: {
    fontSize: 12,
    color: "#a8adc0",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#a8adc0",
    marginBottom: 20,
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
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#a8adc0",
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
  },
  linkDestaque: {
    color: "#ff7a2a",
    fontWeight: "600",
  },
});