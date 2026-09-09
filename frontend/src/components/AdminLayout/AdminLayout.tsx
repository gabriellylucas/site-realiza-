import { useContext } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiClipboard,
  FiUsers,
  FiFileText
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/AdminLayout.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useContext(AuthContext);

  const iniciais = user?.nome
    ? user.nome.split(" ")[0].charAt(0).toUpperCase()
    : "A";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-icone">🔥</span>
          <div>
            <p className="admin-logo-nome">Realiza</p>
            <p className="admin-logo-sub">AntiChamas</p>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav-item ${isActive ? "ativo" : ""}`}
          >
            <FiGrid /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/orcamentos"
            className={({ isActive }) => `admin-nav-item ${isActive ? "ativo" : ""}`}
          >
            <FiClipboard /> Orçamentos
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) => `admin-nav-item ${isActive ? "ativo" : ""}`}
          >
            <FiUsers /> Usuários
          </NavLink>

          <NavLink
            to="/admin/relatorios"
            className={({ isActive }) => `admin-nav-item ${isActive ? "ativo" : ""}`}
          >
            <FiFileText /> Relatórios
          </NavLink>
        </nav>

        <div className="admin-usuario">
          <span className="admin-usuario-avatar">{iniciais}</span>
          <div>
            <p className="admin-usuario-nome">{user?.nome || "Admin"}</p>
            <p className="admin-usuario-cargo">Gestor</p>
          </div>
        </div>
      </aside>

      <main className="admin-conteudo">{children}</main>
    </div>
  );
}