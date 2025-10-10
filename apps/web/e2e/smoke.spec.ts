import { test, expect } from '@playwright/test';

test('home link to customers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Go to Customers' }).click();
  await expect(page.locator('text=Run pnpm gen:page')).toBeVisible();
});
