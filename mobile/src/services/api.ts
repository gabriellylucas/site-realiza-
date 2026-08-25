import axios from "axios";
import Constants from "expo-constants";

function obterApiUrl(): string {
  // Se houver uma URL fixa definida no .env, ela tem prioridade
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Caso contrário, descobre o IP automaticamente a partir do Expo
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    throw new Error("Não foi possível detectar o IP do servidor Expo");
  }

  const ip = hostUri.split(":")[0];
  return `http://${ip}/api`;
}

const apiUrl = obterApiUrl();
console.log("API URL detectada automaticamente:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
});

export default api;