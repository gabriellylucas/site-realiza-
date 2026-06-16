import { useState, useEffect, useContext } from "react";
import "../../styles/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Botao from "../../components/Botao/Botao";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [erro, setErro] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.sucesso) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  function validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleLogin = async () => {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos!");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Digite um email válido");
      return;
    }

    if (senha.length < 6) {
      setErro("Senha muito curta");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Email ou senha inválidos");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          nome: data.user.nome,
          email: data.user.email,
          cpf: data.user.cpf,
        });
      }

      navigate("/");
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <p className="subtitle">Acesse sua conta</p>

        {location.state?.sucesso && (
          <p className="sucesso">{location.state.sucesso}</p>
        )}

        <label>Email</label>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="erro">{erro}</p>}

        <Botao
          texto="Entrar"
          onClick={handleLogin}
          className="btn-login"
        />

        <p className="link">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>

      <p className="footer">
        Tecnologia limpa, sustentável e até <span>10x mais eficiente</span>
      </p>
    </div>
  );
}