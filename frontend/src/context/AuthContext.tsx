import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: "admin" | "usuario";
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  carregandoUsuario: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  carregandoUsuario: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState<boolean>(true);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      const parsedUser: User = JSON.parse(userStorage);
      setUser(parsedUser);
    }
    setCarregandoUsuario(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, carregandoUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}