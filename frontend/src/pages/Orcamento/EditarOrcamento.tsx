import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/EditarOrcamento.css";

interface OrcamentoResponse {
  empresa?: string;
  cnpj?: string;
  local?: string;
  message?: string;
}

export default function EditarOrcamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [local, setLocal] = useState<string>("");
  const [erro, setErro] = useState<string>("");
  const [sucesso, setSucesso] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    carregarOrcamento();
  }, []);

  function formatarCnpj(valor: string): string {
    const numeros = valor.replace(/\D/g, "").slice(0, 14);

    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  async function carregarOrcamento(): Promise<void> {
    try {
      setLoading(true);
      setErro("");

      const response = await fetch(`http://localhost:3000/orcamentos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: OrcamentoResponse = await response.json();

      console.log("ID da rota:", id);
      console.log("Token:", token);
      console.log("Resposta da API:", data);
      console.log("Status:", response.status);

      if (!response.ok) {
        setErro(data.message || "Erro ao carregar orçamento");
        return;
      }

      setEmpresa(data.empresa || "");
      setCnpj(formatarCnpj(data.cnpj || ""));
      setLocal(data.local || "");
    } catch (error) {
      setErro("Erro ao carregar orçamento");
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvar(): Promise<void> {
    setErro("");
    setSucesso("");

    if (!empresa || !cnpj || !local) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/orcamentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          empresa,
          cnpj,
          local,
        }),
      });

      const data: OrcamentoResponse = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao atualizar orçamento");
        return;
      }

      setSucesso("Orçamento atualizado com sucesso!");

      setTimeout(() => {
        navigate("/meus-orcamentos");
      }, 1500);
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  if (loading) {
    return (
      <div className="editar-orcamento-page">
        <div className="overlay"></div>
        <div className="carregando-box">
          <h1>Carregando orçamento...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-orcamento-page">
      <div className="overlay"></div>

      <div className="orcamento-container">
        <div className="orcamento-box">
          <h1>Editar Orçamento</h1>
          <p className="subtitle">Atualize os dados do orçamento</p>

          <input
            type="text"
            placeholder="Empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />

          <input
            type="text"
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
            maxLength={18}
          />

          <input
            type="text"
            placeholder="Local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />

          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}

          <button onClick={handleSalvar}>Salvar alterações</button>
        </div>
      </div>
    </div>
  );
}