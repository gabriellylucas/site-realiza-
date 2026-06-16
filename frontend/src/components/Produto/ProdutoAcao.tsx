import React from 'react';
import '../../styles/ProdutoAcao.css';
import img from "../../assets/florestaesg.png";
import { FaTint, FaSyncAlt, FaClock, FaTruck, FaExclamationTriangle, FaFireAlt, FaBuilding, FaSkull } from "react-icons/fa";

const ProdutoAcao: React.FC = () => {
  return (
    <>

      <section id="secao-acao-produto">
        <div className="container-interno">
          
          <div className="cabecalho">
            <h2>
              <span className="laranja">AÇÃO</span> <span className="azul">DO PRODUTO</span>
            </h2>
            <p>
              Tecnologia com capacidade excepcional de interromper a cadeia de combustão por contato direto
            </p>
          </div>

          <div className="grid-cards">
            <div className="card-item">
              <div className="icone-bg">❄️</div>
              <h3>Resfriamento</h3>
              <p>Ação imediata na redução da temperatura através da absorção da umidade do ar.</p>
            </div>

            <div className="card-item">
              <div className="icone-bg">🔥</div>
              <h3>Ação por Contato</h3>
              <p>Retirada instantânea do oxigênio, interrompendo a cadeia de combustão.</p>
            </div>

            <div className="card-item">
              <div className="icone-bg">🛡️</div>
              <h3>Bloqueio</h3>
              <p>Forma uma barreira fria que impede a propagação e reignição do fogo.</p>
            </div>
          </div>

        </div>
      </section>

      <section id="secao-preparacao">
        <div className="conteudo-centralizado">
          
          <div className="cabecalho-preparacao">
            <h2>
              <span className="laranja">PREPARAÇÃO</span> <span className="azul">SIMPLES E IMEDIATA</span>
            </h2>
            <p className="destaque-texto">
              Inclusão baixa <strong>0,30 a 1,30 g/L</strong>
            </p>
          </div>

          <div className="grid-passos">
            
            <div className="passo-item">
              <div className="numero-passo">1</div>

              <div className="icone-passo">
                <FaTint />
              </div>

              <h3>ABASTEÇA</h3>
              <p>Encha o reservatório com água</p>
            </div>

            <div className="passo-item">
              <div className="numero-passo">2</div>

              <div className="icone-passo">
                <FaSyncAlt />
              </div>

              <h3>RECIRCULE</h3>
              <p>Ligue o sistema de retorno</p>
            </div>

            <div className="passo-item">
              <div className="numero-passo">3</div>

              <div className="icone-passo">
                <FaClock />
              </div>

              <h3>MISTURE</h3>
              <p>Adicione o produto (5 min de agitação)</p>
            </div>

            <div className="passo-item">
              <div className="numero-passo">4</div>

              <div className="icone-passo">
                <FaTruck />
              </div>

              <h3>AÇÃO</h3>
              <p>Solução homogênea pronta para uso</p>
            </div>

          </div>

         <section className="riscos">
        <div className="container">

    <h2 className="titulo">
      Riscos Ocultos dos Produtos
    </h2>

    <h3 className="subtitulo">
      Convencionais no Combate a Incêndios
    </h3>

    <div className="grid-riscos">

      <div className="card risco-vermelho">
        <div className="icone"><FaExclamationTriangle /></div>
        <div>
          <span className="tag">LGE</span>
          <h4>Impacto Ambiental e à Saúde</h4>
          <p>Risco químico severo para seres humanos e contaminação de fauna, flora e mananciais.</p>
        </div>
      </div>

      <div className="card risco-vermelho">
        <div className="icone"><FaFireAlt /></div>
        <div>
          <span className="tag">LGE</span>
          <h4>Ineficiência Operacional</h4>
          <p>Não cria barreira durável contra reignição e exige alto consumo de água.</p>
        </div>
      </div>

      <div className="card risco-laranja">
        <div className="icone"><FaBuilding /></div>
        <div>
          <span className="tag laranja">Retardantes LTR</span>
          <h4>Danos Estruturais e Materiais</h4>
          <p>Causa perda de resistência em estruturas tratadas e é altamente corrosivo para equipamentos.</p>
        </div>
      </div>

      <div className="card risco-laranja">
        <div className="icone"><FaSkull /></div>
        <div>
          <span className="tag laranja">Retardantes LTR</span>
          <h4>Toxicidade Humana</h4>
          <p>Produto classificado como tóxico à saúde humana durante o manuseio ou exposição.</p>
        </div>
      </div>

    </div>

    <div className="solucao">
      <h3>Realiza Antichamas: A Solução Segura</h3>
      <p>Não corrosivo, não tóxico, biodegradável e 10x mais eficiente</p>
    </div>

  </div>
</section>


<section className="esg">
  <div className="esg-container">

    <div className="esg-header">
      <h2>
        LIDERANÇA EM ESG: SEGURANÇA
      </h2>

      <h3>ALINHADA À SUSTENTABILIDADE</h3>

      <p>
        A primeira tecnologia de combate a incêndios <strong>Carbono Positivo</strong> REALIZA ANTICHAMAS
      </p>
    </div>

    <div className="esg-content">

      <div className="esg-img">
        <img src={img} alt="Floresta" />
      </div>

      <div className="esg-cards">
        <div className="esg-card">
          <div className="icon">🌿</div>
          <div>
            <h4>100%</h4>
            <span>ATÓXICO</span>
            <p>Seguro para o solo, plantas e animais</p>
          </div>
        </div>

        <div className="esg-card">
          <div className="icon">🌲</div>
          <div>
            <h4>43.200</h4>
            <span>TONELADAS</span>
            <p>de CO2 evitadas. A cada 400 hectares preservados</p>
          </div>
        </div>

        <div className="esg-card">
          <div className="icon">⏱️</div>
          <div>
            <h4>72h</h4>
            <span>BIODEGRADÁVEL</span>
            <p>Degradação completa em até 72 horas</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<section id="secao-credibilidade">
  <div className="container-interno">

    <div className="credibilidade">

      <h2 className="titulo">
        Realiza Antichamas:
      </h2>

      <p className="subtitulo">
        Testes e Validações de Credibilidade
      </p>

      <p className="descricao">
        Eficácia comprovada por um amplo espectro de instituições brasileiras:
        órgãos militares, governamentais, centros de pesquisa e empresas privadas.
      </p>

      <div className="grid-top">

        <div className="card-top">
          <div className="icon">🏢</div>
          <p>Órgãos Governamentais</p>
        </div>

        <div className="card-top">
          <div className="icon">🎓</div>
          <p>Rigor Científico e Universitário</p>
        </div>

        <div className="card-top">
          <div className="icon">🛡️</div>
          <p>Testes Militares</p>
        </div>

        <div className="card-top">
          <div className="icon">🏭</div>
          <p>Instituições Privadas</p>
        </div>

      </div>

      <div className="veredito">

        <h3>O Veredito: Segurança Total</h3>

        <div className="veredito-grid">

          <div>
            <span>✓</span>
            <h4>VALIDADO</h4>
            <p>pela Segurança Pública</p>
          </div>

          <div>
            <span>✓</span>
            <h4>CERTIFICADO</h4>
            <p>pela Ciência</p>
          </div>

          <div>
            <span>✓</span>
            <h4>APROVADO</h4>
            <p>pelo Mercado</p>
          </div>

        </div>

        <p className="final">
          Garanta a proteção atestada pelas maiores autoridades do Brasil.
        </p>

      </div>

    </div>

  </div>
</section>

        </div>
      </section>
    </>
  );
};

export default ProdutoAcao;