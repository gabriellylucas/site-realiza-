import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OrcamentosScreen from "../screens/OrcamentosScreen";
import CadastroScreen from "../screens/CadastroScreen";
import CriarOrcamentoScreen from "../screens/CriarOrcamentoScreen";
import PerfilScreen from "../screens/PerfilScreen";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Orcamentos: undefined;
  CriarOrcamento: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Orcamentos"
          component={OrcamentosScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CriarOrcamento"
          component={CriarOrcamentoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}