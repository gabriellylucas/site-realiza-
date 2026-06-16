import "../styles/Footer.css";
import { Link } from "react-router-dom";
import {
  FaTiktok,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-col">
          <h2 className="logo">Grupo <span>Realiza</span></h2>
          <p>
            Tecnologia limpa, sustentável e até <strong>10x mais eficiente</strong>
            para o tratamento de efluentes industriais.
          </p>
        </div>

        <div className="footer-col">
          <h3>Links Rápidos</h3>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><a href="/#produto">Produto</a></li>
            <li><Link to="/orcamento">Solicitar Orçamento</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contato</h3>
          <div className="footer-item">
            <FaPhoneAlt /> <span>(92) 99383-2425</span>
          </div>
          <div className="footer-item">
            <FaPhoneAlt /> <span>(62) 99395-4869</span>
          </div>
          <div className="footer-item">
            <FaEnvelope /> <span>diretoria@realizaanteschamas.com.br</span>
          </div>
          <div className="footer-item">
            <FaMapMarkerAlt /> <span>Anápolis, GO<br />Brasil</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>Siga-nos</h3>
          <div className="social-icons">
            <a href="https://www.tiktok.com/@grupo.realiza.anti" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>

            <a href="https://instagram.com/oficialgruporealiza" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>

            <a href="https://pt.linkedin.com/posts/cop-internacional_o-grupo-realiza-marcou-presen%C3%A7a-no-cop-activity-7435741118283063296-IFtH" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div> 

      </div>
    </footer>
  );
}