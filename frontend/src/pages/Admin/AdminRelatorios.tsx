import { useState } from "react";
import "../../styles/AdminRelatorios.css";

export default function AdminRelatorios() {
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [cliente, setCliente] = useState<string>("");
  const [baixando, setBaixando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");

  async function baixarRelatorio(formato: "xlsx" | "pdf") {
    setBaixando(true);
    setErro("");

    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("dataInicio", dataInicio);
      if (dataFim) params.append("dataFim", dataFim);
      if (status) params.append("status", status);
      if (cliente) params.append("cliente", cliente);
      params.append("formato", formato);

      const token = localStorage.getItem("token");

      const response = await fetch(`/api/relatorios/orcamentos?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar relatório");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = formato === "pdf" ? "orcamentos.pdf" : "orcamentos.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErro("Erro ao gerar o relatório. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="relatorios-container">
      <h1>Relatórios</h1>
      <p className="relatorios-subtitulo">Exporte os orçamentos filtrados em Excel ou PDF</p>

      <div className="relatorios-filtros-box">
        <div className="relatorios-filtros-grid">
          <div className="relatorios-campo">
            <label>Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="relatorios-campo">
            <label>Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div className="relatorios-campo">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="EM_ANALISE">Pendente</option>
              <option value="APROVADO">Aprovado</option>
              <option value="RECUSADO">Recusado</option>
            </select>
          </div>

          <div className="relatorios-campo">
            <label>Cliente ou empresa</label>
            <input
              type="text"
              placeholder="Buscar por nome"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className="relatorios-erro">{erro}</p>}

        <div className="relatorios-botoes">
          <button
            className="btn-exportar-excel"
            disabled={baixando}
            onClick={() => baixarRelatorio("xlsx")}
          >
            📊 Exportar Excel
          </button>

          <button
            className="btn-exportar-pdf"
            disabled={baixando}
            onClick={() => baixarRelatorio("pdf")}
          >
            📄 Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}