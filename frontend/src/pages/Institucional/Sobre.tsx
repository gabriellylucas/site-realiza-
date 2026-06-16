import "../../styles/Sobre.css";
import fazemosImg from "../../assets/incendio.jpg";
import {
  FaLightbulb,
  FaLeaf,
  FaShieldAlt,
} from "react-icons/fa";

export default function Sobre() {
  return (
    <div className="sobre-page">

      {/* HERO */}
      <section className="hero">
        <h1>
          Tecnologia que salva vidas e <br /> protege o planeta
        </h1>

        <p className="subtitulo">
          O Grupo Realiza existe para salvar vidas, proteger patrimônios e preservar o meio ambiente
          por meio de tecnologia inovadora, segura e sustentável.
        </p>

        <div className="cards">
          <div className="card">
            <div className="icon"><FaLightbulb /></div>
            <h3>Inovação Contínua</h3>
            <p>Desenvolvimento constante de novas tecnologias.</p>
          </div>

          <div className="card">
            <div className="icon"><FaLeaf /></div>
            <h3>Responsabilidade Ambiental</h3>
            <p>Compromisso com a sustentabilidade.</p>
          </div>

          <div className="card">
            <div className="icon"><FaShieldAlt /></div>
            <h3>Compromisso com a Vida</h3>
            <p>Proteção de pessoas e patrimônios.</p>
          </div>
        </div>
      </section>

      {/* TRAJETÓRIA */}
      <section className="trajetoria">
        <h2>Nossa Trajetória</h2>
        <p className="subtitulo">
          Uma jornada de inovação, crescimento e compromisso com a excelência tecnológica
        </p>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          <div className="timeline-container">

            <div className="timeline-container">

              <div className="timeline-item">
                <div className="timeline-card">
                  <span className="year-badge">2014</span>
                  <h3>Início como Realiza Fertilizantes</h3>
                  <p>Fundação da empresa com foco em tecnologia agronômica e soluções inovadoras.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-card">
                  <span className="year-badge">2021</span>
                  <h3>Transformação em Grupo Realiza</h3>
                  <p>Expansão para 24 inovações tecnológicas.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-card">
                  <span className="year-badge">2026</span>
                  <h3>Referência em Nanotecnologia</h3>
                  <p>Consolidação como líder em nanotecnologia antichamas.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="o-que-fazemos">

        <h2>O Que Fazemos</h2>
        <p className="subtitulo">
          Desenvolvemos soluções tecnológicas avançadas para salvar vidas
        </p>

        <div className="oqf-grid">

          <div className="oqf-left">
            <img src={fazemosImg} alt="O que fazemos - Realiza" />

            <div className="oqf-card grande">
              <h3>Realiza Antichamas</h3>
              <p>
                Tecnologia capaz de combater incêndios com até 10x mais eficiência que a água.
              </p>
              <p>
                Sustentável, biodegradável e segura para diversos cenários.
              </p>
            </div>
          </div>

          <div className="oqf-right">

            <div className="oqf-card">
              <div className="mini-icon">⚡</div>
              <h4>Alta Eficiência</h4>
              <p>Até 10x mais eficaz</p>
            </div>

            <div className="oqf-card">
              <div className="mini-icon">🌿</div>
              <h4>Sustentável</h4>
              <p>Tecnologia biodegradável</p>
            </div>

            <div className="oqf-card">
              <div className="mini-icon">🛡️</div>
              <h4>Seguro</h4>
              <p>Validado por órgãos</p>
            </div>

            <div className="oqf-card">
              <div className="mini-icon">📦</div>
              <h4>Versátil</h4>
              <p>Uso em vários cenários</p>
            </div>

          </div>

        </div>

        {/* CARD LARANJA REMOVIDO */}

      </section>

      {/* QUEM FAZ */}
      <section className="quem-faz">

        <h2>Quem Faz Acontecer</h2>
        <p className="subtitulo">
          Pessoas dedicadas à inovação e excelência
        </p>

        <div className="qfa-container">

          <div className="qfa-item">
            <div className="qfa-icon">⚙️</div>
            <div className="qfa-card">
              <h3>Equipe Multidisciplinar</h3>
              <p>Profissionais renomados</p>
            </div>
          </div>

          <div className="qfa-line"></div>

          <div className="qfa-item">
            <div className="qfa-icon">🔬</div>
            <div className="qfa-card">
              <h3>Pesquisa e Desenvolvimento</h3>
              <p>Constante inovação</p>
            </div>
          </div>

        </div>

        <div className="qfa-box">
          <p>
            Equipe especializada garantindo soluções confiáveis e eficientes.
          </p>
        </div>

      </section>

      {/* IMPACTO */}
      <section className="impacto-novo">

        <h2>Nosso Impacto</h2>
        <p className="subtitulo">
          Números que demonstram nossa capacidade
        </p>

        <div className="impacto-cards">

          <div className="impacto-card">
            <div className="impacto-icon">📈</div>
            <h3>10x</h3>
            <p>Mais eficiente que a água</p>
          </div>

          <div className="impacto-card">
            <div className="impacto-icon">🏅</div>
            <h3>24</h3>
            <p>Inovações tecnológicas</p>
          </div>

          <div className="impacto-card">
            <div className="impacto-icon">✅</div>
            <h3>100%</h3>
            <p>Carbono positivo</p>
          </div>

          <div className="impacto-card">
            <div className="impacto-icon">🎯</div>
            <h3>3</h3>
            <p>Áreas de atuação</p>
          </div>

        </div>

        <div className="impacto-box">

          <h3>Credibilidade e Validação Científica</h3>

          <div className="impacto-lista">
            <div>✔️ Validado por órgãos</div>
            <div>✔️ Certificado por universidades</div>
            <div>✔️ Aplicações reais</div>
            <div>✔️ Reconhecimento internacional</div>
          </div>

          <p className="impacto-texto">
            Tecnologia aprovada e confiável para diversas aplicações.
          </p>

        </div>

        <div className="impacto-footer">
          <span>🏅 Excelência e Inovação</span>
        </div>

      </section>

    </div>
  );
}