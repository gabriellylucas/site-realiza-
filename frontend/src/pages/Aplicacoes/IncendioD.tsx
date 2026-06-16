import { Link } from "react-router-dom";
import "../../styles/Section.css";
import { FaFireExtinguisher, FaShieldAlt, FaLeaf, FaBolt } from "react-icons/fa";

const IncendioD: React.FC = () => {
  return (
    <section className="incendiod">
      
      <div className="incendiod-container">
        
        <Link to="/#produto" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>

        <h1>Incêndios de Classe D</h1>

        <p className="descricao">
          Incêndios de Classe D envolvem metais combustíveis como magnésio, titânio,
          sódio, potássio e alumínio em pó. São comuns em indústrias metalúrgicas,
          laboratórios e processos industriais específicos.
        </p>

        <div className="box">
          <h2>Tecnologia no Combate a Incêndios de Classe D</h2>
          <p>
            Incêndios de Classe D apresentam alto risco devido à reação intensa dos metais
            com o calor e, em alguns casos, com a água. O combate exige métodos específicos
            para evitar explosões e reações perigosas.
            Nossa solução atua formando 
            <strong className="text-laranja"> uma camada isolante </strong> e 
            <strong className="text-azul"> interrompendo a reação do metal com o oxigênio</strong>,
            controlando o incêndio com segurança e eficiência.
          </p>
        </div>

        <h3>Benefícios da Tecnologia</h3>

        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaFireExtinguisher />
            </div>
            <h4>Controle Especializado</h4>
            <p>Desenvolvido para atuar com segurança em metais combustíveis</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h4>Alta Segurança</h4>
            <p>Reduz riscos de explosões e reações perigosas</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaLeaf />
            </div>
            <h4>Aplicação Controlada</h4>
            <p>Atuação precisa que evita dispersão de materiais perigosos</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaBolt />
            </div>
            <h4>Isolamento Eficiente</h4>
            <p>Cria barreira que impede contato com oxigênio e interrompe a combustão</p>
          </div>
        </div>

        <div className="bottom">
          <div className="info laranja">
            <h4>Prevenção de Reações</h4>
            <p>
              Evita <strong>reações químicas perigosas</strong> comuns em incêndios com metais.
            </p>
          </div>

          <div className="info verde">
            <h4>Uso Industrial</h4>
            <p>
              Ideal para <strong>metalúrgicas, laboratórios e indústrias</strong> com risco de metais combustíveis.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IncendioD;