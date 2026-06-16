import { Link } from "react-router-dom";
import "../../styles/Section.css";
import { FaFireExtinguisher, FaShieldAlt, FaLeaf, FaBolt } from "react-icons/fa";

const Urbanos: React.FC = () => {
  return (
    <section className="urbano">
      
      <div className="urbano-container">
        
        <Link to="/#produto" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>

        <h1>Incêndios Urbanos</h1>

        <p className="descricao">
          Ambientes urbanos apresentam risco significativo de incêndio devido à alta densidade populacional,
          edificações próximas, redes elétricas e grande circulação de pessoas.
        </p>

        <div className="box">
          <h2>Nanotecnologia no Combate a Incêndios Urbanos</h2>
          <p>
            No quesito dos cenários urbanos, nossa tecnologia atua de forma rápida e eficiente no controle de incêndios,
            reduzindo riscos em ambientes com grande circulação de pessoas.
            Sua fórmula avançada cria uma barreira protetora, enquanto 
            combater incêndios urbanos com mais eficiência, rapidez e segurança.
            O produto atua através de dupla ação: 
            <strong className="text-laranja"> limita a propagação das chamas </strong> e 
            <strong className="text-azul"> diminui a temperatura do local</strong>, contribuindo para a preservação de vidas e estruturas.
          </p>
        </div>

        <h3>Benefícios da Tecnologia</h3>

        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaFireExtinguisher />
            </div>
            <h4>Resposta Rápida</h4>
            <p>Controle mais ágil do fogo em áreas densamente povoadas</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h4>Proteção de Vidas</h4>
            <p>Maior segurança para moradores e equipes de resgate</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaLeaf />
            </div>
            <h4>Seguro ao Ambiente</h4>
            <p>Não tóxico e sem danos ao meio urbano</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaBolt />
            </div>
            <h4>Alta Eficiência</h4>
            <p>Atuação simultânea no controle e resfriamento</p>
          </div>
        </div>

        <div className="bottom">
          <div className="info laranja">
            <h4>Redução de Danos</h4>
            <p>
              Diminui significativamente os <strong>prejuízos estruturais</strong> e protege edificações próximas.
            </p>
          </div>

          <div className="info verde">
            <h4>Segurança Urbana</h4>
            <p>
              Ideal para áreas urbanas, garantindo <strong>controle eficiente</strong> sem comprometer o ambiente.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Urbanos;