import { test, expect } from '@playwright/test';

test('login sucesso', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'isadorarodrigues@gmail.com');
  await page.fill('input[type="password"]', 'Th5np3bn');
  await page.click('button.btn-login');

  await expect(page).toHaveURL('https://realiza.local/', { timeout: 10000 });
});

test('login falha', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'errado@teste.com');
  await page.fill('input[type="password"]', 'errado');
  await page.click('button.btn-login');

  await expect(page.locator('text=Usuário não encontrado')).toBeVisible({ timeout: 8000 });
});