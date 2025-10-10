# Technology Stack

## Project Type
**Web Application**: Modern e-commerce frontend for an online bookstore, built with React-based framework following Specification-Driven Development (SDD) methodology. This is a single-page application (SPA) with server-side rendering (SSR) capabilities for optimal performance and SEO.

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript 5.5.4
- **Runtime**: Node.js >= 18.17 (specified in development requirements)
- **Target**: ES2022 with DOM APIs
- **Compiler Options**: Strict mode enabled, module resolution: Bundler
- **Package Manager**: pnpm 9.0.0 (managed via corepack)

### Key Dependencies/Libraries

#### Frontend Framework & Runtime
- **Next.js 14.2.33**: React framework with App Router for file-based routing, SSR, and SSG
- **React 18.3.1**: UI library for building component-based interfaces
- **React DOM 18.3.1**: React renderer for web browsers

#### State Management & Data Fetching
- **TanStack Query 5.90.2** (formerly React Query): Server state management with caching, background updates, and optimistic UI
- **Zod 3.24.1**: TypeScript-first schema validation for runtime type safety

#### Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for rapid UI development
- **PostCSS 8.4.49**: CSS processing tool for Tailwind
- **Autoprefixer 10.4.20**: Automatically adds vendor prefixes to CSS

#### API Integration & Code Generation
- **openapi-typescript 7.4.3**: Generates TypeScript types from OpenAPI 3.0 specifications
- **MSW (Mock Service Worker) 2.7.0**: API mocking library for development and testing

#### Testing
- **Vitest 2.1.8**: Fast unit test framework compatible with Vite ecosystem
- **@testing-library/react 16.1.0**: Testing utilities for React components
- **@testing-library/jest-dom 6.6.3**: Custom matchers for DOM assertions
- **Playwright 1.49.1**: End-to-end testing framework for cross-browser testing

#### Development Tools
- **ESLint 9.18.0**: JavaScript/TypeScript linter with Next.js config
- **ts-node 10.9.2**: TypeScript execution engine for Node.js (used in code generation scripts)
- **js-yaml 4.1.0**: YAML parser for UI specification files

### Application Architecture
**Specification-Driven Architecture (SDA)** with feature-based modular structure:

1. **Contract-First Development**: OpenAPI specifications define API contracts, YAML files define UI structure
2. **Code Generation Layer**: Automated generation of TypeScript types and page skeletons from specifications
3. **Feature Modules**: Each business feature (books, cart, checkout) is self-contained with its own specs, API layer, and components
4. **Design System**: Minimal component library with reusable UI primitives
5. **Data Layer**: TanStack Query with query key factories for consistent caching and state management
6. **Server-Side Rendering**: Next.js App Router enables SSR for initial page loads and SEO
7. **Client-Side Hydration**: React takes over after initial load for dynamic interactions

**Key Architectural Patterns**:
- **Query Key Factory Pattern**: Centralized query key management per feature
- **Declarative UI Specs**: YAML-driven page definitions with automated code generation
- **API Contract Alignment**: MSW handlers mirror OpenAPI schemas exactly
- **Type-Safe API Client**: Minimal HTTP client with OpenAPI-generated types

### Data Storage (if applicable)
**Frontend State Management Only** (no direct database access):

- **Primary Storage**: Backend APIs (not part of this frontend project)
- **Client-Side Caching**: TanStack Query in-memory cache with automatic garbage collection
- **Persistent Storage**: Browser localStorage/sessionStorage for cart persistence (future implementation)
- **Data Formats**: JSON for all API communication

### External Integrations (if applicable)
**API Communication**:
- **Backend Book API**: RESTful API defined in `docs/specs/api/openapi.yaml`
  - Current endpoints: `GET /api/customers` (example), to be replaced with book catalog endpoints
- **Protocols**: HTTP/REST with JSON payloads
- **Authentication**: To be implemented (OAuth 2.0 or JWT planned)
- **Error Handling**: HTTP status codes with structured error responses

**Future Integrations**:
- Payment Gateway (Stripe, PayPal)
- Shipping/Logistics API
- Inventory Management System
- Email Service (order confirmations, shipping notifications)

### Monitoring & Dashboard Technologies (if applicable)
**Current State**: Minimal monitoring, production-ready monitoring to be added

**Planned Monitoring Stack**:
- **Error Tracking**: Sentry for frontend error monitoring
- **Performance Monitoring**: Vercel Analytics or Google Analytics for Core Web Vitals
- **User Analytics**: PostHog or Mixpanel for user behavior tracking
- **Lighthouse CI**: Automated performance and accessibility audits in CI/CD

**Dashboard Technologies** (for future admin panel):
- **Framework**: Next.js pages with same tech stack
- **Real-time Updates**: TanStack Query polling or WebSocket integration
- **Visualization**: Chart.js or Recharts for sales/inventory dashboards
- **State Management**: TanStack Query for real-time data fetching

## Development Environment

### Build & Development Tools
- **Build System**: Next.js built-in bundler (webpack/Turbopack)
- **Package Management**: pnpm with workspace support
- **Development Workflow**:
  - `pnpm dev`: Hot module replacement (HMR) on port 3000
  - `pnpm gen:types`: OpenAPI to TypeScript type generation
  - `pnpm gen:page`: YAML spec to React component generation
- **Code Generation**: Custom ts-node scripts in `scripts/` directory

**Development Scripts**:
```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Production build
pnpm start        # Start production server
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint validation
pnpm test         # Run unit tests with coverage
pnpm test:ui      # Interactive test UI (Vitest)
pnpm test:e2e     # Playwright E2E tests
```

### Code Quality Tools
- **Static Analysis**:
  - TypeScript compiler in strict mode (no implicit any, strict null checks)
  - ESLint with Next.js recommended rules

- **Formatting**:
  - Implicit via ESLint configuration
  - Tailwind CSS IntelliSense for class name validation

- **Testing Framework**:
  - **Unit/Component**: Vitest with jsdom environment
  - **E2E**: Playwright for cross-browser testing
  - **Coverage**: Vitest coverage with text and HTML reporters (target: 80%+)

- **Documentation**:
  - CLAUDE.md for AI assistant guidance
  - Inline JSDoc comments for complex logic
  - OpenAPI specs serve as API documentation
  - YAML specs serve as UI documentation

### Version Control & Collaboration
- **VCS**: Git
- **Branching Strategy**: To be defined (recommend GitHub Flow or trunk-based)
- **Code Review Process**: To be defined (recommend PR reviews with CI checks)
- **CI/CD**:
  - GitHub Actions workflow at `.github/workflows/ci.yml`
  - Automated type checking, linting, and tests
  - Dependabot for dependency updates

### Dashboard Development (if applicable)
**For Future Admin Dashboard**:
- **Live Reload**: Next.js Fast Refresh (HMR) in development
- **Port Management**: Configurable via `-p` flag (default 3000)
- **Multi-Instance Support**: Multiple dev servers can run on different ports

## Deployment & Distribution

### Target Platform(s)
- **Primary**: Vercel (optimized for Next.js)
- **Alternative**: Any Node.js hosting (Netlify, AWS, self-hosted)
- **Browser Support**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Responsive design for iOS Safari and Chrome on Android

### Distribution Method
- **Deployment**: Continuous deployment via Vercel/Netlify or manual deployment
- **Build Output**: Static HTML + JavaScript bundles with SSR support
- **CDN**: Automatic edge caching for static assets
- **Update Mechanism**: Atomic deployments with zero downtime

### Installation Requirements
**For Development**:
- Node.js >= 18.17
- pnpm 9.0.0 (or use corepack)
- Git

**For Production**:
- Node.js runtime (if using SSR)
- Or static hosting (if using SSG/export)

## Technical Requirements & Constraints

### Performance Requirements
- **Page Load Time**: <2 seconds on 3G networks (target for book listing/details)
- **Time to Interactive (TTI)**: <3 seconds
- **First Contentful Paint (FCP)**: <1.5 seconds
- **Largest Contentful Paint (LCP)**: <2.5 seconds (Core Web Vitals)
- **First Input Delay (FID)**: <100ms
- **Cumulative Layout Shift (CLS)**: <0.1
- **Bundle Size**: Monitor and optimize with code splitting
- **Image Optimization**: Next.js Image component with lazy loading for book covers

### Compatibility Requirements
- **Platform Support**:
  - macOS, Windows, Linux for development
  - Any OS with modern browser for end users

- **Browser Support**:
  - Chrome/Edge (last 2 versions)
  - Firefox (last 2 versions)
  - Safari (last 2 versions)
  - Mobile browsers (iOS Safari 14+, Chrome Android)

- **Dependency Versions**:
  - Node.js >= 18.17 (LTS)
  - pnpm = 9.0.0 (enforced via packageManager field)

- **Standards Compliance**:
  - ECMAScript 2022
  - HTML5, CSS3
  - OpenAPI 3.0.3
  - WCAG 2.1 Level AA for accessibility

### Security & Compliance
- **Security Requirements**:
  - HTTPS enforced in production
  - Content Security Policy (CSP) headers
  - XSS protection via React's built-in escaping
  - CSRF protection for API mutations
  - Secure authentication token storage (httpOnly cookies or secure localStorage)

- **Compliance Standards**:
  - GDPR compliance for EU users (cookie consent, data privacy)
  - Accessibility: WCAG 2.1 Level AA
  - PCI DSS compliance for payment handling (via third-party payment gateway)

- **Threat Model**:
  - XSS: Mitigated by React and CSP
  - CSRF: Token-based protection on mutations
  - Injection: Input validation with Zod schemas
  - Dependency vulnerabilities: Monitored via Dependabot

### Scalability & Reliability
- **Expected Load**:
  - Phase 1: 1,000-10,000 concurrent users
  - Phase 2: 50,000+ concurrent users
  - Book catalog: 10,000-100,000 books

- **Availability Requirements**:
  - Target: 99.9% uptime (8.76 hours downtime/year)
  - Graceful degradation when backend APIs are unavailable
  - Static asset caching via CDN

- **Growth Projections**:
  - Horizontal scaling via edge deployment (Vercel Edge Functions)
  - Static generation for book detail pages (ISR - Incremental Static Regeneration)
  - Client-side caching reduces backend load

## Technical Decisions & Rationale

### Decision Log

1. **Next.js 14 with App Router**:
   - **Why**: Modern React framework with SSR/SSG, file-based routing, and excellent DX
   - **Alternatives Considered**: Remix, Vite + React Router, Create React App
   - **Trade-offs**: App Router is newer but provides better performance and simpler data fetching
   - **Rationale**: Best-in-class performance, strong ecosystem, Vercel integration

2. **TanStack Query over Redux/Zustand**:
   - **Why**: Server state management is primary concern for e-commerce (book catalog, cart API)
   - **Alternatives Considered**: Redux Toolkit, Zustand, SWR
   - **Trade-offs**: Learning curve, but eliminates boilerplate for async state
   - **Rationale**: Automatic caching, background refetching, optimistic updates out-of-the-box

3. **TypeScript Strict Mode**:
   - **Why**: Prevent runtime errors, improve code maintainability
   - **Alternatives Considered**: JavaScript, TypeScript with loose settings
   - **Trade-offs**: Slightly slower initial development, but faster debugging
   - **Rationale**: Type safety critical for e-commerce (pricing, cart calculations)

4. **Specification-Driven Development (SDD)**:
   - **Why**: Align frontend-backend contracts, enable code generation, improve AI assistant effectiveness
   - **Alternatives Considered**: Manual coding, Swagger UI only
   - **Trade-offs**: Upfront spec design overhead
   - **Rationale**: Reduces drift, accelerates development, improves consistency

5. **MSW for API Mocking**:
   - **Why**: Develop frontend independently of backend, mirror OpenAPI specs exactly
   - **Alternatives Considered**: JSON files, dedicated mock server
   - **Trade-offs**: Additional setup complexity
   - **Rationale**: Intercepts network requests at service worker level, realistic testing

6. **Tailwind CSS over CSS-in-JS**:
   - **Why**: Utility-first approach, minimal runtime overhead, excellent DX
   - **Alternatives Considered**: Styled-components, Emotion, CSS Modules
   - **Trade-offs**: Utility class verbosity in JSX
   - **Rationale**: Fast development, small bundle size, great with component libraries

7. **Vitest over Jest**:
   - **Why**: Faster test execution, better ESM support, Vite ecosystem alignment
   - **Alternatives Considered**: Jest
   - **Trade-offs**: Smaller community than Jest
   - **Rationale**: Modern testing framework with excellent performance

8. **pnpm over npm/yarn**:
   - **Why**: Faster installs, efficient disk usage, strict dependency resolution
   - **Alternatives Considered**: npm, yarn, yarn berry
   - **Trade-offs**: Less common in ecosystem
   - **Rationale**: Performance benefits, workspace support, industry trend

## Known Limitations

### Current Limitations

1. **Limited Code Generation Coverage**:
   - **Impact**: Only basic page skeletons generated, filters/pagination/actions require manual implementation
   - **Reason**: Minimal template approach, prioritizing flexibility over automation
   - **Future Solution**: Phase 2 will expand generator to handle forms, filters, and complex interactions

2. **No Authentication/Authorization**:
   - **Impact**: Cannot implement user accounts, protected routes, or personalized features
   - **Reason**: Out of scope for minimal template, varies greatly by project
   - **Future Solution**: Add authentication pattern (NextAuth.js, Auth0) in Phase 1 implementation

3. **Basic Error Handling**:
   - **Impact**: HTTP errors throw, no retry logic or user-friendly error messages
   - **Reason**: Minimal HTTP client implementation
   - **Future Solution**: Enhance HTTP client with error boundaries, retry logic, toast notifications

4. **No Internationalization (i18n)**:
   - **Impact**: Single language support only (currently English/Chinese mixed)
   - **Reason**: Not required for MVP
   - **Future Solution**: Add next-i18next or next-intl in Phase 3 for global expansion

5. **Limited Monitoring/Observability**:
   - **Impact**: No error tracking, performance monitoring, or user analytics in production
   - **Reason**: Minimal template focuses on development workflow
   - **Future Solution**: Integrate Sentry, Vercel Analytics, and user analytics in Phase 1 production deployment

6. **No Bundle Size Budgets**:
   - **Impact**: Bundle size not monitored, potential for bloat over time
   - **Reason**: Deferred to Phase 2 per NFR documentation
   - **Future Solution**: Add size-limit or Lighthouse CI with bundle budgets

7. **Placeholder Customer API**:
   - **Impact**: Current OpenAPI spec uses "customers" instead of "books"
   - **Reason**: Template example not yet customized for bookstore domain
   - **Future Solution**: Replace with book catalog, cart, and order APIs in Phase 1 implementation

### Technical Debt

1. **Generated Code Requires Manual Enhancement**:
   - Generated pages lack loading states, error handling, and accessibility attributes
   - Developers must add these manually after generation

2. **Minimal HTTP Client**:
   - Only supports GET method, needs POST/PUT/DELETE for cart and checkout
   - No request interceptors, retry logic, or timeout handling

3. **Test Coverage Gaps**:
   - E2E tests not yet implemented for any flows
   - Unit test examples exist but coverage is incomplete

4. **Design System Incompleteness**:
   - Only DataTable component exists, needs forms, buttons, modals, etc.
   - No component documentation or Storybook

These limitations are acceptable for a minimal template and will be addressed during actual bookstore implementation phases.
