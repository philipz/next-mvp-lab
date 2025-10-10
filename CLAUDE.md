# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Specification-Driven Development (SDD)** frontend template built with Next.js. The architecture follows a contract-first approach using OpenAPI specs and YAML-based UI specifications that drive code generation.

**Key Technology Stack:**
- Next.js 14 (App Router) + TypeScript (strict mode)
- TanStack Query for server state + Zod for validation
- Tailwind CSS for styling
- MSW (Mock Service Worker) for API mocking aligned to OpenAPI
- Vitest + Testing Library for unit/component tests
- Playwright for E2E tests

## Development Commands

### Essential Commands
```bash
# Install dependencies (requires Node >= 18.17, pnpm recommended)
pnpm install

# Development server (runs on port 3000)
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

### Testing Commands
```bash
# Run all unit/component tests with coverage
pnpm test

# Run tests in UI mode (interactive)
pnpm test:ui

# Run E2E tests (requires app to be running)
pnpm build && pnpm start &
pnpm test:e2e
```

### Code Generation Workflow
```bash
# 1. Generate TypeScript types from OpenAPI spec
pnpm gen:types

# 2. Generate page skeleton from UI spec YAML
pnpm gen:page
```

## Architecture Patterns

### Specification-Driven Development (SDD) Workflow

The project follows a strict spec-first approach:

1. **Define API Contract**: Edit `docs/specs/api/openapi.yaml`
2. **Generate Types**: Run `pnpm gen:types` to generate TypeScript types at `apps/web/lib/types/openapi.d.ts`
3. **Define UI Spec**: Create YAML spec in `apps/web/features/{feature}/spec/` (see `page.customer-list.yml` as reference)
4. **Generate Skeleton**: Run `pnpm gen:page` to scaffold the page
5. **Implement Details**: Add business logic, handlers, and validation
6. **Add Tests**: Write unit tests and E2E tests
7. **Validate NFRs**: Check against `docs/specs/nonfunctional.md`

### Directory Structure & Conventions

```
apps/web/
  app/                      # Next.js App Router pages
    {feature}/              # Feature-based routing
      page.tsx             # Generated from UI spec
  features/                # Feature modules (domain logic)
    {feature}/
      spec/                # UI & acceptance specs (YAML)
        page.{name}.yml    # UI specification
      api/                 # TanStack Query setup
        queries.ts         # Query keys & hooks
  lib/                     # Shared utilities
    http.ts               # Minimal HTTP client wrapper
    types/                # Generated types
      openapi.d.ts        # Generated from OpenAPI (DO NOT EDIT)
  mocks/                   # MSW handlers
    handlers.ts           # API mock implementations aligned to OpenAPI
  design-system/           # Minimal design system components
  e2e/                     # Playwright E2E tests

docs/specs/
  api/
    openapi.yaml          # OpenAPI 3.0 API contract
  nonfunctional.md        # NFR requirements

scripts/
  gen-page-from-spec.ts   # Page generation from UI spec
```

### Feature Module Pattern

Each feature follows this structure:

1. **Spec-First**: Define UI spec in `features/{feature}/spec/page.{name}.yml`
   - Includes: route, layout, data source, view configuration, requirements

2. **API Layer**: `features/{feature}/api/`
   - Define query keys using factory pattern: `qk.customers(['customers', 'list', params])`
   - Co-locate data fetching hooks with feature

3. **Generated Page**: `app/{feature}/page.tsx`
   - Generated from UI spec via `pnpm gen:page`
   - Uses design-system components (e.g., `DataTable`)
   - Integrates TanStack Query with typed OpenAPI client

### API Mocking Pattern

MSW handlers in `apps/web/mocks/handlers.ts` must:
- Align with OpenAPI schema definitions
- Use `http.{method}` from 'msw'
- Return `HttpResponse.json()` with typed data
- Support query parameters defined in OpenAPI

### HTTP Client Pattern

The minimal HTTP client (`lib/http.ts`) provides:
- Simple `GET` method with fetch wrapper
- Automatic JSON parsing
- Basic error handling (throws on non-ok responses)
- **Extend this pattern** for POST/PUT/DELETE when needed

### Query Key Factory Pattern

TanStack Query keys follow a factory pattern:
```typescript
export const qk = {
  customers: (params?: any) => ['customers', 'list', params ?? {}] as const
}
```

## Code Quality Standards

### Non-Functional Requirements (NFRs)
- ✅ TypeScript strict mode enabled
- ✅ Unit tests for critical components
- ✅ Basic accessibility (semantic HTML, focusable elements)
- 🔜 Bundle size & Lighthouse budgets (Phase 2)

### Testing Strategy
- **Unit/Component**: Tests in `apps/web/**/*.test.{ts,tsx}` using Vitest + Testing Library
- **E2E**: Tests in `apps/web/e2e/` using Playwright
- **Coverage**: Run with `pnpm test` (generates text + HTML reports)

### UI Specification Format

When creating new features, follow the UI spec YAML structure:
```yaml
page: {PageName}
route: /{route}
layout:
  title: {Title}
  actions:
    - type: button
      id: {actionId}
      label: {Label}
      intent: route:{path}
data:
  source: {HTTP_METHOD} {API_PATH}
  queryKey: [{key}, {subkey}]
  pagination: server|client
  filters:
    - id: {filterId}
      type: text|select
      label: {Label}
view:
  type: table|grid|list
  columns:
    - id: {fieldId}
      header: {Header}
requirements:
  accessibility: {description}
  lighthouse:
    performance: {threshold}
    accessibility: {threshold}
```

## Important Guidelines

### When Adding New Features
1. Start with OpenAPI spec updates for new endpoints
2. Run `pnpm gen:types` to update TypeScript types
3. Create UI spec YAML in feature's spec directory
4. Run `pnpm gen:page` to generate initial page structure
5. Implement business logic and handlers
6. Add corresponding MSW mock handlers
7. Write unit tests and E2E tests
8. Verify against NFRs

### When Modifying Existing Features
1. Check if changes require OpenAPI updates
2. Update UI spec YAML if page structure changes
3. Maintain consistency with generated patterns
4. Update MSW handlers if API contract changes
5. Update tests to reflect changes
6. Re-run type generation if needed

### Code Generation Philosophy
- **Generated code is a starting point**, not final implementation
- Scaffolded pages should be enhanced with proper error handling, loading states, and UX polish
- Follow existing patterns in `apps/web/app/` for consistency
- Keep codegen minimal; avoid over-abstraction

### Testing Philosophy
- Test critical business logic with unit tests
- Use E2E tests for critical user flows
- MSW mocks should mirror OpenAPI contract exactly
- Prefer testing user behavior over implementation details

## Key Constraints
- Use pnpm for package management (configured via packageManager field)
- Maintain TypeScript strict mode compliance
- All API changes must start with OpenAPI spec updates
- Generated types (`openapi.d.ts`) should never be manually edited
- Keep the template minimal - avoid adding unnecessary dependencies or tooling
