import React from "react";
import { Link } from "react-router-dom";
import industrial from "../../assets/industrial.png";
import florestal from "../../assets/florestal.png";
import urbanos from "../../assets/urbanos.png";
import classea from "../../assets/classea.png";
import classed from "../../assets/classed.png";
import classeb from "../../assets/classeb.png";

const ProdutoSection: React.FC = () => {
  return (
    <section id="produto" className="antichamas">
      <div className="container">
        <div className="content">
          
          <div className="left">
            <h1>
              Nanotecnologia para Combate e Controle de Incêndios Florestais,
              Industriais e Urbanos
            </h1>

            <h3>
              REALIZA <span>ANTICHAMAS</span>
            </h3>

            <p>
              O Realiza Antichamas é um agente extintor de incêndios.
              Uma Nanotecnologia a base de sais e minerais, orgânicos e inorgânicos, celulose e em pó cristalizado.
              Produto não perigoso, seguro para uso profissional.
              Atóxico para fauna, flora, mananciais e seres humanos.
            </p>

            <p>
              Sua eficácia é comprovada por laudos de universidades federais, órgãos governamentais, 
              empresas privadas, rigorosos testes laboratoriais e validações em campo, 
              apresentando desempenho superior em diferentes cenários de incêndio.
            </p>

            <p className="highlight">
              Promove resfriamento imediato, bloqueio da propagação e prevenção
              de reignições.
            </p>
          </div>

          <div className="right">
            <h2>
              Realiza Antichamas se destaca pela sua eficiência como agente
              extintor:
            </h2>

            <ul>
              <li>Nanotecnologia organomineral</li>
              <li>Livre de metais pesados</li>
              <li>Biodegradável e seguro ao meio ambiente</li>
              <li>Não corrosivo a equipamentos</li>
              <li>Embalagem fracionada conforme o uso</li>
              <li>Aplicação em água doce ou salgada</li>
              <li>Resfriamento imediato</li>
              <li>Reduz emissão de CO₂</li>
              <li>O produto potencializa a ação da água em até 10 vezes, removendo o oxigênio das chamas</li>
            </ul>
          </div>
        </div>

        <div className="gallery">
          
          <div className="card wide">
            <img src={industrial} alt="Incêndios industriais" />
            <div className="card-overlay">
              <h3>Incêndios Industriais</h3>
              <p>Proteção avançada para complexos fabris e logística.</p>
              <Link to="/industrial" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

          <div className="card wide">
            <img src={florestal} alt="Incêndios florestais" />
            <div className="card-overlay">
              <h3>Incêndios Florestais</h3>
              <p>Solução nanotecnológica para ambientes naturais.</p>
              <Link to="/florestal" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

          <div className="card wide">
            <img src={urbanos} alt="Incêndios urbanos" />
            <div className="card-overlay">
              <h3>Incêndios Urbanos</h3>
              <p>Eficiência em áreas densas e estruturas civis.</p>
              <Link to="/urbanos" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

          <div className="card wide">
            <img src={classea} alt="Incêndios de Classe A" />
            <div className="card-overlay">
              <h3>Incêndios de Classe A</h3>
              <p>Papel, madeira, tecidos e materiais sólidos.</p>
              <Link to="/incendioa" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

          <div className="card wide">
            <img src={classeb} alt="Incêndios de Classe B" />
            <div className="card-overlay">
              <h3>Incêndios de Classe B</h3>
              <p>Líquidos inflamáveis e combustíveis.</p>
              <Link to="/incendiob" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

          <div className="card wide">
            <img src={classed} alt="Incêndios de Classe D" />
            <div className="card-overlay">
              <h3>Incêndios de Classe D</h3>
              <p>Metais combustíveis e ligas leves.</p>
              <Link to="/incendiod" className="btn-saiba-mais">
                Saiba Mais
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProdutoSection;