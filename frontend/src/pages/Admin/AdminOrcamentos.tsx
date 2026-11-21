import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../../styles/AdminOrcamentos.css";

interface OrcamentoAdmin {
  id: number;
  nome: string;
  empresa: string;
  cnpj: string;
  local: string | null;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarStatus(status: string): string {
  if (status === "EM_ANALISE") return "Pendente";
  if (status === "APROVADO") return "Aprovado";
  if (status === "RECUSADO") return "Recusado";
  return status;
}

export default function AdminOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoAdmin[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  async function buscarOrcamentos() {
    try {
      const response = await api.get("/admin/orcamentos");
      setOrcamentos(response.data.orcamentos as OrcamentoAdmin[]);
    } catch {
      setErro("Erro ao carregar orçamentos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarOrcamentos();
  }, []);

  async function mudarStatus(id: number, novoStatus: string) {
    setAtualizandoId(id);

    try {
      await api.patch(`/admin/orcamentos/${id}/status`, { status: novoStatus });

      setOrcamentos((atual) =>
        atual.map((orcamento) =>
          orcamento.id === id ? { ...orcamento, status: novoStatus } : orcamento
        )
      );
    } catch {
      setErro("Erro ao atualizar status");
    } finally {
      setAtualizandoId(null);
    }
  }

  if (carregando) {
    return <div className="orcamentos-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="orcamentos-container">
      <h1>Orçamentos</h1>

      {erro && <p className="orcamentos-erro">{erro}</p>}

      <div className="orcamentos-tabela-box">
        <table className="orcamentos-tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Empresa</th>
              <th>Quantidade</th>
              <th>Investimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((orcamento) => (
              <tr key={orcamento.id}>
                <td>{orcamento.nome}</td>
                <td>{orcamento.empresa}</td>
                <td>{orcamento.quantidade_total_kg} kg</td>
                <td>{formatarMoeda(orcamento.investimento_total)}</td>
                <td>
                  <span className={`status-badge status-${orcamento.status.toLowerCase()}`}>
                    {formatarStatus(orcamento.status)}
                  </span>
                </td>
                <td>
                  <div className="orcamentos-acoes">
                    <button
                      className="btn-aprovar"
                      disabled={atualizandoId === orcamento.id || orcamento.status === "APROVADO"}
                      onClick={() => mudarStatus(orcamento.id, "APROVADO")}
                    >
                      Aprovar
                    </button>
                    <button
                      className="btn-recusar"
                      disabled={atualizandoId === orcamento.id || orcamento.status === "RECUSADO"}
                      onClick={() => mudarStatus(orcamento.id, "RECUSADO")}
                    >
                      Recusar
                    </button>
                    <button
                      className="btn-pendente"
                      disabled={atualizandoId === orcamento.id || orcamento.status === "EM_ANALISE"}
                      onClick={() => mudarStatus(orcamento.id, "EM_ANALISE")}
                    >
                      Pendente
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orcamentos.length === 0 && <p>Nenhum orçamento encontrado.</p>}
      </div>
    </div>
  );
}