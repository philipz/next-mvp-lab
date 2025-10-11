<!--
Sync Impact Report:
- Version change: initial → 1.0.0
- New constitution for SDD Frontend Template project
- Added 5 core principles: Specification-First, Contract-First APIs, Feature Modularity, Type Safety, User-Centric Design
- Added Technology Stack requirements section
- Added Quality Gates section
- Templates requiring updates: ✅ all existing templates align with principles
- Follow-up TODOs: none
-->

# SDD Frontend Template Constitution

## Core Principles

### I. Specification-First Development (NON-NEGOTIABLE)
All features MUST begin with complete specifications before implementation. Requirements must be documented in `requirements.md`, technical design in `design.md`, and acceptance criteria in YAML specs. No code shall be written until specifications are approved and complete. This ensures architectural consistency and prevents scope creep.

**Rationale**: Specification-driven development eliminates ambiguity, enables parallel work, and provides clear acceptance criteria for quality assurance.

### II. Contract-First APIs
All API interactions MUST be defined in OpenAPI 3.0+ specifications before implementation. TypeScript types MUST be generated from these contracts using `openapi-typescript`. MSW mocks MUST align exactly to OpenAPI schemas for development and testing.

**Rationale**: Contract-first ensures frontend and backend teams can work independently with guaranteed compatibility, while generated types prevent runtime API errors.

### III. Feature Modularity
Features MUST be organized in self-contained modules under `features/[feature-name]/` with clear boundaries. Each feature module MUST contain its own API layer (`api/queries.ts`), specifications (`spec/`), and be independently testable. No cross-feature dependencies allowed except through well-defined contracts.

**Rationale**: Modular architecture enables independent development, testing, and maintenance while preventing feature entanglement that leads to technical debt.

### IV. Type Safety (NON-NEGOTIABLE)
All code MUST use TypeScript strict mode with no `any` types. Runtime validation MUST use Zod schemas. Query key factories MUST enforce type safety. Form validation MUST be type-safe with proper error handling.

**Rationale**: Type safety catches errors at compile time, improves developer experience with better IDE support, and reduces production bugs.

### V. User-Centric Design
All UI decisions MUST prioritize user experience over developer convenience. Components MUST be responsive (mobile-first), accessible (WCAG 2.1 AA), and follow performance budgets (Core Web Vitals). Loading states, error handling, and empty states are mandatory for all user interactions.

**Rationale**: User experience directly impacts business outcomes. Accessible, performant applications reach wider audiences and provide better conversion rates.

## Technology Stack Requirements

**Mandatory Stack Components**:
- Next.js 14+ with App Router for routing and SSR
- TypeScript strict mode for all application code
- TanStack Query for server state management with query key factories
- Tailwind CSS for styling with mobile-first responsive design
- Zod for runtime validation and schema definition
- MSW for API mocking aligned to OpenAPI contracts

**Testing Requirements**:
- Vitest for unit and component testing with minimum 80% coverage
- Playwright for E2E testing of critical user flows
- Testing Library for component testing with accessibility focus

**Code Generation Tools**:
- `openapi-typescript` for API type generation from OpenAPI specs
- Custom page generators from YAML specifications
- Automated task generation from specifications

## Quality Gates

**Pre-Implementation Gates**:
- Requirements document approved with clear acceptance criteria
- Technical design document completed with architecture decisions
- OpenAPI contracts defined for all API interactions
- UI specifications written in YAML format

**Implementation Gates**:
- TypeScript compilation with zero errors in strict mode
- ESLint passes with zero warnings
- Unit tests achieve minimum 80% coverage
- Component accessibility tests pass
- Performance budgets maintained (Core Web Vitals)

**Pre-Deployment Gates**:
- E2E tests pass for all critical user journeys
- API contract tests validate frontend-backend compatibility
- Security validation completed (XSS protection, input validation)
- Mobile responsiveness verified across device sizes

## Governance

This Constitution supersedes all other development practices and architectural decisions. All feature implementations, code reviews, and technical decisions MUST comply with these principles.

**Amendment Process**: Constitutional changes require documentation of impact analysis, approval from technical leads, and migration plan for existing code. Version increments follow semantic versioning.

**Compliance Review**: All pull requests MUST verify constitutional compliance. Technical debt that violates principles MUST be justified with explicit mitigation plans and timelines.

**Runtime Guidance**: Development teams should reference `.spec-workflow/` for operational guidance and implementation patterns while adhering to constitutional principles.

**Version**: 1.0.0 | **Ratified**: 2025-10-11 | **Last Amended**: 2025-10-11