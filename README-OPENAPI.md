# OpenAPI TypeScript Type Generation

This document explains how to generate TypeScript types from the backend OpenAPI specification.

## Prerequisites

1. Backend server must be running on `http://localhost:8080`
2. OpenAPI documentation endpoint is available at `/api-docs`

## Usage

### Generate types from running backend

```bash
# Make sure backend is running first
cd ../
./mvnw spring-boot:run

# In another terminal, generate types
cd frontend-next
pnpm gen:types
```

This will:
1. Fetch the OpenAPI spec from `http://localhost:8080/api-docs`
2. Generate TypeScript types to `apps/web/lib/types/openapi.d.ts`

### Generate types from static file (alternative)

If you have a static OpenAPI YAML file:

```bash
pnpm gen:types:file
```

This reads from `docs/specs/api/openapi.yaml` instead.

## Generated Types Location

```
apps/web/lib/types/openapi.d.ts
```

## Usage in Code

```typescript
import type { paths, components } from '@/lib/types/openapi';

// Use path types
type ProductsResponse = paths['/api/products']['get']['responses']['200']['content']['application/json'];

// Use component schemas
type ProductDto = components['schemas']['ProductDto'];
```

## Backend OpenAPI Configuration

The backend OpenAPI specification is configured in:
- Configuration: `src/main/java/com/sivalabs/bookstore/config/OpenApiConfig.java`
- Dependency: `springdoc-openapi-starter-webmvc-ui` (in `pom.xml`)
- Endpoints:
  - OpenAPI JSON: `http://localhost:8080/api-docs`
  - Swagger UI: `http://localhost:8080/swagger-ui.html`

## Troubleshooting

### Backend not running

```bash
Error: connect ECONNREFUSED 127.0.0.1:8080
```

**Solution**: Start the backend server:
```bash
cd ..
./mvnw spring-boot:run
```

### OpenAPI endpoint not found

```bash
Error: 404 Not Found
```

**Solution**: Verify the backend is properly configured with Springdoc:
1. Check `pom.xml` contains `springdoc-openapi-starter-webmvc-ui`
2. Access `http://localhost:8080/api-docs` in browser to confirm

### Types not updating

**Solution**: Delete the generated file and regenerate:
```bash
rm apps/web/lib/types/openapi.d.ts
pnpm gen:types
```

## Development Workflow

1. Make changes to backend API
2. Restart backend server
3. Regenerate types: `pnpm gen:types`
4. TypeScript will now recognize the updated API types
