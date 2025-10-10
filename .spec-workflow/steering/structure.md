# Project Structure

## Directory Organization

```
next-mvp-lab/
├── apps/
│   └── web/                          # Main Next.js application
│       ├── app/                      # Next.js App Router (pages)
│       │   ├── layout.tsx           # Root layout component
│       │   ├── page.tsx             # Homepage
│       │   └── customers/           # Feature-based routing
│       │       └── page.tsx         # Customer list page (generated from spec)
│       │
│       ├── features/                 # Feature modules (domain logic)
│       │   └── customers/           # Customer feature module
│       │       ├── spec/            # Specifications (YAML)
│       │       │   └── page.customer-list.yml  # UI specification
│       │       └── api/             # Data fetching layer
│       │           └── queries.ts   # TanStack Query hooks & keys
│       │
│       ├── design-system/            # Reusable UI components
│       │   └── data-table.tsx       # DataTable component
│       │
│       ├── lib/                      # Shared utilities
│       │   ├── http.ts              # HTTP client wrapper
│       │   └── types/               # Generated TypeScript types
│       │       └── openapi.d.ts     # Generated from OpenAPI (DO NOT EDIT)
│       │
│       ├── mocks/                    # MSW API mocking
│       │   └── handlers.ts          # Mock API handlers aligned to OpenAPI
│       │
│       ├── e2e/                      # Playwright E2E tests
│       │   └── *.spec.ts            # End-to-end test files
│       │
│       ├── next-env.d.ts            # Next.js TypeScript declarations
│       └── tsconfig.json            # TypeScript config for web app
│
├── docs/
│   └── specs/                        # Project specifications
│       ├── api/
│       │   └── openapi.yaml         # OpenAPI 3.0 API contract
│       └── nonfunctional.md         # Non-functional requirements
│
├── scripts/                          # Code generation scripts
│   └── gen-page-from-spec.ts       # Generate pages from YAML specs
│
├── .spec-workflow/                   # Spec workflow metadata (MCP server)
│   ├── steering/                    # Steering documents
│   │   ├── product.md               # Product vision & goals
│   │   ├── tech.md                  # Technology stack & decisions
│   │   └── structure.md             # This file
│   └── templates/                   # Document templates
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline
│
├── package.json                      # Root package.json with scripts
├── pnpm-lock.yaml                   # pnpm lockfile
├── tsconfig.json                    # Root TypeScript config
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── vitest.config.ts                 # Vitest test configuration
├── playwright.config.ts             # Playwright E2E configuration
├── CLAUDE.md                        # AI assistant guidance
└── README.md                        # Project documentation
```

## Naming Conventions

### Files

#### Components & Pages
- **React Components**: `PascalCase.tsx` (e.g., `DataTable.tsx`, `CustomerList.tsx`)
- **Next.js Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)

#### Business Logic & Utilities
- **API Layer**: `camelCase.ts` (e.g., `queries.ts`, `mutations.ts`)
- **Utilities**: `camelCase.ts` (e.g., `http.ts`, `dateUtils.ts`)
- **Types**: `camelCase.d.ts` for manual types, `openapi.d.ts` for generated

#### Specifications
- **UI Specs**: `page.{feature-name}.yml` (e.g., `page.customer-list.yml`, `page.book-detail.yml`)
- **API Specs**: `openapi.yaml` (OpenAPI standard)
- **Requirements**: `kebab-case.md` (e.g., `nonfunctional.md`, `acceptance-criteria.md`)

#### Tests
- **Unit/Component Tests**: `{filename}.test.ts` or `{filename}.test.tsx`
- **E2E Tests**: `{feature}.spec.ts` (e.g., `checkout.spec.ts`)

### Code

#### TypeScript/React Naming
- **React Components**: `PascalCase` (e.g., `function DataTable()`, `export default CustomerList`)
- **Functions**: `camelCase` (e.g., `function fetchCustomers()`, `const handleClick = () => {}`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `const API_BASE_URL = '...'`, `const MAX_RETRIES = 3`)
- **Variables**: `camelCase` (e.g., `const customerData = ...`, `let isLoading = false`)
- **Types/Interfaces**: `PascalCase` (e.g., `type Customer = ...`, `interface CustomerListProps`)
- **Enums**: `PascalCase` for enum name, `PascalCase` for values (e.g., `enum BookFormat { Hardcover, Paperback }`)

#### Query Keys
- **Factory Pattern**: Lowercase with dot notation
  ```typescript
  export const qk = {
    customers: (params?: any) => ['customers', 'list', params ?? {}] as const,
    books: (id: string) => ['books', 'detail', id] as const
  }
  ```

## Import Patterns

### Import Order
Files should organize imports in this order:

1. **External dependencies** (React, Next.js, third-party libraries)
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { z } from 'zod'
   ```

2. **Internal modules** (absolute imports from project root)
   ```typescript
   import { DataTable } from '@/design-system/data-table'
   import { client } from '@/lib/http'
   ```

3. **Relative imports** (within same feature/module)
   ```typescript
   import { qk } from './api/queries'
   import type { Book } from './types'
   ```

4. **Style imports** (CSS modules, if used)
   ```typescript
   import styles from './styles.module.css'
   ```

### Module Organization

#### Path Aliases
TypeScript path aliases configured in `tsconfig.json`:
- `@/` → Maps to `apps/web/` root
- Examples:
  - `@/design-system/data-table` → `apps/web/design-system/data-table.tsx`
  - `@/lib/http` → `apps/web/lib/http.ts`
  - `@/features/books/api/queries` → `apps/web/features/books/api/queries.ts`

#### Import Style
- **Prefer absolute imports** for cross-feature references
- **Use relative imports** only within the same feature module
- **No circular dependencies** between features

Good:
```typescript
// In apps/web/app/books/page.tsx
import { DataTable } from '@/design-system/data-table'
import { useBooks } from '@/features/books/api/queries'
```

Avoid:
```typescript
// Don't use relative imports across features
import { DataTable } from '../../../design-system/data-table'
```

## Code Structure Patterns

### React Component Organization

```typescript
// 1. Imports
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/design-system/data-table'
import { qk } from './api/queries'
import type { Book } from '@/lib/types/openapi'

// 2. Type definitions (local to this file)
interface BookListProps {
  categoryId?: string
}

// 3. Constants
const COLUMNS = [
  { id: 'title', header: 'Title' },
  { id: 'author', header: 'Author' },
]

// 4. Main component
export default function BookList({ categoryId }: BookListProps) {
  // Hooks
  const { data, isLoading, error } = useQuery({
    queryKey: qk.books(categoryId),
    queryFn: () => fetchBooks(categoryId)
  })

  // Early returns for loading/error states
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  // Render
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Books</h1>
      <DataTable rows={data?.items ?? []} columns={COLUMNS} />
    </main>
  )
}

// 5. Helper functions (at bottom, after main component)
async function fetchBooks(categoryId?: string) {
  const path = categoryId ? `/api/books?category=${categoryId}` : '/api/books'
  return client.GET(path)
}
```

### API Layer Organization

```typescript
// features/{feature}/api/queries.ts

// 1. Imports
import { useQuery, useMutation } from '@tanstack/react-query'
import { client } from '@/lib/http'
import type { Book, BookList } from '@/lib/types/openapi'

// 2. Query key factory (export for use in components)
export const qk = {
  books: (filters?: BookFilters) => ['books', 'list', filters ?? {}] as const,
  book: (id: string) => ['books', 'detail', id] as const,
}

// 3. Query hooks
export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: qk.books(filters),
    queryFn: () => client.GET<BookList>('/api/books', { params: filters })
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: qk.book(id),
    queryFn: () => client.GET<Book>(`/api/books/${id}`)
  })
}

// 4. Mutation hooks
export function useCreateBook() {
  return useMutation({
    mutationFn: (book: NewBook) => client.POST('/api/books', { body: book }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] })
  })
}
```

### File Organization Principles

1. **One primary export per file**: Each file should have one main component/function as default export
2. **Related utilities co-located**: Helper functions used by a component should be in the same file or nearby
3. **Types near usage**: Local types defined in the same file, shared types in `@/lib/types/`
4. **Public API clear**: Default exports for main functionality, named exports for utilities

## Code Organization Principles

### 1. Feature-Based Architecture
- **Group by business domain**, not by technical layer
- Each feature module (`features/{feature}/`) is self-contained
- Features should minimize dependencies on other features

Example:
```
features/
  books/              # Book catalog feature
    spec/             # UI specifications
    api/              # Data fetching
    components/       # Book-specific components (if needed)
  cart/               # Shopping cart feature
    spec/
    api/
    components/
  checkout/           # Checkout flow feature
    spec/
    api/
    components/
```

### 2. Separation of Concerns
- **Presentation** (`app/` - pages, layouts)
- **Business Logic** (`features/` - domain logic, API integration)
- **Reusable UI** (`design-system/` - generic components)
- **Utilities** (`lib/` - shared helpers, types, HTTP client)

### 3. Specification-Driven
- **Start with specs**: OpenAPI for APIs, YAML for UI pages
- **Generate code**: Use `pnpm gen:types` and `pnpm gen:page`
- **Enhance generated code**: Add business logic, error handling, UX polish
- **Keep specs updated**: Specs are living documentation

### 4. Type Safety First
- **No `any` types** in application code (strict mode enforced)
- **Generated types from OpenAPI**: Single source of truth for API contracts
- **Runtime validation with Zod**: Validate API responses at runtime
- **Type inference**: Let TypeScript infer types where possible

## Module Boundaries

### Core Application Boundaries

#### 1. App Router (`app/`) ↔ Features (`features/`)
- **Direction**: `app/` imports from `features/`, never reverse
- **Rule**: Pages use feature API hooks, never access data directly
- **Rationale**: Pages are thin presentation layer, features contain business logic

#### 2. Features ↔ Features
- **Direction**: Features should NOT import from each other
- **Rule**: Share code via `lib/` or `design-system/`, not between features
- **Rationale**: Maintain loose coupling, enable independent development

#### 3. Features (`features/`) ↔ Design System (`design-system/`)
- **Direction**: Features can import design-system components
- **Rule**: Design-system components are generic, no business logic
- **Rationale**: Reusable UI components, feature-agnostic

#### 4. Everyone ↔ Lib (`lib/`)
- **Direction**: All modules can import from `lib/`
- **Rule**: `lib/` contains only pure utilities, no feature-specific code
- **Rationale**: Shared foundational code

#### 5. Generated Types (`lib/types/openapi.d.ts`)
- **Direction**: All modules can import types
- **Rule**: NEVER manually edit `openapi.d.ts` - regenerate from spec
- **Rationale**: Single source of truth from OpenAPI contract

### Dependency Flow Diagram

```
┌─────────────────────────────────────────┐
│           app/ (Pages)                  │
│         ↓ imports only                  │
├─────────────────────────────────────────┤
│      features/ (Business Logic)         │
│         ↓ imports only                  │
├─────────────────────────────────────────┤
│  design-system/  ←→  lib/ (Utilities)   │
│  (UI Components)                        │
└─────────────────────────────────────────┘
           ↓ all import from
    lib/types/openapi.d.ts (Generated)
```

### Circular Dependency Prevention
- **Never import pages into features**: Features don't know about pages
- **Never import features into each other**: Use events/callbacks if needed
- **Shared state goes in lib/**: If two features need shared state, extract to `lib/`

## Code Size Guidelines

### File Size Limits
- **React Components**: Maximum 300 lines (preferably <200)
  - Split large components into smaller sub-components
  - Extract helper functions to separate files if >50 lines

- **API Layer**: Maximum 200 lines per feature
  - If query file exceeds limit, split into `queries.ts` and `mutations.ts`

- **Utility Files**: Maximum 150 lines
  - Group related utilities (e.g., `dateUtils.ts`, `stringUtils.ts`)

### Function Size Limits
- **React Components**: Maximum 50 lines of JSX
  - Extract complex logic into custom hooks
  - Break down into smaller sub-components

- **Functions**: Maximum 30 lines (preferably <20)
  - Single responsibility per function
  - Extract helper functions if nesting gets deep

### Complexity Guidelines
- **Nesting Depth**: Maximum 3 levels of indentation
  - Use early returns to reduce nesting
  - Extract nested logic into functions

- **Function Parameters**: Maximum 4 parameters
  - Use object parameters for >4 arguments
  - Consider creating a dedicated type for complex parameters

Example - Avoid deep nesting:
```typescript
// Bad: Deep nesting
function processOrder(order: Order) {
  if (order.items.length > 0) {
    if (order.user.isVerified) {
      if (order.total > 0) {
        // Process payment...
      }
    }
  }
}

// Good: Early returns
function processOrder(order: Order) {
  if (order.items.length === 0) return
  if (!order.user.isVerified) return
  if (order.total <= 0) return

  // Process payment...
}
```

## Dashboard/Monitoring Structure

### Current State
The project does not currently have a built-in dashboard or admin panel. Monitoring and observability will be added in Phase 2.

### Future Dashboard Structure (Planned)

```
apps/web/
  app/
    admin/                    # Admin dashboard routes
      layout.tsx             # Admin-specific layout
      page.tsx               # Dashboard home
      orders/                # Order management
      inventory/             # Book inventory
      analytics/             # Sales analytics

  features/
    admin/                    # Admin feature module
      api/                   # Admin-specific APIs
      components/            # Admin UI components
      spec/                  # Admin page specifications
```

### Separation of Concerns (Future)
- **Admin routes isolated**: Under `/admin` path prefix
- **Admin features separate**: Own feature module in `features/admin/`
- **Shared components reused**: Use `design-system/` components
- **Protected routes**: Authentication middleware on admin routes
- **Independent deployment**: Can be deployed separately if needed

## Documentation Standards

### Public APIs
- **All exported functions/components** must have JSDoc comments
- **Include examples** for complex APIs
- **Document parameters and return types**

Example:
```typescript
/**
 * Fetches a paginated list of books from the catalog API.
 *
 * @param filters - Optional filters for category, author, price range
 * @param page - Page number (1-indexed)
 * @returns Promise resolving to BookList with items and pagination metadata
 *
 * @example
 * ```ts
 * const books = await fetchBooks({ category: 'fiction' }, 1)
 * console.log(books.items) // Array of Book objects
 * ```
 */
export async function fetchBooks(filters?: BookFilters, page = 1): Promise<BookList> {
  // Implementation...
}
```

### Complex Logic
- **Inline comments** for non-obvious business logic
- **Explain "why"** not "what" (code shows "what")
- **Link to specs** for business rules

Example:
```typescript
// Apply 10% discount for orders over $100 (see: docs/specs/pricing-rules.md)
const discount = order.total > 100 ? order.total * 0.1 : 0
```

### Module-Level Documentation
- **README.md** in feature directories for complex features
- **Explain architecture decisions** in READMEs
- **Document data flows** and state management patterns

### Specification Documentation
- **OpenAPI specs** (`docs/specs/api/openapi.yaml`) are API documentation
- **YAML UI specs** (`features/*/spec/*.yml`) are UI documentation
- **CLAUDE.md** provides AI assistant guidance and project conventions
- **Steering docs** (`.spec-workflow/steering/`) define product, tech, and structure

### Keep Documentation Updated
- **Update specs before code**: Contract-first development
- **Regenerate types** after API changes: `pnpm gen:types`
- **Update YAML specs** when UI changes: Keep specs and code in sync
- **Document breaking changes** in commit messages and PR descriptions

## Special Patterns for SDD

### 1. Generated Code Enhancement Pattern
```typescript
/* generated from features/books/spec/page.book-list.yml */
"use client"
import { DataTable } from "@/design-system/data-table"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/http"

// ✅ GENERATED: Basic structure
export default function BookList(){
  const { data, isLoading } = useQuery({
    queryKey: ["books","list"],
    queryFn: () => client.GET("/api/books").then(r=>r.data)
  });

  // ❌ TODO: Add error handling (not generated)
  // ❌ TODO: Add loading state (not generated)
  // ❌ TODO: Add pagination (not generated)
  // ✅ ENHANCEMENT: Developer adds these manually

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Books</h1>
      <DataTable
        loading={isLoading}
        rows={(data?.items ?? []) as any[]}
        columns={[
          { id: "title", header: "Title" },
          { id: "author", header: "Author" }
        ]}
      />
    </main>
  );
}
```

### 2. Query Key Factory Pattern
**Always use factory functions** for TanStack Query keys:

```typescript
// features/books/api/queries.ts
export const qk = {
  all: () => ['books'] as const,
  lists: () => [...qk.all(), 'list'] as const,
  list: (filters: BookFilters) => [...qk.lists(), filters] as const,
  details: () => [...qk.all(), 'detail'] as const,
  detail: (id: string) => [...qk.details(), id] as const,
}

// Usage in components
useQuery({ queryKey: qk.list({ category: 'fiction' }) })
useQuery({ queryKey: qk.detail('book-123') })
```

### 3. Spec-First Development Workflow
1. **Define OpenAPI endpoint** in `docs/specs/api/openapi.yaml`
2. **Generate TypeScript types**: `pnpm gen:types`
3. **Create UI spec YAML** in `features/{feature}/spec/page.{name}.yml`
4. **Generate page skeleton**: `pnpm gen:page`
5. **Add MSW mock handler** in `apps/web/mocks/handlers.ts`
6. **Implement business logic** in generated page
7. **Write tests** (unit + E2E)
8. **Iterate and refine**

This workflow ensures:
- Frontend-backend contract alignment
- Consistent code patterns
- Automated boilerplate generation
- Clear documentation trail
