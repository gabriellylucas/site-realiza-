import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadFotoPerfil } from "../services/authService";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: string;
  foto_url?: string | null;
}

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    const userJson = await AsyncStorage.getItem("user");
    if (userJson) {
      setUsuario(JSON.parse(userJson));
    }
  }

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para trocar a foto.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (resultado.canceled || !resultado.assets?.[0]) return;

    const uri = resultado.assets[0].uri;
    await enviarFoto(uri);
  }

  async function enviarFoto(uri: string) {
    setEnviando(true);
    try {
      const resultado = await uploadFotoPerfil(uri);

      if (usuario) {
        const usuarioAtualizado = { ...usuario, foto_url: resultado.fotoUrl };
        setUsuario(usuarioAtualizado);
        await AsyncStorage.setItem("user", JSON.stringify(usuarioAtualizado));
      }
    } catch (error: any) {
      Alert.alert("Erro", error?.response?.data?.message || "Não foi possível enviar a foto");
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" color="#ff7a2a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color="#a8adc0" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={escolherFoto} disabled={enviando}>
          {usuario.foto_url ? (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL || ""}${usuario.foto_url}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#a8adc0" />
            </View>
          )}

          <View style={styles.editarIcone}>
            {enviando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.nome}>{usuario.nome}</Text>
      <Text style={styles.email}>{usuario.email}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>CPF</Text>
        <Text style={styles.valor}>{usuario.cpf}</Text>

        <Text style={styles.label}>Tipo de conta</Text>
        <Text style={styles.valor}>{usuario.role === "admin" ? "Administrador" : "Usuário"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1220", padding: 20 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1220" },
  voltar: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 },
  voltarTexto: { color: "#a8adc0", fontSize: 14 },
  avatarContainer: { alignItems: "center", marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#ff7a2a" },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#171c2c",
    borderWidth: 2,
    borderColor: "#2a3040",
    justifyContent: "center",
    alignItems: "center",
  },
  editarIcone: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff7a2a",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0d1220",
  },
  nome: { color: "#fff", fontSize: 20, fontWeight: "bold", textAlign: "center" },
  email: { color: "#a8adc0", fontSize: 13, textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#171c2c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232a3d",
    padding: 16,
  },
  label: { color: "#a8adc0", fontSize: 12, marginTop: 8 },
  valor: { color: "#fff", fontSize: 15, fontWeight: "600" },
});