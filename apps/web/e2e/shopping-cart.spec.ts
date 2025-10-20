import { test, expect } from './fixtures'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

test.describe('Shopping cart', () => {
  test('adds product to cart and updates quantity', async ({ page }) => {
    await page.goto(`${baseURL}/books`, { waitUntil: 'networkidle' })

    const buyButton = page.getByRole('button', { name: /buy/i }).first()
    await expect(buyButton).toBeVisible()
    await buyButton.click()

    await page.waitForURL(/\/cart$/)
    await expect(page.locator('h1')).toContainText(/shopping cart/i)

    const quantityInput = page.getByRole('spinbutton').first()
    await expect(quantityInput).toHaveValue('1')

    await quantityInput.fill('2')
    await quantityInput.blur()
    await expect(quantityInput).toHaveValue('2')

    await expect(page.locator('text=/Total Amount:/i').first()).toBeVisible()
  })
})
