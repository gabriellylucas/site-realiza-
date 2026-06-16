import { Link } from "react-router-dom";
import "../../styles/Section.css";
import { FaFireExtinguisher, FaShieldAlt, FaLeaf, FaBolt } from "react-icons/fa";

const IncendioA: React.FC = () => {
  return (
    <section className="incendioa">
      
      <div className="incendioa-container">
        
        <Link to="/#produto" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>

        <h1>Incêndios de Classe A</h1>

        <p className="descricao">
          Incêndios de Classe A envolvem materiais sólidos combustíveis como madeira,
          papel, tecido, borracha e plásticos. São os tipos mais comuns em residências,
          comércios e ambientes urbanos.
        </p>

        <div className="box">
          <h2>Tecnologia no Combate a Incêndios de Classe A</h2>
          <p>
            Incêndios de Classe A são caracterizados pela queima de materiais sólidos que deixam resíduos,
            como madeira e papel, e tendem a se propagar facilmente se não forem controlados rapidamente.
            Nossa solução atua de forma eficiente no combate a esse tipo de incêndio,
            promovendo 
            <strong className="text-laranja"> resfriamento intenso </strong> e 
            <strong className="text-azul"> controle da combustão</strong>, reduzindo a propagação das chamas
            e garantindo maior segurança em ambientes residenciais, comerciais e urbanos.
          </p>
        </div>

        <h3>Benefícios da Tecnologia</h3>

        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaFireExtinguisher />
            </div>
            <h4>Extinção Eficiente</h4>
            <p>Combate eficaz em materiais sólidos como madeira, papel e tecidos</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h4>Segurança Elevada</h4>
            <p>Reduz riscos para pessoas e protege ambientes residenciais e comerciais</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaLeaf />
            </div>
            <h4>Baixo Impacto</h4>
            <p>Produto seguro que minimiza danos ao ambiente e às superfícies</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaBolt />
            </div>
            <h4>Resfriamento Rápido</h4>
            <p>Reduz rapidamente a temperatura e evita a continuidade do fogo</p>
          </div>
        </div>

        <div className="bottom">
          <div className="info laranja">
            <h4>Controle da Propagação</h4>
            <p>
              Atua rapidamente para <strong>impedir que o fogo se espalhe</strong> em materiais combustíveis.
            </p>
          </div>

          <div className="info verde">
            <h4>Proteção de Estruturas</h4>
            <p>
              Ideal para <strong>casas, comércios e escritórios</strong>, reduzindo danos estruturais.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IncendioA;