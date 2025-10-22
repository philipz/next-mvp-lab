import { expect, test } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

test.describe('Product Catalog', () => {
  test('shows product list, pagination, and product details', async ({ page }) => {
    await page.goto(`${baseURL}/books`)

    // Wait for product grid
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible()

    const productCards = page.locator('[role="region"] .grid > div')
    await expect(productCards).toHaveCountGreaterThan(0)

    // Pagination interactions
    const nextButton = page.getByRole('button', { name: /Next/i })
    if (await nextButton.isEnabled()) {
      await nextButton.click()
      await page.waitForTimeout(500) // allow data refresh
    }

    // Open first product detail
    const firstProductLink = page.getByRole('link', { name: /buy/i }).first()
    const href = await firstProductLink.getAttribute('href')
    await firstProductLink.click()

    await page.waitForURL((url) => href ? url.pathname.includes(href.replace('/books', '')) : false)
    await expect(page.locator('h1, h2, h3')).toContainText(/Book|Product/i, { timeout: 5000 })

    await page.goBack()
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible()
  })
})
