import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { login } from "../services/authService";
import { validarEmail } from "../utils/validacoes";
import CampoTexto from "../components/CampoTexto";
import BotaoGradiente from "../components/BotaoGradiente";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

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

        <CampoTexto
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <CampoTexto
          label="Senha"
          placeholder="••••••••"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <BotaoGradiente texto="Entrar" onPress={handleLogin} carregando={carregando} />
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
  erro: {
    color: "#ff6b6b",
    marginBottom: 12,
    textAlign: "center",
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