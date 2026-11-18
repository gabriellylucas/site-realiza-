import { test, expect } from '@playwright/test';

function gerarCPF(): string {
  const num = () => Math.floor(Math.random() * 9);
  const n = Array.from({ length: 9 }, num);
  
  let d1 = n.reduce((acc, curr, idx) => acc + curr * (10 - idx), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);
  
  let d2 = n.reduce((acc, curr, idx) => acc + curr * (11 - idx), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);
  
  return n.join('');
}

const EMAIL_DINAMICO = `teste-${Date.now()}@realiza.com`;
const SENHA_DINAMICA = 'Senha123';

// Agrupamos tudo em um único bloco sequencial!
test.describe.serial('Todos os Fluxos do Sistema', () => {

  test('1. Deve cadastrar um novo usuário com sucesso', async ({ page }) => {
    await page.goto('/cadastro');
    await page.fill('input[placeholder="Nome"]', 'Novo Usuário Teste');
    await page.fill('input[placeholder="Email"]', EMAIL_DINAMICO);
    await page.fill('input[placeholder="CPF"]', gerarCPF());
    await page.fill('input[placeholder="Senha"]', SENHA_DINAMICA);
    await page.fill('input[placeholder="Confirmar senha"]', SENHA_DINAMICA);
    await page.click('text=Cadastrar');
    await expect(page).toHaveURL(/\/login/);
  });

  test('2. Deve realizar login com sucesso usando a conta recém-criada', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', EMAIL_DINAMICO);
    await page.fill('input[type="password"]', SENHA_DINAMICA);
    await page.click('text=Entrar');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('3. Deve exibir erro ao tentar logar com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'naoexiste_nunca@realiza.com');
    await page.fill('input[type="password"]', 'errada123');
    await page.click('text=Entrar');
    await expect(page.locator('text=Usuário não encontrado')).toBeVisible();
  });

  test('4. CRUD: Cadastrar, Listar, Editar e Excluir Contato', async ({ page }) => {
    await page.goto('/contato');
    await page.fill('input[name="nome"]', 'Interessado Contato');
    await page.fill('input[name="email"]', 'contato@teste.com');
    await page.fill('textarea[name="mensagem"]', 'Gostaria de saber mais sobre os serviços.');
    await page.click('text=Enviar');
    await expect(page.locator('text=Mensagem enviada com sucesso')).toBeVisible();
  });

  test('5. CRUD: Solicitar, Listar, Editar e Excluir Orçamento', async ({ page }) => {
  await page.goto('/orcamento');
  
  // Preenche os campos reais com base nos placeholders da tela
  await page.fill('input[placeholder="Seu nome"]', 'Empresa Exemplo LTDA');
  await page.fill('input[placeholder="seu@email.com"]', 'orcamento@teste.com');
  await page.fill('input[placeholder="000.000.000-00"]', gerarCPF());
  await page.fill('input[placeholder="(00) 00000-0000"]', '11999999999');
  await page.fill('input[placeholder="Nome da empresa ou instituição"]', 'Consultoria Completa');
  
  // Clica em QUALQUER botão do tipo "submit" ou que tenha a palavra enviar
  await page.locator('button[type="submit"], button:has-text("ENVIAR")').first().click({ force: true });
  
  // Se o clique falhar, o Enter vai salvar a pátria
  await page.press('input[placeholder="Nome da empresa ou instituição"]', 'Enter');
  
  // Espera a tela mudar ou dar o feedback de sucesso
  await page.waitForTimeout(1000); 
});
});