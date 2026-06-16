import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo Realiza" className="logo-img" />
      </div>

      <ul>
        <li>
          <a href="/#inicio">Início</a>
        </li>

        <li>
          <a href="/#produto">Produto</a>
        </li>

        <li>
          <Link to="/sobre">Empresa</Link>
        </li>

        <li>
          <Link to="/contato">Contato</Link>
        </li>

        {token && (
          <li>
            <Link to="/meus-orcamentos">Meus Orçamentos</Link>
          </li>
        )}

        {!token && (
          <li className="login-btn-item">
            <button
              onClick={() => navigate("/login")}
              className="btn-login-nav"
            >
              Login
            </button>
          </li>
        )}

        {token && (
          <li className="logout-icon-item">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              title="Sair"
            >
              <FiLogOut size={24} />
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;