import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import "../../styles/Dashboard.css";

interface Cards {
  totalOrcamentos: number;
  pendentes: number;
  aprovados: number;
  recusados: number;
  investimentoTotal: number;
  kgTotal: number;
}

interface OrcamentoPorMes {
  mes: string;
  total: number;
}

interface DistribuicaoStatus {
  status: string;
  total: number;
}

interface UltimoOrcamento {
  id: number;
  nome: string;
  empresa: string;
  quantidade_total_kg: number;
  investimento_total: number;
  status: string;
  created_at: string;
}

interface DashboardData {
  cards: Cards;
  orcamentosPorMes: OrcamentoPorMes[];
  distribuicaoPorStatus: DistribuicaoStatus[];
  ultimosOrcamentos: UltimoOrcamento[];
}

const CORES_STATUS: Record<string, string> = {
  EM_ANALISE: "#f5a623",
  APROVADO: "#2ecc71",
  RECUSADO: "#e74c3c"
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarStatus(status: string): string {
  if (status === "EM_ANALISE") return "Pendente";
  if (status === "APROVADO") return "Aprovado";
  if (status === "RECUSADO") return "Recusado";
  return status;
}

function formatarMes(mes: string): string {
  const [ano, mesNumero] = mes.split("-");
  const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${nomes[Number(mesNumero) - 1]}/${ano.slice(2)}`;
}

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    async function buscarDados() {
      try {
        const response = await api.get("/admin/dashboard");
        setDados(response.data as DashboardData);
      } catch {
        setErro("Erro ao carregar dados do dashboard");
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  if (carregando) {
    return <div className="dashboard-container"><p>Carregando...</p></div>;
  }

  if (erro || !dados) {
    return <div className="dashboard-container"><p className="dashboard-erro">{erro || "Erro ao carregar dados"}</p></div>;
  }

  const graficoMes = dados.orcamentosPorMes.map((item) => ({
    mes: formatarMes(item.mes),
    total: item.total
  }));

  const graficoStatus = dados.distribuicaoPorStatus.map((item) => ({
    name: formatarStatus(item.status),
    value: item.total,
    status: item.status
  }));

  return (
    <div className="dashboard-container">
      <h1>Painel de Controle</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="card-icone">📋</span>
          <span className="card-valor">{dados.cards.totalOrcamentos}</span>
          <span className="card-label">Orçamentos</span>
        </div>

        <div className="dashboard-card">
          <span className="card-icone">⏳</span>
          <span className="card-valor">{dados.cards.pendentes}</span>
          <span className="card-label">Pendentes</span>
        </div>

        <div className="dashboard-card">
          <span className="card-icone">✅</span>
          <span className="card-valor">{dados.cards.aprovados}</span>
          <span className="card-label">Aprovados</span>
        </div>

        <div className="dashboard-card">
          <span className="card-icone">❌</span>
          <span className="card-valor">{dados.cards.recusados}</span>
          <span className="card-label">Recusados</span>
        </div>

        <div className="dashboard-card">
          <span className="card-icone">💰</span>
          <span className="card-valor">{formatarMoeda(dados.cards.investimentoTotal)}</span>
          <span className="card-label">Investimento</span>
        </div>
      </div>

      <div className="dashboard-destaque">
        <span>📦 Total de AntiChamas solicitado</span>
        <strong>{dados.cards.kgTotal.toLocaleString("pt-BR")} kg</strong>
      </div>

      <div className="dashboard-graficos">
        <div className="dashboard-grafico-box">
          <h2>Orçamentos por mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficoMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#f5741f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-grafico-box">
          <h2>Distribuição por status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={graficoStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {graficoStatus.map((entrada) => (
                  <Cell key={entrada.status} fill={CORES_STATUS[entrada.status] || "#999"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-tabela-box">
        <h2>Últimos orçamentos</h2>
        <table className="dashboard-tabela">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Empresa</th>
              <th>Quantidade</th>
              <th>Investimento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dados.ultimosOrcamentos.map((orcamento) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}