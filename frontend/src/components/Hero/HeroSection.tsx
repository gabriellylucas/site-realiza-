import bannerImg from "../../assets/banner.png";
import { useNavigate } from "react-router-dom"; 
import Botao from "../Botao/Botao";
import React from "react";

const HeroSection: React.FC = () => {
  const navigate = useNavigate(); 

  const handleSolicitarOrcamento = () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      
      navigate("/orcamento");
    } else {
      
      const confirmou = window.confirm(
        "Para solicitar um orçamento, você precisa estar logado.\n\n" +
        "Você será redirecionado para criar sua conta ou fazer login.\n\n" +
        "Clique em OK para continuar."
      );
      
      if (confirmou) {
        navigate("/cadastro");
      }
    }
  };

  return (
    <section id="inicio" className="banner">
      <div className="banner-container">
        <div className="banner-text">
          <h1 className="titulo-banner">
            <span className="linha1">A Revolução Nanotecnológica no</span>
            <span className="linha2"> Combate a Incêndios</span>
          </h1>

          <p className="subtitle">
            Tecnologia limpa, sustentável e até <br />
            <strong>10x mais eficiente que a água.</strong>
          </p>

          <ul className="solutions-list">
            <li>Soluções inovadoras para proteger vidas, patrimônios e meio ambiente.</li>
            <li>Atuação em incêndios florestais, industriais e urbanos.</li>
          </ul>

          <div className="buttons">
            <a href="#produto" className="btn-saiba-mais">
              Saiba mais
            </a>
  
            <Botao
               texto="Solicitar orçamento"
               onClick={handleSolicitarOrcamento}
               className="btn-orcamento"
             />
          </div>
        </div>

        <div className="banner-image">
          <img src={bannerImg} alt="Tecnologia nanotecnológica no combate a incêndios" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;