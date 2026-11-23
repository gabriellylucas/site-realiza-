import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    role: "admin" | "usuario";
    foto_url?: string | null;
  };
}

interface UploadFotoResponse {
  message: string;
  fotoUrl: string;
}

export async function login(
  email: string,
  senha: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", {
    email,
    senha,
  });

  await AsyncStorage.setItem("token", response.data.token);
  await AsyncStorage.setItem("role", response.data.user.role);
  await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}

export async function registrar(
  nome: string,
  email: string,
  senha: string,
  cpf: string
) {
  const response = await api.post("/users/register", {
    nome,
    email,
    senha,
    cpf,
  });

  return response.data;
}

export async function uploadFotoPerfil(
  uri: string
): Promise<UploadFotoResponse> {
  const formData = new FormData() as FormData & {
  append(
    name: string,
    value: { uri: string; name: string; type: string }
  ): void;
};

const nomeArquivo = uri.split("/").pop() || "foto.jpg";
const extensaoMatch = /\.([a-zA-Z0-9]+)$/.exec(nomeArquivo);
const tipo = extensaoMatch
  ? `image/${extensaoMatch[1]}`
  : "image/jpeg";

formData.append("foto", {
  uri,
  name: nomeArquivo,
  type: tipo,
});

  const response = await api.post<UploadFotoResponse>(
    "/users/foto",
    formData
  );

  return response.data;
}