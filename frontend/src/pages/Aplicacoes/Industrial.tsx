import { Link } from "react-router-dom";
import "../../styles/Section.css";
import { FaFireExtinguisher, FaShieldAlt, FaLeaf, FaBolt } from "react-icons/fa";

const Industrial: React.FC = () => {
  return (
    <section className="industrial">
      
      <div className="industrial-container">
        
        <Link to="/#produto" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>

        <h1>Incêndios Industriais</h1>

        <p className="descricao">
          Incêndios industriais envolvem diferentes tipos de riscos, incluindo materiais sólidos,
          líquidos inflamáveis e equipamentos energizados. São comuns em fábricas, refinarias,
          armazéns e ambientes com processos térmicos e químicos.
        </p>

        <div className="box">
          <h2>Tecnologia no Combate a Incêndios Industriais</h2>
          <p>
            Em ambientes industriais, o combate ao fogo exige soluções rápidas e altamente eficientes,
            capazes de atuar em diferentes classes de incêndio simultaneamente. Nossa tecnologia atua com 
            <strong className="text-laranja"> supressão da combustão </strong> e 
            <strong className="text-azul"> resfriamento intensivo</strong>, reduzindo a propagação das chamas,
            protegendo estruturas, equipamentos e garantindo maior segurança operacional.
          </p>
        </div>

        <h3>Benefícios da Tecnologia</h3>

        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaFireExtinguisher />
            </div>
            <h4>Alta Eficiência</h4>
            <p>Atuação eficaz em diferentes tipos de incêndio no ambiente industrial</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h4>Proteção Operacional</h4>
            <p>Reduz riscos para trabalhadores e evita danos a máquinas e instalações</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaLeaf />
            </div>
            <h4>Baixo Impacto</h4>
            <p>Fórmula segura que minimiza impactos ambientais e estruturais</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaBolt />
            </div>
            <h4>Ação Imediata</h4>
            <p>Resposta rápida que controla o fogo e reduz o tempo de combate</p>
          </div>
        </div>

        <div className="bottom">
          <div className="info laranja">
            <h4>Redução de Prejuízos</h4>
            <p>
              Minimiza <strong>danos a equipamentos e estruturas</strong>, evitando grandes perdas financeiras.
            </p>
          </div>

          <div className="info verde">
            <h4>Continuidade Operacional</h4>
            <p>
              Permite um controle mais rápido do incêndio, ajudando na <strong>retomada das operações</strong>.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Industrial;