import { test, expect } from '@playwright/test';

// Credenciais
const EMAIL = 'isadorarodrigues@gmail.com';
const SENHA = 'Th5np3bn';

async function fazerLogin(page: any) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', SENHA);
  await page.click('button.btn-login');
  await expect(page).toHaveURL('https://realiza.local/', { timeout: 10000 });
}

async function criarContato(page: any, nome: string, email: string, mensagem: string) {
  await page.goto('/contato');
  await page.waitForLoadState('networkidle');
  await page.fill('input[name="nome"]', nome);
  await page.fill('input[name="email"]', email);
  await page.fill('textarea[name="mensagem"]', mensagem);
  await page.click('button[type="submit"]');
  await expect(page.locator('.mensagem-sucesso')).toBeVisible({ timeout: 8000 });
}

// Função para garantir que um contato existe antes do teste
async function garantirContatoExistente(page: any, nomeBase: string) {
  const nomeUnico = `${nomeBase} ${Date.now()}`;
  await criarContato(
    page, 
    nomeUnico, 
    `${nomeBase.toLowerCase().replace(' ', '.')}.${Date.now()}@teste.com`,
    'Mensagem de teste'
  );
  await page.goto('/contatos');
  await page.waitForLoadState('networkidle');
  return nomeUnico;
}

// ─── CADASTRO ────────────────────────────────────────────────────────────────

test('contato - cadastro sucesso', async ({ page }) => {
  await page.goto('/contato');
  await page.waitForLoadState('networkidle');

  const nomeUnico = `Teste E2E ${Date.now()}`;
  await page.fill('input[name="nome"]', nomeUnico);
  await page.fill('input[name="email"]', `teste.${Date.now()}@playwright.com`);
  await page.fill('textarea[name="mensagem"]', 'Mensagem de teste automatizado pelo Playwright.');

  await page.click('button[type="submit"]');

  await expect(page.locator('.mensagem-sucesso')).toBeVisible({ timeout: 8000 });
  
  // Verifica se foi redirecionado
  await expect(page).toHaveURL(/\/contato/, { timeout: 5000 });
});

test('contato - cadastro falha (campos vazios)', async ({ page }) => {
  await page.goto('/contato');
  await page.waitForLoadState('networkidle');

  await page.click('button[type="submit"]');

  // Verifica se permanece na página de contato
  await expect(page).toHaveURL(/\/contato/, { timeout: 5000 });
  
  // Verifica se os campos estão inválidos
  const nomeValido = await page.$eval('input[name="nome"]', (el: HTMLInputElement) => el.validity.valid);
  expect(nomeValido).toBe(false);
});

// ─── LISTAGEM ────────────────────────────────────────────────────────────────

test('contato - listar mensagens (autenticado)', async ({ page }) => {
  await fazerLogin(page);
  await page.goto('/contatos');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('h1.listar-contatos-titulo')).toBeVisible({ timeout: 8000 });

  const temContatos = await page.locator('.card-contato').count();
  const listaVazia = await page.locator('.lista-vazia').count();
  expect(temContatos + listaVazia).toBeGreaterThan(0);
});

test('contato - listar mensagens sem login (erro autenticação)', async ({ page }) => {
  await page.goto('/contatos');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('.erro-contatos')).toBeVisible({ timeout: 8000 });
});

// ─── EDIÇÃO ──────────────────────────────────────────────────────────────────

test('contato - editar sucesso', async ({ page }) => {
  await fazerLogin(page);
  
  // CRIA UM CONTATO ESPECÍFICO PARA ESTE TESTE
  const nomeOriginal = await garantirContatoExistente(page, 'Editar');
  
  // Localiza o contato criado e clica em editar
  const cardContato = page.locator('.card-contato', { hasText: nomeOriginal }).first();
  await expect(cardContato).toBeVisible({ timeout: 8000 });
  
  const btnEditar = cardContato.locator('.btn-editar');
  await expect(btnEditar).toBeVisible();
  await btnEditar.click();

  await expect(page).toHaveURL(/\/editar-contato\/\d+/, { timeout: 8000 });
  await page.waitForLoadState('networkidle');

  // Edita os campos
  const nomeEditado = `Editado ${Date.now()}`;
  await page.fill('input[placeholder="Nome"]', nomeEditado);
  await page.fill('input[placeholder="Email"]', `editado.${Date.now()}@teste.com`);
  await page.fill('textarea[placeholder="Mensagem"]', 'Mensagem editada com sucesso!');
  
  await page.click('.btn-salvar');

  // Verifica se foi redirecionado
  await expect(page).toHaveURL('https://realiza.local/contatos', { timeout: 8000 });
  await page.waitForLoadState('networkidle');
  
  // Verifica se o nome editado aparece na lista
  await expect(page.locator('.card-contato', { hasText: nomeEditado })).toBeVisible({ timeout: 5000 });
});

test('contato - editar falha (campos vazios)', async ({ page }) => {
  await fazerLogin(page);
  
  // CRIA UM CONTATO ESPECÍFICO PARA ESTE TESTE
  const nomeOriginal = await garantirContatoExistente(page, 'EditarFalha');
  
  // Localiza o contato criado
  const cardContato = page.locator('.card-contato', { hasText: nomeOriginal }).first();
  await expect(cardContato).toBeVisible({ timeout: 8000 });
  
  const btnEditar = cardContato.locator('.btn-editar');
  await expect(btnEditar).toBeVisible();
  await btnEditar.click();

  await expect(page).toHaveURL(/\/editar-contato\/\d+/, { timeout: 8000 });
  await page.waitForLoadState('networkidle');

  // Deixa os campos vazios
  await page.fill('input[placeholder="Nome"]', '');
  await page.fill('input[placeholder="Email"]', '');
  await page.fill('textarea[placeholder="Mensagem"]', '');

  await page.click('.btn-salvar');

  // Verifica se a mensagem de erro aparece
  await expect(page.locator('.erro-contatos')).toBeVisible({ timeout: 5000 });
  
  // Verifica se permanece na página de edição
  await expect(page).toHaveURL(/\/editar-contato\/\d+/, { timeout: 5000 });
});

// ─── EXCLUSÃO ────────────────────────────────────────────────────────────────

test('contato - excluir sucesso', async ({ page }) => {
  await fazerLogin(page);

  // CRIA UM CONTATO ESPECÍFICO PARA EXCLUSÃO
  const nomeExcluir = await garantirContatoExistente(page, 'Excluir');
  
  // Conta quantos contatos existem antes
  const totalAntes = await page.locator('.card-contato').count();

  // Localiza o contato criado
  const cardContato = page.locator('.card-contato', { hasText: nomeExcluir }).first();
  await expect(cardContato).toBeVisible({ timeout: 8000 });

  // Configura para aceitar o diálogo de confirmação
  page.on('dialog', dialog => dialog.accept());
  
  const btnExcluir = cardContato.locator('.btn-excluir');
  await expect(btnExcluir).toBeVisible();
  await btnExcluir.click();

  // Aguarda o card ser removido
  await expect(cardContato).not.toBeVisible({ timeout: 5000 });
  
  // Verifica se o total diminuiu
  const totalDepois = await page.locator('.card-contato').count();
  expect(totalDepois).toBe(totalAntes - 1);
});

test('contato - excluir cancelado não remove', async ({ page }) => {
  await fazerLogin(page);
  
  // CRIA UM CONTATO ESPECÍFICO PARA ESTE TESTE
  const nomeCancelar = await garantirContatoExistente(page, 'Cancelar');
  
  // Conta quantos contatos existem antes
  const totalAntes = await page.locator('.card-contato').count();

  // Localiza o contato criado
  const cardContato = page.locator('.card-contato', { hasText: nomeCancelar }).first();
  await expect(cardContato).toBeVisible({ timeout: 8000 });

  // Configura para cancelar o diálogo de confirmação
  page.on('dialog', dialog => dialog.dismiss());
  
  const btnExcluir = cardContato.locator('.btn-excluir');
  await expect(btnExcluir).toBeVisible();
  await btnExcluir.click();

  // Aguarda um pouco
  await page.waitForTimeout(1000);
  
  // Verifica se o contato ainda existe
  await expect(cardContato).toBeVisible({ timeout: 3000 });
  
  // Verifica se o total não mudou
  const totalDepois = await page.locator('.card-contato').count();
  expect(totalDepois).toBe(totalAntes);
});