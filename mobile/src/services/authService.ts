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
  };
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", { email, senha });

  await AsyncStorage.setItem("token", response.data.token);
  await AsyncStorage.setItem("role", response.data.user.role);
  await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}