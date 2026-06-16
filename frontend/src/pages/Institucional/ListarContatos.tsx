import { useEffect, useState } from "react";
import "../../styles/ListarContatos.css";

interface Contato {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
  created_at: string;
}

interface ApiResponse {
  contatos: Contato[];
  pagination?: {
    totalPages: number;
  };
  message?: string;
}

export default function ListarContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [erro, setErro] = useState<string>("");

  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const limite = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarContatos();
  }, [pagina]);

  async function carregarContatos(): Promise<void> {
    setErro("");

    if (!token) {
      setErro("Usuário não autenticado");
      setContatos([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/contatos?page=${pagina}&limit=${limite}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao buscar mensagens");
        setContatos([]);
        return;
      }

      setContatos(data.contatos || []);
      setTotalPaginas(data.pagination?.totalPages || 1);
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
      setContatos([]);
    }
  }

  async function excluirContato(id: number): Promise<void> {
    const confirmar = window.confirm("Deseja excluir essa mensagem?");
    if (!confirmar) return;

    if (!token) {
      alert("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/contatos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Erro ao excluir mensagem");
        return;
      }

      const novaLista = contatos.filter((contato) => contato.id !== id);
      setContatos(novaLista);

      if (novaLista.length === 0 && pagina > 1) {
        setPagina((prev) => prev - 1);
      } else {
        carregarContatos();
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="listar-contatos-page">
      <div className="listar-contatos-container">
        <h1 className="listar-contatos-titulo">Mensagens de Contato</h1>

        {erro && <p className="erro-contatos">{erro}</p>}

        {contatos.length === 0 ? (
          <p className="lista-vazia">Nenhuma mensagem encontrada.</p>
        ) : (
          <>
            {contatos.map((contato) => (
              <div key={contato.id} className="card-contato">
                <p><strong>Nome:</strong> {contato.nome}</p>
                <p><strong>Email:</strong> {contato.email}</p>
                <p><strong>Mensagem:</strong> {contato.mensagem}</p>

                <div className="card-acoes">
                  <button
                    className="btn-editar"
                    onClick={() =>
                      (window.location.href = `/editar-contato/${contato.id}`)
                    }
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir"
                    onClick={() => excluirContato(contato.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}

            <div className="paginacao">
              <button
                onClick={() => setPagina((prev) => prev - 1)}
                disabled={pagina === 1}
                className="btn-paginacao"
              >
                Anterior
              </button>

              <span className="pagina-atual">
                Página {pagina} de {totalPaginas}
              </span>

              <button
                onClick={() => setPagina((prev) => prev + 1)}
                disabled={pagina === totalPaginas}
                className="btn-paginacao"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}