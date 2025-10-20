import { test as base } from '@playwright/test'

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addCookies([
      {
        name: 'NEXT_PUBLIC_USE_MOCKS',
        value: 'true',
        domain: 'localhost',
        path: '/',
      },
    ])
    await use(context)
  },
})

export { expect } from '@playwright/test'
