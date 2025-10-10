# SDD Frontend Minimum Template (Next.js + TS + Tailwind + Query + Zod + MSW + Vitest + Playwright)

A minimal, spec-driven development (SDD) ready template for front-end apps with AI coding agents (Cursor/VSCode).

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- TanStack Query (server state) + Zod (schema validation)
- OpenAPI (contract-first) + `openapi-typescript` codegen
- MSW (API mocks aligned to OpenAPI)
- Vitest + Testing Library (unit/component)
- Playwright (e2e)
- Light codegen example: generate page skeleton from UI spec YAML

> Keep it *minimal*: Storybook/Lighthouse/size-limit etc. can be added later.

## Getting Started
```bash
# 0) Node >= 18.17 and pnpm recommended
corepack enable
corepack prepare pnpm@latest --activate

# 1) Install deps
pnpm install

# 2) (Optional) Generate types from OpenAPI
pnpm gen:types

# 3) Generate page skeleton from UI spec (customers list)
pnpm gen:page

# 4) Dev
pnpm dev

# 5) Unit tests
pnpm test

# 6) E2E (first: build & start + run Playwright)
pnpm build && pnpm start &
pnpm test:e2e
```

## Structure
```
apps/web/
  app/                # Next App Router
  design-system/      # Minimal DS (DataTable skeleton)
  features/
    customers/
      spec/           # UI & acceptance specs (SDD)
      api/            # Query keys & data hooks
  lib/                # http client, types, utils
  mocks/              # MSW handlers (mock API)
  e2e/                # Playwright tests
docs/specs/           # OpenAPI + NFRs
scripts/              # simple codegen demo
```

## SDD Workflow
1. Define API spec: `docs/specs/api/openapi.yaml` → `pnpm gen:types`
2. Define UI spec: `apps/web/features/customers/spec/page.customer-list.yml`
3. Generate page skeleton: `pnpm gen:page`
4. Implement details (with AI agent), add tests, meet NFR in `docs/specs/nonfunctional.md`

## Cursor / VSCode Tips
- Add project rules in your `.cursor/rules` (or VSCode notes).
- Keep dependencies controlled; update ADRs if governance is enabled.

---

MIT License
