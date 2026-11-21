import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BotaoGradienteProps {
  texto: string;
  onPress: () => void;
  carregando?: boolean;
  disabled?: boolean;
}

export default function BotaoGradiente({
  texto,
  onPress,
  carregando = false,
  disabled = false,
}: BotaoGradienteProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || carregando} activeOpacity={0.85}>
      <LinearGradient
        colors={["#ff8a1e", "#ff4d1c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.botao}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>{texto}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});