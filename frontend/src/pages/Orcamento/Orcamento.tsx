import { useState, useEffect } from "react";
import { api } from "../../services/api";
import "../../styles/Orcamento.css";
import fundo from "../../assets/classed.png";
import { useNavigate } from "react-router-dom";


interface FormErrors {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  empresa?: string;
  cnpj?: string;
  local?: string;
  equipamentos?: string;
}

interface UserStorage {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

const VALOR_POR_KG = 3960;

// TipoEquipamento vem do global 
const DOSAGEM_POR_TIPO: Record<TipoEquipamento, number> = {
  ABT: 0.5,
  ACF: 0.5,
  ABTS: 0.5,
  AT: 0.5,
  KIT: 0.3
};

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function aplicarMascaraCPF(valor: string): string {
  let cpf = valor.replace(/\D/g, '');
  cpf = cpf.substring(0, 11);
  
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d+)/, '$1.$2');
  if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}

function aplicarMascaraCNPJ(valor: string): string {
  let cnpj = valor.replace(/\D/g, '');
  cnpj = cnpj.substring(0, 14);
  
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return cnpj.replace(/(\d{2})(\d+)/, '$1.$2');
  if (cnpj.length <= 8) return cnpj.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  if (cnpj.length <= 12) return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
}


// Equipamento é uma interface global 
function calcularTotal(equipamentos: Equipamento[]): { totalKg: number; valor: number } {
  let totalKg = 0;
  
  equipamentos.forEach((item) => {
    if (!item.litragem || item.litragem <= 0) return;
    if (!item.quantidade || item.quantidade <= 0) return;
    
    const dosagem = DOSAGEM_POR_TIPO[item.tipo];
    const kg = (item.litragem * dosagem * item.quantidade) / 1000;
    totalKg += kg;
  });
  
  return {
    totalKg,
    valor: totalKg * VALOR_POR_KG
  };
}

export default function Orcamento() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");       
  const [telefone, setTelefone] = useState("");

  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [local, setLocal] = useState("");
 // Uso do type global Equipamento sem necessidade de import
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);

  useEffect(() => {
    const elementosParaEsconder: HTMLElement[] = [];
    
    const footers = document.querySelectorAll('footer, .footer, [class*="footer"], [class*="rodape"]');
    footers.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.setProperty('display', 'none', 'important');
      elementosParaEsconder.push(htmlEl);
    });
    
    const botoes = document.querySelectorAll('a, button, [class*="btn"]');
    botoes.forEach(el => {
      const htmlEl = el as HTMLElement;
      const texto = htmlEl.innerText?.toLowerCase() || '';
      const href = htmlEl.getAttribute('href')?.toLowerCase() || '';
      
      if ((texto.includes('orçamento') || texto.includes('solicitar') || href.includes('orcamento')) 
          && !htmlEl.closest('.orcamento-container')) {
        htmlEl.style.setProperty('display', 'none', 'important');
        elementosParaEsconder.push(htmlEl);
      }
    });
    
    const flutuantes = document.querySelectorAll('.whatsapp-button, .float-button, .fixed-button, [class*="float"], [class*="fixed"]');
    flutuantes.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.setProperty('display', 'none', 'important');
      elementosParaEsconder.push(htmlEl);
    });
    
    return () => {
      elementosParaEsconder.forEach(el => {
        el.style.display = '';
      });
    };
  }, []);

  function adicionarEquipamento(): void {
    setEquipamentos([
      ...equipamentos,
      { tipo: "ABT", litragem: 0, quantidade: 1 }
    ]);
  }

  function removerEquipamento(index: number): void {
    const novos = equipamentos.filter((_, i) => i !== index);
    setEquipamentos(novos);
  }

  // Equipamento utiliza os campos da interface global 
  function atualizarEquipamento(
  index: number,
  campo: keyof Equipamento,
  valor: string | number
): void {
  const novos = [...equipamentos];

  if (campo === "tipo") {
    novos[index].tipo = valor as TipoEquipamento;
  }

  if (campo === "litragem") {
    novos[index].litragem = Number(valor);
  }

  if (campo === "quantidade") {
    novos[index].quantidade = Number(valor);
  }

  setEquipamentos(novos);
}

  function validarFormulario(): boolean {
    const newErrors: FormErrors = {};

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!validarEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!validarCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!empresa.trim()) {
      newErrors.empresa = "Nome da empresa é obrigatório";
    }
    
    if (!validarCNPJ(cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    
    if (!local.trim()) {
      newErrors.local = "Local é obrigatório";
    }
    
    if (equipamentos.length === 0) {
      newErrors.equipamentos = "Adicione pelo menos um equipamento";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function enviarOrcamento(): Promise<void> {
    if (!validarFormulario()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    try {
      const resultado = calcularTotal(equipamentos);
      
       const userData = localStorage.getItem("user");
       const user: UserStorage | null = userData ? JSON.parse(userData) : null;
      
      await api.post("/orcamentos", {
        usuarioId: user?.id,  
        solicitante: {
          nome: nome.trim(),
          email: email.trim(),
          cpf: cpf.replace(/\D/g, ''),
          telefone: telefone.trim()
        },
        empresa: empresa.trim(),
        cnpj: cnpj.replace(/\D/g, ''),
        local: local.trim(),
        equipamentos,
        quantidadeTotalKg: resultado.totalKg,
        investimentoTotal: resultado.valor
      });
      
      setEnviadoComSucesso(true);
     } catch (error) {
     alert("Erro ao enviar orçamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const resultado = calcularTotal(equipamentos);

  if (enviadoComSucesso) {
    return (
      <div className="pagina" style={{ backgroundImage: `url(${fundo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
        <div className="overlay" />
        <div className="orcamento-container sucesso">
          <div className="sucesso-content">
            <button className="btn-voltar" onClick={() => navigate("/")}>
              ← Voltar para início
            </button>

            <span className="sucesso-emoji">✅</span>
            <h1>Orçamento Enviado com Sucesso!</h1>
            <p>Em breve nossa equipe entrará em contato.</p>
            <button className="btn-novo-orcamento" onClick={() => setEnviadoComSucesso(false)}>
              Fazer Novo Orçamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina" style={{ backgroundImage: `url(${fundo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <div className="overlay" />
      <div className="orcamento-container">
        <button className="btn-voltar" onClick={() => navigate("/")}>
          ← Voltar para início
        </button>

        <h1>Solicitar Orçamento</h1>
        <p className="subtitle">
          Tecnologia limpa, sustentável e até <span>10x mais eficiente</span>
        </p>

        <div className="form-section">
          <h2>Dados do Solicitante</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className={errors.nome ? "input-error" : ""} />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "input-error" : ""} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(aplicarMascaraCPF(e.target.value))} className={errors.cpf ? "input-error" : ""} maxLength={14} />
              {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <input placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Dados da Empresa/Instituição</h2>
          
          <div className="form-group">
            <label>Empresa *</label>
            <input placeholder="Nome da empresa ou instituição" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={errors.empresa ? "input-error" : ""} />
            {errors.empresa && <span className="error-message">{errors.empresa}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CNPJ *</label>
              <input placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(aplicarMascaraCNPJ(e.target.value))} className={errors.cnpj ? "input-error" : ""} maxLength={18} />
              {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
            </div>

            <div className="form-group">
              <label>Local *</label>
              <input placeholder="Cidade / Estado" value={local} onChange={(e) => setLocal(e.target.value)} className={errors.local ? "input-error" : ""} />
              {errors.local && <span className="error-message">{errors.local}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="equipamentos-header">
            <h2>Equipamentos</h2>
            <button className="btn-add" onClick={adicionarEquipamento} type="button">+ Adicionar Equipamento</button>
          </div>
          
          {errors.equipamentos && <span className="error-message error-global">{errors.equipamentos}</span>}

          {equipamentos.length === 0 && (
            <div className="equipamentos-empty">
              <p>Nenhum equipamento adicionado. Clique em "Adicionar Equipamento" para começar.</p>
            </div>
          )}

          {equipamentos.map((item, index) => (
            <div key={index} className="equipamento-card">
              <div className="equipamento-header">
                <span>Equipamento {index + 1}</span>
                <button className="btn-remove" onClick={() => removerEquipamento(index)} type="button">✕</button>
              </div>
              
              <div className="equipamento-row">
                <div className="equipamento-field">
                  <label>Tipo</label>
                  <select value={item.tipo} onChange={(e) => atualizarEquipamento(index, "tipo", e.target.value)}>
                    <option value="ABT">ABT (0,5 g/L)</option>
                    <option value="ACF">ACF (0,5 g/L)</option>
                    <option value="ABTS">ABTS (0,5 g/L)</option>
                    <option value="AT">AT (0,5 g/L)</option>
                    <option value="KIT">KIT / Pickup (0,3 g/L)</option>
                  </select>
                </div>

                <div className="equipamento-field">
                  <label>Litragem (L)</label>
                  <input type="number" placeholder="Ex: 6000" value={item.litragem || ""} onChange={(e) => atualizarEquipamento(index, "litragem", e.target.value)} min="1" step="100" />
                </div>

                <div className="equipamento-field">
                  <label>Quantidade</label>
                  <input type="number" placeholder="Qtd" value={item.quantidade} onChange={(e) => atualizarEquipamento(index, "quantidade", e.target.value)} min="1" />
                </div>
              </div>
              
              {item.litragem > 0 && item.quantidade > 0 && (
                <div className="equipamento-preview">
                  <small>Produto necessário: {((item.litragem * DOSAGEM_POR_TIPO[item.tipo] * item.quantidade) / 1000).toFixed(2)} kg</small>
                </div>
              )}
            </div>
          ))}
        </div>

        {resultado.totalKg > 0 && (
          <div className="resumo">
            <div className="resumo-item">
              <span>Quantidade Total:</span>
              <strong>{resultado.totalKg.toFixed(2)} kg</strong>
            </div>
            <div className="resumo-item resumo-total">
              <span>Investimento Total:</span>
              <strong>{resultado.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
            </div>
          </div>
        )}

        <button className={`btn-enviar ${loading ? "loading" : ""}`} onClick={enviarOrcamento} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Orçamento"}
        </button>
      </div>
    </div>
  );
}