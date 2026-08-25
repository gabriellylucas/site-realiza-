import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OrcamentosScreen from "../screens/OrcamentosScreen";

export type RootStackParamList = {
  Login: undefined;
  Orcamentos: undefined;
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
          name="Orcamentos"
          component={OrcamentosScreen}
          options={{ title: "Meus Orçamentos" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}