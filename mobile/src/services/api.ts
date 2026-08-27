import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

function obterApiUrl(): string {

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

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

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

