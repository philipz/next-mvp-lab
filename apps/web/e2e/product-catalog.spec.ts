import { test, expect } from './fixtures'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

test.describe('Product Catalog', () => {
  test('shows product listing', async ({ page }) => {
    await page.goto(`${baseURL}/books`, { waitUntil: 'load' })

    await expect(page.locator('h1')).toContainText(/Books/i)
    await expect(page.getByTestId('product-card').first()).toBeVisible()
  })
})
