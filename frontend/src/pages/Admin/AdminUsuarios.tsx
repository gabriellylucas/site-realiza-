import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../../styles/AdminUsuarios.css";

interface UsuarioAdmin {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  role: "admin" | "usuario";
  created_at: string;
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function buscarUsuarios() {
    try {
      const response = await api.get("/admin/usuarios");
      setUsuarios(response.data.usuarios as UsuarioAdmin[]);
    } catch {
      setErro("Erro ao carregar usuários");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function excluirUsuario(id: number, nome: string) {
    const confirmou = window.confirm(`Tem certeza que deseja excluir o usuário "${nome}"? Essa ação não pode ser desfeita.`);
    if (!confirmou) return;

    setExcluindoId(id);
    setErro("");

    try {
      await api.delete(`/admin/usuarios/${id}`);
      setUsuarios((atual) => atual.filter((usuario) => usuario.id !== id));
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Erro ao excluir usuário");
    } finally {
      setExcluindoId(null);
    }
  }

  if (carregando) {
    return <div className="usuarios-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="usuarios-container">
      <h1>Usuários</h1>

      {erro && <p className="usuarios-erro">{erro}</p>}

      <div className="usuarios-tabela-box">
        <table className="usuarios-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.cpf}</td>
                <td>
                  <span className={`role-badge role-${usuario.role}`}>
                    {usuario.role === "admin" ? "Admin" : "Usuário"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-excluir"
                    disabled={excluindoId === usuario.id}
                    onClick={() => excluirUsuario(usuario.id, usuario.nome)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && <p>Nenhum usuário encontrado.</p>}
      </div>
    </div>
  );
}