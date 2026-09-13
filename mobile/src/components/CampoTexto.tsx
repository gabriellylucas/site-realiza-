import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface CampoTextoProps extends TextInputProps {
  label: string;
}

export default function CampoTexto({ label, ...inputProps }: CampoTextoProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#8a8f99"
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});