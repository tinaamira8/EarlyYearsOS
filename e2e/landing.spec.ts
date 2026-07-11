import { test, expect } from '@playwright/test';

test('demo user can open the complete app and navigate to NQS Overview', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/EarlyYearsOS/);
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome to EarlyYearsOS' })).toBeVisible();

  await page.getByRole('button', { name: 'Compliance & Safety' }).click();
  await page.getByRole('button', { name: 'NQS Overview' }).click();
  await expect(page.getByRole('heading', { name: 'NQS Overview' })).toBeVisible();
});

test('invoice creation adds a new pending invoice', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Finance' }).click();
  await page.getByRole('button', { name: 'Invoicing System' }).click();

  await page.getByRole('button', { name: 'New Invoice' }).click();
  await page.getByLabel('Family').selectOption({ label: 'Wilson Family' });
  await page.getByLabel('Amount').fill('125');
  await page.getByLabel('Due date').fill('2026-07-01');
  await page.getByRole('button', { name: 'Create invoice' }).click();

  await expect(page.getByRole('row', { name: /Wilson Family \$125/ })).toBeVisible();
});
