import { test, expect } from '@playwright/test';

// Gera um CPF válido único baseado no timestamp
function gerarCPF(): string {
  const n = Date.now().toString().slice(-9).padStart(9, '0');
  const nums = n.split('').map(Number);

  let soma = nums.reduce((acc, val, i) => acc + val * (10 - i), 0);
  let d1 = (soma * 10) % 11;
  if (d1 === 10 || d1 === 11) d1 = 0;

  soma = [...nums, d1].reduce((acc, val, i) => acc + val * (11 - i), 0);
  let d2 = (soma * 10) % 11;
  if (d2 === 10 || d2 === 11) d2 = 0;

  const cpf = `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${d1}${d2}`;
  return cpf;
}

test('cadastro sucesso', async ({ page }) => {
  const emailUnico = `teste.${Date.now()}@email.com`;
  const cpfUnico = gerarCPF();

  await page.goto('/cadastro');

  await page.fill('input[placeholder="Nome"]', 'Usuário Teste E2E');
  await page.fill('input[placeholder="Email"]', emailUnico);
  await page.fill('input[placeholder="CPF"]', cpfUnico);
  await page.fill('input[placeholder="Senha"]', 'senha123');
  await page.fill('input[placeholder="Confirmar senha"]', 'senha123');

  await page.click('button');

  await expect(page).toHaveURL('https://realiza.local/login', { timeout: 10000 });
});

test('cadastro falha - senhas não coincidem', async ({ page }) => {
  await page.goto('/cadastro');

  await page.fill('input[placeholder="Nome"]', 'Usuário Teste');
  await page.fill('input[placeholder="Email"]', 'teste@teste.com');
  await page.fill('input[placeholder="CPF"]', '615.488.670-55');
  await page.fill('input[placeholder="Senha"]', 'senha123');
  await page.fill('input[placeholder="Confirmar senha"]', 'senhaerrada');

  await page.click('button');

  await expect(page.locator('text=As senhas não coincidem')).toBeVisible({ timeout: 5000 });
});