export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

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

  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function aplicarMascaraCPF(valor: string): string {
  let cpf = valor.replace(/\D/g, "");
  cpf = cpf.substring(0, 11);

  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d+)/, "$1.$2");
  if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
}

export function aplicarMascaraCNPJ(valor: string): string {
  let cnpj = valor.replace(/\D/g, "");
  cnpj = cnpj.substring(0, 14);

  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return cnpj.replace(/(\d{2})(\d+)/, "$1.$2");
  if (cnpj.length <= 8) return cnpj.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  if (cnpj.length <= 12) return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
}

export function aplicarMascaraTelefone(valor: string): string {
  let telefone = valor.replace(/\D/g, "");
  telefone = telefone.substring(0, 11);

  if (telefone.length <= 2) return telefone;
  if (telefone.length <= 6) return telefone.replace(/(\d{2})(\d+)/, "($1) $2");
  if (telefone.length <= 10) return telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}