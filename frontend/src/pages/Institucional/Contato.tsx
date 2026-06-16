import "../../styles/Contato.css";
import { Send } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent } from "react";


interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

export default function Contato() {

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: ""
  });

  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/contatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao enviar mensagem");
        return;
      }

      setMostrarMensagem(true);

      setFormData({
        nome: "",
        email: "",
        mensagem: ""
      });

      setTimeout(() => {
        setMostrarMensagem(false);
      }, 5000);

    } catch (error) {
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="contato-page">
      <div className="cabecalho-contato">
        <h1>Entre em Contato</h1>
        <p>Nossa equipe está pronta para atendê-lo</p>
        <div className="linha-decorativa-cyan"></div>
      </div>

      <div className="contato-wrapper">
        <div className="card-equipe">
          <h2>Nossa Equipe</h2>

          <div className="equipe-membro">
            <p className="equipe-nome">Adriana Rocha</p>
            <p className="equipe-cargo">Gerente Comercial</p>
            <div className="equipe-contato">
              <p>📞 +55 (54) 99328-8036</p>
              <p>✉️ gestordecontas@realizaantichamas.com.br</p>
            </div>
          </div>

          <div className="equipe-membro">
            <p className="equipe-nome">Lorrany Koch</p>
            <p className="equipe-cargo">Diretora Executiva</p>
            <div className="equipe-contato">
              <p>📞 +55 (62) 99395-4869</p>
              <p>✉️ diretoria@realizaantichamas.com.br</p>
            </div>
          </div>

          <div className="equipe-membro">
            <p className="equipe-nome">Junior Lima</p>
            <p className="equipe-cargo">
              Consultor Técnico{" "}
              <span style={{ color: "#E11D48", marginLeft: "5px", fontWeight: "bold" }}>
                AMAZONAS
              </span>
            </p>
            <div className="equipe-contato">
              <p>📞 +55 (92) 99383-2425</p>
              <p>✉️ consultoram@realizaantichamas.com.br</p>
            </div>
          </div>
        </div>

        <div className="card-form">
          <h2>Envie sua Mensagem</h2>
          <p className="subtitulo">
            Preencha os campos abaixo e entraremos em contato.
          </p>

          {mostrarMensagem && (
            <div className="mensagem-sucesso">
              <p>✅ Mensagem enviada com sucesso! Entraremos em contato em breve.</p>

              <button
                type="button"
                className="btn-ver-mensagens"
                onClick={() => window.location.href = "/contatos"}
              >
                Ver mensagens
              </button>
            </div>
          )}

          <form className="form-contato" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-grupo">
                <label className="label-field">NOME COMPLETO *</label>
                <input
                  className="input-field"
                  placeholder="Seu nome"
                  required
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label className="label-field">E-MAIL *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grupo">
              <label className="label-field">SUA MENSAGEM *</label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Como podemos ajudar sua empresa?"
                required
                style={{ resize: "none" }}
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-enviar-contato">
              <Send size={18} /> ENVIAR MENSAGEM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}