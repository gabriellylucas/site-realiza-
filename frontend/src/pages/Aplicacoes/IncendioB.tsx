import { Link } from "react-router-dom";
import "../../styles/Section.css";
import { FaFireExtinguisher, FaShieldAlt, FaLeaf, FaBolt } from "react-icons/fa";

const IncendioB: React.FC = () => {
  return (
    <section className="incendiob">
      
      <div className="incendiob-container">
        
        <Link to="/#produto" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>

        <h1>Incêndios de Classe B</h1>

        <p className="descricao">
          Incêndios de Classe B envolvem líquidos inflamáveis como gasolina, álcool,
          óleo, solventes e tintas. São comuns em postos de combustível, indústrias,
          oficinas e locais com armazenamento de produtos químicos.
        </p>

        <div className="box">
          <h2>Tecnologia no Combate a Incêndios de Classe B</h2>
          <p>
            Incêndios de Classe B são caracterizados pela queima de líquidos inflamáveis,
            que podem se espalhar rapidamente e intensificar as chamas. O combate exige
            técnicas específicas para evitar a propagação do fogo.
            Nossa solução atua criando uma 
            <strong className="text-laranja"> barreira sobre o combustível </strong> e 
            <strong className="text-azul"> reduzindo a liberação de vapores inflamáveis</strong>,
            controlando o incêndio de forma eficiente e segura, mesmo em ambientes de alto risco.
          </p>
        </div>

        <h3>Benefícios da Tecnologia</h3>

        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaFireExtinguisher />
            </div>
            <h4>Controle Rápido</h4>
            <p>Atua rapidamente sobre líquidos inflamáveis, reduzindo a propagação do fogo</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h4>Alta Segurança</h4>
            <p>Minimiza riscos de explosões e protege operadores e estruturas</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaLeaf />
            </div>
            <h4>Baixo Impacto</h4>
            <p>Fórmula segura que reduz danos ao ambiente e superfícies</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <FaBolt />
            </div>
            <h4>Ação Eficiente</h4>
            <p>Forma uma camada que interrompe a combustão e impede reignição</p>
          </div>
        </div>

        <div className="bottom">
          <div className="info laranja">
            <h4>Prevenção de Reignição</h4>
            <p>
              Cria uma <strong>camada protetora</strong> que impede que o fogo volte após o controle inicial.
            </p>
          </div>

          <div className="info verde">
            <h4>Aplicação Versátil</h4>
            <p>
              Ideal para <strong>postos, indústrias e áreas com combustíveis</strong>, garantindo eficiência no combate.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IncendioB;