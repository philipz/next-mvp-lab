# Vue-Nuxt Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-11

## Active Technologies

### Frontend Framework
- **Next.js 14.2.33**: App Router, Server Components, TypeScript integration
- **React 18.3.1**: Component-based UI with hooks and context
- **TypeScript 5.5.4**: Strict mode, strict null checks enabled

### State Management & Data Fetching
- **TanStack Query 5.90.2**: Server state management with query key factories
- **Zod 3.23.8**: Runtime type validation and form schemas

### Styling & UI
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **CSS Modules**: Component-scoped styling when needed

### Development & Testing
- **Vitest 2.1.8**: Unit testing framework with coverage
- **Playwright 1.49.1**: End-to-end testing browser automation
- **Testing Library**: React component testing utilities
- **MSW (Mock Service Worker)**: API mocking for development and testing

### Build & Development Tools
- **pnpm 9.0.0**: Package manager with workspace support
- **ESLint**: Code linting with TypeScript rules
- **OpenAPI TypeScript**: Auto-generated types from API contracts
- **PostCSS**: CSS processing with Tailwind

## Project Structure

```
/workspaces/vue-nuxt/
├── apps/web/                    # Next.js application
│   ├── app/                     # App Router pages
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Homepage (redirects to /books)
│   │   ├── books/page.tsx       # Book catalog page
│   │   ├── customers/page.tsx   # Customer management
│   │   └── api/                 # API routes
│   ├── design-system/           # Reusable UI components
│   │   ├── product-card.tsx     # Book display card
│   │   ├── product-grid.tsx     # 5-column responsive grid
│   │   ├── cart-table.tsx       # Shopping cart display
│   │   ├── order-form.tsx       # Checkout form
│   │   ├── pagination.tsx       # Page navigation
│   │   └── data-table.tsx       # Generic table component
│   ├── features/                # Feature-specific code
│   │   ├── books/               # Book catalog functionality
│   │   │   ├── api/queries.ts   # TanStack Query hooks
│   │   │   └── spec/            # UI specifications
│   │   ├── cart/                # Shopping cart functionality
│   │   │   └── api/queries.ts   # Cart state management
│   │   ├── customers/           # Customer management
│   │   │   └── api/queries.ts   # Customer data queries
│   │   └── orders/              # Order processing
│   │       └── api/queries.ts   # Order management hooks
│   ├── lib/                     # Utility libraries
│   │   ├── http.ts              # HTTP client with GET/POST methods
│   │   └── types/               # TypeScript definitions
│   │       └── openapi.d.ts     # Auto-generated API types
│   ├── mocks/                   # MSW configuration
│   │   ├── handlers.ts          # API mock handlers
│   │   ├── browser.ts           # Browser MSW setup
│   │   └── index.ts             # MSW exports
│   ├── public/                  # Static assets
│   │   ├── mockServiceWorker.js # MSW service worker
│   │   └── images/              # Book cover images
│   ├── styles/
│   │   └── globals.css          # Global styles with Tailwind
│   └── e2e/                     # Playwright tests
│       └── smoke.spec.ts        # Basic smoke tests
├── docs/specs/                  # OpenAPI specifications
│   └── api/openapi.yaml         # API contract definitions
├── specs/001-simple-online-bookstore/  # Feature specifications
│   ├── spec.md                  # Complete feature specification
│   ├── plan.md                  # Implementation plan
│   ├── research.md              # Technical research
│   ├── data-model.md            # Entity definitions
│   ├── contracts/api.yaml       # OpenAPI contract
│   └── quickstart.md            # Development guide
└── scripts/
    └── gen-page-from-spec.ts    # Page generation utility
```

## Commands

### Development Workflow
```bash
# Start development server with hot reload
pnpm dev

# Build production bundle
pnpm build

# Type checking
pnpm typecheck

# Run unit tests with Vitest
pnpm test

# Run E2E tests with Playwright
pnpm test:e2e

# Lint code with ESLint
pnpm lint
```

### Code Generation
```bash
# Generate TypeScript types from OpenAPI spec
pnpm gen:types

# Generate page components from YAML specifications
pnpm gen:page <spec-file.yml>
```

### Testing Commands
```bash
# Run tests with coverage report
pnpm test --coverage

# Run tests in watch mode
pnpm test --watch

# Run specific E2E test file
pnpm test:e2e tests/books.spec.ts

# Run tests for specific feature
pnpm test features/books
```

## Code Style

### TypeScript
- **Strict Mode**: All strict options enabled
- **No `any` Types**: Use proper typing or `unknown`
- **Interface Naming**: No `I` prefix, use descriptive names
- **Enum Usage**: Prefer union types over enums when possible
- **Import Aliases**: Use `@/` for app root imports

### React Components
- **Functional Components**: Use function declarations, not arrow functions for exports
- **Props Interface**: Define props interface above component
- **Hooks Order**: useState, useEffect, custom hooks, then computed values
- **Event Handlers**: Use descriptive names (handleSubmit, handleClick)

### TanStack Query
- **Query Keys**: Use factory pattern with nested arrays
- **Query Functions**: Extract to separate files in `api/` folders
- **Error Handling**: Use error boundaries for query errors
- **Loading States**: Always handle loading and error states

### Styling
- **Tailwind Classes**: Use utility classes, avoid custom CSS when possible
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Color System**: Use Tailwind color palette consistently
- **Spacing**: Use Tailwind spacing scale (4, 8, 16, 24, 32...)

### File Organization
- **Feature Folders**: Group by feature, not by file type
- **Index Files**: Use for clean imports, not for logic
- **Spec Files**: Co-locate specifications with implementation
- **Test Files**: Use `.spec.ts` suffix, co-locate with components

## Recent Changes

### Feature: Simple Online Bookstore (In Progress)
**Added:** Complete specification-driven development workflow
- OpenAPI contract with Books, Cart, Orders endpoints
- Data model with 5 core entities (Book, Cart, CartItem, Customer, Order)
- Comprehensive feature specification with 5 user stories
- Implementation plan with 3 phases
- Quality checklists and success criteria

**Technologies:** Next.js App Router, TanStack Query, MSW mocking, Zod validation

**Impact:** Established foundation for e-commerce functionality with type-safe API contracts

### Foundation: SDD Methodology Setup
**Added:** Specification-driven development infrastructure
- Constitutional principles in Chinese
- Template system for specifications and plans
- Automated code generation scripts
- Quality validation checklists

**Technologies:** OpenAPI TypeScript generation, YAML specifications, MSW integration

**Impact:** Standardized development workflow ensuring consistency and quality

### Infrastructure: Testing & Development Environment
**Added:** Comprehensive testing setup and development tools
- Vitest unit testing with coverage reporting
- Playwright E2E testing configuration
- MSW service worker for API mocking
- ESLint and TypeScript strict configuration

**Technologies:** Vitest, Playwright, MSW, ESLint, TypeScript

**Impact:** Robust testing environment supporting TDD/BDD practices

<!-- MANUAL ADDITIONS START -->

## API Integration Patterns

### OpenAPI First Development
1. Define API contracts in `docs/specs/api/openapi.yaml`
2. Generate TypeScript types with `pnpm gen:types`
3. Implement MSW handlers for development
4. Create TanStack Query hooks for data fetching
5. Build UI components consuming typed data

### Query Key Factories
Use consistent patterns for TanStack Query keys:
```typescript
export const bookKeys = {
  all: () => ['books'] as const,
  lists: () => [...bookKeys.all(), 'list'] as const,
  list: (filters: string) => [...bookKeys.lists(), { filters }] as const,
  details: () => [...bookKeys.all(), 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
}
```

### Error Handling Strategy
- Use React Error Boundaries for query errors
- Implement consistent error UI components
- Log errors to monitoring service in production
- Provide user-friendly error messages

### Performance Optimization
- Implement proper loading states
- Use React.memo for expensive components
- Optimize bundle size with code splitting
- Monitor Core Web Vitals metrics

## Accessibility Standards

Follow WCAG 2.1 AA guidelines:
- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- Color contrast ratios >4.5:1
- Screen reader compatibility

## Security Considerations

- Sanitize user inputs with Zod validation
- Use HTTPS in production
- Implement CSRF protection
- Validate API responses
- Secure sensitive data handling

<!-- MANUAL ADDITIONS END -->