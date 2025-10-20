import { test, expect } from './fixtures'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

test.describe('Smoke', () => {
  test('books page renders successfully', async ({ page }) => {
    await page.goto(`${baseURL}/books`, { waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toContainText(/Books/i)

    const firstCard = page.locator('.grid > div').first()
    await expect(firstCard).toBeVisible()
  })
})
