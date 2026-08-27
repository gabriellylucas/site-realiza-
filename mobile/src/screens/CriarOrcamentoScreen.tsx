import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { criarOrcamento, Equipamento } from "../services/orcamentoService";

const TIPOS_EQUIPAMENTO = ["ABT", "ACF", "ABTS", "AT", "KIT"];

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CriarOrcamentoScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [local, setLocal] = useState("");
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function adicionarEquipamento() {
    setEquipamentos([...equipamentos, { tipo: "ABT", litragem: 0, quantidade: 1 }]);
  }

  function removerEquipamento(index: number) {
    setEquipamentos(equipamentos.filter((_, i) => i !== index));
  }

  function atualizarEquipamento(index: number, campo: keyof Equipamento, valor: string) {
    const novos = [...equipamentos];
    if (campo === "tipo") {
      novos[index].tipo = valor;
    } else {
      novos[index][campo] = Number(valor) as never;
    }
    setEquipamentos(novos);
  }

  function validar(): boolean {
    if (!nome.trim() || !empresa.trim() || !local.trim()) {
      setErro("Preencha todos os campos obrigatórios");
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
    if (!validarCNPJ(cnpj)) {
      setErro("CNPJ inválido");
      return false;
    }
    if (equipamentos.length === 0) {
      setErro("Adicione pelo menos um equipamento");
      return false;
    }
    return true;
  }

  async function handleCriar() {
    setErro("");
    if (!validar()) return;

    setCarregando(true);
    try {
      await criarOrcamento({
        solicitante: {
          nome: nome.trim(),
          email: email.trim(),
          cpf: cpf.replace(/\D/g, ""),
          telefone: telefone.trim(),
        },
        empresa: empresa.trim(),
        cnpj: cnpj.replace(/\D/g, ""),
        local: local.trim(),
        equipamentos,
      });
      navigation.goBack();
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Erro ao criar orçamento");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#a8adc0" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Novo orçamento</Text>

        <View style={styles.card}>
          <Text style={styles.secao}>Dados do solicitante</Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#8a8f99" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#8a8f99" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor="#8a8f99" value={cpf} onChangeText={setCpf} keyboardType="numeric" />

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor="#8a8f99" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        </View>

        <View style={styles.card}>
          <Text style={styles.secao}>Dados da empresa</Text>

          <Text style={styles.label}>Empresa</Text>
          <TextInput style={styles.input} placeholder="Nome da empresa" placeholderTextColor="#8a8f99" value={empresa} onChangeText={setEmpresa} />

          <Text style={styles.label}>CNPJ</Text>
          <TextInput style={styles.input} placeholder="00.000.000/0000-00" placeholderTextColor="#8a8f99" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />

          <Text style={styles.label}>Local</Text>
          <TextInput style={styles.input} placeholder="Cidade / Estado" placeholderTextColor="#8a8f99" value={local} onChangeText={setLocal} />
        </View>

        <View style={styles.card}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secao}>Equipamentos</Text>
            <TouchableOpacity onPress={adicionarEquipamento}>
              <Ionicons name="add-circle" size={24} color="#ff7a2a" />
            </TouchableOpacity>
          </View>

          {equipamentos.length === 0 && (
            <Text style={styles.vazio}>Nenhum equipamento adicionado</Text>
          )}

          {equipamentos.map((item, index) => (
            <View key={index} style={styles.equipamentoBox}>
              <View style={styles.equipamentoHeader}>
                <Text style={styles.label}>Equipamento {index + 1}</Text>
                <TouchableOpacity onPress={() => removerEquipamento(index)}>
                  <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Tipo</Text>
              <View style={styles.tiposLinha}>
                {TIPOS_EQUIPAMENTO.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    onPress={() => atualizarEquipamento(index, "tipo", tipo)}
                    style={[
                      styles.tipoChip,
                      item.tipo === tipo && styles.tipoChipAtivo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tipoChipTexto,
                        item.tipo === tipo && styles.tipoChipTextoAtivo,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Litragem</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#8a8f99"
                keyboardType="numeric"
                value={String(item.litragem || "")}
                onChangeText={(v) => atualizarEquipamento(index, "litragem", v)}
              />

              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor="#8a8f99"
                keyboardType="numeric"
                value={String(item.quantidade || "")}
                onChangeText={(v) => atualizarEquipamento(index, "quantidade", v)}
              />
            </View>
          ))}
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity onPress={handleCriar} disabled={carregando} activeOpacity={0.85}>
          <LinearGradient
            colors={["#ff8a1e", "#ff4d1c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Enviar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1220" },
  voltar: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
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
  secao: { color: "#ff7a2a", fontSize: 15, fontWeight: "bold", marginBottom: 10 },
  secaoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  label: { fontSize: 12, fontWeight: "600", color: "#a8adc0", marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#2a3040",
    borderRadius: 8,
    padding: 10,
    color: "#000",
    backgroundColor: "#f1f1f3",
  },
  vazio: { color: "#a8adc0", fontSize: 12, fontStyle: "italic" },
  equipamentoBox: {
    backgroundColor: "#12172400",
    borderTopWidth: 1,
    borderTopColor: "#232a3d",
    marginTop: 12,
    paddingTop: 12,
  },
  equipamentoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tiposLinha: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tipoChip: {
    borderWidth: 1,
    borderColor: "#2a3040",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tipoChipAtivo: { backgroundColor: "#ff7a2a", borderColor: "#ff7a2a" },
  tipoChipTexto: { color: "#a8adc0", fontSize: 12 },
  tipoChipTextoAtivo: { color: "#fff", fontWeight: "600" },
  erro: { color: "#ff6b6b", marginBottom: 12, textAlign: "center" },
  botao: { padding: 14, borderRadius: 8, alignItems: "center" },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});