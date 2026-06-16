import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/MeusOrcamentos.css";

interface Orcamento {
  id: number;
  empresa: string;
  cnpj: string;
  local: string;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

interface ApiResponse {
  orcamentos: Orcamento[];
  pagination?: {
    totalPages: number;
  };
  message?: string;
}

interface CabecalhoPaginaProps {
  nomeUsuario?: string;
  onVoltar: () => void;
  onEditarPerfil: () => void;
}

interface CardOrcamentoProps {
  orcamento: Orcamento;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
  formatarData: (data: string) => string;
  formatarValor: (valor: number) => string;
}

interface ListaOrcamentosProps {
  orcamentos: Orcamento[];
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
  formatarData: (data: string) => string;
  formatarValor: (valor: number) => string;
}

interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  voltarPagina: () => void;
  avancarPagina: () => void;
}

function CabecalhoPagina({
  nomeUsuario,
  onVoltar,
  onEditarPerfil,
}: CabecalhoPaginaProps) {
  return (
    <>
      <button onClick={onVoltar} className="btn-voltar-inicio">
        ← Voltar para o início
      </button>

      <h1>Meus Orçamentos</h1>

      {nomeUsuario && <p className="usuario-logado">Olá, {nomeUsuario}</p>}

      <button onClick={onEditarPerfil} className="btn-editar-usuario">
        ⚙️ Editar Perfil
      </button>

      <p className="subtitle">Histórico de orçamentos solicitados</p>
    </>
  );
}

function CardOrcamento({
  orcamento,
  onEditar,
  onExcluir,
  formatarData,
  formatarValor,
}: CardOrcamentoProps) {
  return (
    <div className="orcamento-card">
      <div className="orcamento-header">
        <h3>{orcamento.empresa}</h3>

        <span className={`status ${orcamento.status}`}>
          {orcamento.status === "EM_ANALISE" && "⏳ Em análise"}
          {orcamento.status === "APROVADO" && "✅ Aprovado"}
          {orcamento.status === "RECUSADO" && "❌ Recusado"}
        </span>
      </div>

      <div className="orcamento-info">
        <p><strong>CNPJ:</strong> {orcamento.cnpj}</p>
        <p><strong>Local:</strong> {orcamento.local}</p>
        <p><strong>Data:</strong> {formatarData(orcamento.created_at)}</p>
      </div>

      <div className="orcamento-valores">
        <p>
          <strong>Quantidade:</strong>{" "}
          {Number(orcamento.quantidade_total_kg).toFixed(2)} kg
        </p>

        <p className="valor-total">
          <strong>Valor:</strong>{" "}
          {formatarValor(Number(orcamento.investimento_total))}
        </p>
      </div>

      <div className="orcamento-actions">
        <button
          onClick={() => onEditar(orcamento.id)}
          className="btn-editar"
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => onExcluir(orcamento.id)}
          className="btn-excluir"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
}

function ListaOrcamentos({
  orcamentos,
  onEditar,
  onExcluir,
  formatarData,
  formatarValor,
}: ListaOrcamentosProps) {
  return (
    <div className="orcamentos-list">
      {orcamentos.map((orcamento) => (
        <CardOrcamento
          key={orcamento.id}
          orcamento={orcamento}
          onEditar={onEditar}
          onExcluir={onExcluir}
          formatarData={formatarData}
          formatarValor={formatarValor}
        />
      ))}
    </div>
  );
}

function Paginacao({
  pagina,
  totalPaginas,
  voltarPagina,
  avancarPagina,
}: PaginacaoProps) {
  return (
    <div className="paginacao">
      <button
        onClick={voltarPagina}
        disabled={pagina === 1}
        className="btn-paginacao"
      >
        Anterior
      </button>

      <span className="pagina-atual">
        Página {pagina} de {totalPaginas}
      </span>

      <button
        onClick={avancarPagina}
        disabled={pagina === totalPaginas}
        className="btn-paginacao"
      >
        Próxima
      </button>
    </div>
  );
}

export default function MeusOrcamentos() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);

  const limite = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    carregarOrcamentos();
  }, [pagina]);

  async function carregarOrcamentos(): Promise<void> {
    setLoading(true);
    setErro("");

    try {
      const response = await fetch(
        `http://localhost:3000/orcamentos?page=${pagina}&limit=${limite}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao carregar orçamentos");
        return;
      }

      setOrcamentos(data.orcamentos || []);
      setTotalPaginas(data.pagination?.totalPages || 1);
    } catch (error) {
      setErro("Erro ao carregar seus orçamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function excluirOrcamento(id: number): Promise<void> {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este orçamento?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/orcamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao excluir orçamento");
        return;
      }

      const novaLista = orcamentos.filter(
        (orcamento) => orcamento.id !== id
      );

      setOrcamentos(novaLista);

      if (novaLista.length === 0 && pagina > 1) {
        setPagina((prev) => prev - 1);
      } else {
        carregarOrcamentos();
      }
    } catch (error) {
      setErro("Erro ao excluir orçamento. Tente novamente.");
    }
  }

  function formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function editarOrcamento(id: number): void {
    navigate(`/editar-orcamento/${id}`);
  }

  function voltarParaInicio(): void {
    navigate("/");
  }

  function irParaEditarPerfil(): void {
    navigate("/editar-usuario");
  }

  function irParaNovoOrcamento(): void {
    navigate("/orcamento");
  }

  function voltarPagina(): void {
    setPagina((prev) => prev - 1);
  }

  function avancarPagina(): void {
    setPagina((prev) => prev + 1);
  }

  if (loading) {
    return (
      <div className="meus-orcamentos-container">
        <div className="loading">Carregando seus orçamentos...</div>
      </div>
    );
  }

  return (
    <div className="meus-orcamentos-container">
      <div className="meus-orcamentos-box">
        <CabecalhoPagina
          nomeUsuario={user?.nome}
          onVoltar={voltarParaInicio}
          onEditarPerfil={irParaEditarPerfil}
        />

        {erro && <div className="erro">{erro}</div>}

        {orcamentos.length === 0 ? (
          <div className="sem-orcamentos">
            <p>📋 Você ainda não fez nenhum orçamento.</p>

            <button
              onClick={irParaNovoOrcamento}
              className="btn-novo-orcamento"
            >
              Solicitar Primeiro Orçamento
            </button>
          </div>
        ) : (
          <>
            <ListaOrcamentos
              orcamentos={orcamentos}
              onEditar={editarOrcamento}
              onExcluir={excluirOrcamento}
              formatarData={formatarData}
              formatarValor={formatarValor}
            />

            <Paginacao
              pagina={pagina}
              totalPaginas={totalPaginas}
              voltarPagina={voltarPagina}
              avancarPagina={avancarPagina}
            />
          </>
        )}

        <button onClick={irParaNovoOrcamento} className="btn-novo">
          + Novo Orçamento
        </button>
      </div>
    </div>
  );
}