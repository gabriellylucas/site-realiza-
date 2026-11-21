import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface RotaAdminProps {
  children: ReactNode;
}

export default function RotaAdmin({ children }: RotaAdminProps) {
  const { user, carregandoUsuario } = useContext(AuthContext);

  if (carregandoUsuario) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}