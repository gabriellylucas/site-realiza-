import { useState, useContext, useEffect } from "react";
import "../../styles/EditarUsuario.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditarUsuario() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setCpf(formatarCPF(user.cpf || ""));
    }
  }, [user]);

  function formatarCPF(valor: string) {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return valor;
  }

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  const handleSalvar = async () => {
    setErro("");
    setSucesso("");

    if (!nome || !cpf || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    if (!validarCPF(cpf)) {
      setErro("CPF inválido");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não autenticado");
        return;
      }

      const response = await fetch(`http://localhost:3000/users/update/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          cpf: cpf.replace(/\D/g, ""),
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao atualizar usuário");
        return;
      }

      setSucesso("Dados atualizados com sucesso!");
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  };

  const handleExcluirConta = async () => {
    setErro("");
    setSucesso("");

    const confirmar = window.confirm(
      "Se sua conta tiver orçamento cadastrado, ela não poderá ser excluída. Deseja continuar?"
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não autenticado");
        return;
      }

      const response = await fetch(`http://localhost:3000/users/delete/${user?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao excluir conta");
        return;
      }

      setSucesso("Conta excluída com sucesso!");
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="editar-usuario-container">
      <div className="editar-usuario-box">

        {/* 🔥 BOTÃO DE VOLTAR */}
        <button
          className="btn-voltar"
          onClick={() => navigate("/meus-orcamentos")}
        >
          ← Voltar para Meus Orçamentos
        </button>

        <h1>Editar Usuário</h1>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled
        />

        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(formatarCPF(e.target.value))}
        />

        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button onClick={handleSalvar}>Salvar alterações</button>

        <button className="btn-excluir" onClick={handleExcluirConta}>
          Excluir conta
        </button>
      </div>
    </div>
  );
}