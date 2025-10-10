# Tasks Document

## Phase 1: API Specification and Type Generation

- [x] 1. Update OpenAPI specification with bookstore endpoints
  - File: docs/specs/api/openapi.yaml
  - Add Book, Cart, Order schemas and endpoints
  - Define request/response models with validation rules
  - Purpose: Establish API contract for all bookstore operations
  - _Leverage: Existing openapi.yaml structure and patterns_
  - _Requirements: All requirements (foundation for API contract)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Architect specializing in OpenAPI 3.0 specification design | Task: Update docs/specs/api/openapi.yaml to define complete bookstore API including Book catalog (GET /api/books with pagination), Cart management (POST /api/cart, GET /api/cart, POST /api/cart/update), and Orders (POST /api/orders, GET /api/orders, GET /api/orders/{orderNumber}). Define schemas for Book, BookList, Cart, CartItem, Order, OrderForm with proper validation rules. Reference design.md for complete data models and API design section. | Restrictions: Must follow OpenAPI 3.0.3 specification, maintain existing API patterns, include proper validation constraints (required fields, email format, min/max values), use consistent naming conventions | _Leverage: Existing docs/specs/api/openapi.yaml structure, existing schema patterns | _Requirements: Requirements 1-5 (all API operations) | Success: OpenAPI spec is valid and complete, all endpoints documented with request/response schemas, validation rules properly defined, spec can be used to generate TypeScript types. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 2. Generate TypeScript types from OpenAPI spec
  - File: apps/web/lib/types/openapi.d.ts (generated)
  - Run: pnpm gen:types
  - Verify generated types match design models
  - Purpose: Create type-safe interfaces for all API operations
  - _Leverage: Existing type generation script, openapi-typescript package_
  - _Requirements: All requirements (type safety foundation)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer specializing in type systems and code generation | Task: Run pnpm gen:types command to generate TypeScript types from updated OpenAPI specification. Verify that generated types in apps/web/lib/types/openapi.d.ts include Book, BookList, Cart, CartItem, Order, OrderForm, and all necessary types. Compare generated types against design.md data models section to ensure completeness. If types don't match design, update OpenAPI spec and regenerate. | Restrictions: Do NOT manually edit openapi.d.ts, only modify through OpenAPI spec updates, ensure all data models from design are represented | _Leverage: Existing pnpm gen:types script, openapi-typescript configuration | _Requirements: All requirements (type safety) | Success: Types successfully generated without errors, all data models from design.md are present in generated types, TypeScript compilation succeeds with strict mode. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 2: Infrastructure Layer

- [x] 3. Extend HTTP client with POST method
  - File: apps/web/lib/http.ts
  - Add POST method with JSON body support
  - Maintain error handling consistency with GET
  - Purpose: Enable mutations for cart and order operations
  - _Leverage: Existing GET method implementation, error handling patterns_
  - _Requirements: Requirements 2-4 (cart updates, order submission)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with expertise in HTTP clients and fetch API | Task: Extend apps/web/lib/http.ts to add POST method following the design in design.md "HTTP Client Extension" section. Add POST<T>(path: string, options?: { body?: unknown, headers?: Record<string, string> }): Promise<T> method that sends JSON requests with Content-Type: application/json header, handles request body serialization, and maintains same error handling pattern as existing GET method (throw on non-ok responses). | Restrictions: Must maintain consistency with existing GET method error handling, do NOT modify existing GET method, ensure type safety with generic T parameter, throw descriptive errors on failure | _Leverage: Existing apps/web/lib/http.ts GET method, error handling patterns | _Requirements: Requirements 2, 3, 4 (POST operations for cart and orders) | Success: POST method implemented and working, maintains type safety, error handling consistent with GET, can be used for cart and order mutations. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 4. Create MSW mock handlers for bookstore APIs
  - File: apps/web/mocks/handlers.ts
  - Add handlers for books, cart, and orders endpoints
  - Implement mock logic aligned to OpenAPI spec
  - Purpose: Enable development and testing without backend
  - _Leverage: Existing MSW setup, handler patterns_
  - _Requirements: All requirements (complete API mocking)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Full-stack Developer with expertise in API mocking and MSW | Task: Add MSW handlers to apps/web/mocks/handlers.ts for all bookstore endpoints: GET /api/books (with pagination), POST /api/cart (add to cart), GET /api/cart (get cart), POST /api/cart/update (update quantity), POST /api/orders (create order), GET /api/orders (list orders), GET /api/orders/:orderNumber (order details). Implement mock logic following design.md "MSW Mock Handlers" section. Use sample data matching the sample HTML files (Game of Thrones, Thousand Splendid Suns, Charlotte's Web, etc.). Handlers must return data matching OpenAPI schemas exactly. | Restrictions: Must use http.get, http.post from 'msw', return HttpResponse.json() responses, align data structures to OpenAPI schemas, include proper status codes (200, 201, 400, 404, 500), implement pagination logic for books endpoint | _Leverage: Existing apps/web/mocks/handlers.ts structure, MSW patterns, sample book data from sample/templates/ | _Requirements: All requirements (enables all features) | Success: All API endpoints mocked correctly, responses match OpenAPI schemas, pagination works for books, cart operations update state properly, order creation returns valid order. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 3: Feature API Layer

- [x] 5. Create books feature API layer
  - Files: apps/web/features/books/api/queries.ts
  - Implement query key factory and useBooks hook
  - Add pagination parameter handling
  - Purpose: Provide data fetching for book catalog
  - _Leverage: TanStack Query patterns, query key factory pattern_
  - _Requirements: Requirement 1 (book catalog display)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer specializing in TanStack Query and data fetching | Task: Create apps/web/features/books/api/queries.ts following design.md "State Management" section. Implement bookKeys factory with all(), lists(), list(page, pageSize) methods. Create useBooks(page, pageSize) hook using useQuery that calls client.GET<BookListResponse>. Follow query key factory pattern from existing customer feature. Import types from @/lib/types/openapi. | Restrictions: Must follow query key factory pattern exactly, use TanStack Query useQuery hook, import BookListResponse type from openapi.d.ts, handle pagination parameters correctly, no hardcoded query keys | _Leverage: Existing query patterns from features/customers/api/queries.ts, TanStack Query, query key factory pattern from design.md | _Requirements: Requirement 1 (book catalog) | Success: Query hook fetches books correctly, pagination parameters passed to API, query keys properly structured for caching, TypeScript types enforced. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 6. Create cart feature API layer
  - Files: apps/web/features/cart/api/queries.ts
  - Implement cart query hooks and mutations (add, update)
  - Add query invalidation on mutations
  - Purpose: Provide cart state management
  - _Leverage: TanStack Query useMutation, query invalidation patterns_
  - _Requirements: Requirement 2 (shopping cart management)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in state management and mutations | Task: Create apps/web/features/cart/api/queries.ts following design.md "State Management" section. Implement cartKeys factory, useCart() query hook, useAddToCart() mutation hook (calls POST /api/cart with book code), useUpdateCart() mutation hook (calls POST /api/cart/update with code and quantity). All mutations must invalidate cart queries using queryClient.invalidateQueries(). Import Cart, AddToCartRequest, UpdateCartRequest types from openapi.d.ts. | Restrictions: Must use useMutation for all write operations, invalidate queries on success to trigger refetch, use client.POST method for mutations, follow mutation patterns from TanStack Query docs, include proper error handling | _Leverage: TanStack Query useMutation, useQueryClient, design.md mutation patterns | _Requirements: Requirement 2 (cart operations) | Success: Cart queries and mutations work correctly, cart refetches after mutations, TypeScript types enforced, optimistic updates optional but cache invalidation required. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 7. Create orders feature API layer
  - Files: apps/web/features/orders/api/queries.ts
  - Implement order query hooks and create order mutation
  - Add router navigation on order creation success
  - Purpose: Provide order management operations
  - _Leverage: TanStack Query, Next.js useRouter for navigation_
  - _Requirements: Requirements 3-4 (order creation and history)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in data mutations and routing | Task: Create apps/web/features/orders/api/queries.ts following design.md "State Management" section. Implement orderKeys factory, useOrders() hook (GET /api/orders), useOrder(orderNumber) hook (GET /api/orders/:orderNumber), useCreateOrder() mutation hook (POST /api/orders with OrderFormData). The create order mutation must: invalidate orders and cart queries on success, navigate to /orders page using Next.js useRouter, handle form validation errors. Import Order, OrderFormData types from openapi.d.ts. | Restrictions: Must use useRouter from next/navigation for redirect, invalidate both order and cart queries after order creation, handle both success and error states, follow mutation pattern with onSuccess callback | _Leverage: TanStack Query, Next.js useRouter, design.md mutation patterns | _Requirements: Requirements 3, 4 (order creation and viewing) | Success: Order queries fetch data correctly, create order mutation works with form data, redirects to /orders on success, invalidates relevant queries, error handling in place. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 4: UI Components (Design System)

- [x] 8. Create ProductCard component
  - File: apps/web/design-system/product-card.tsx
  - Display book cover, title, author, price, Buy button
  - Use Next.js Image component for cover optimization
  - Purpose: Reusable book display component
  - _Leverage: Next.js Image component, Tailwind card styling_
  - _Requirements: Requirement 1 (book catalog display)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in React components and responsive design | Task: Create apps/web/design-system/product-card.tsx component following design.md "Component 2: ProductCard" specification. Component accepts ProductCardProps { book: Book, onBuy: (code: string) => void }. Display book cover using Next.js Image component with lazy loading, show title (truncate if long with tooltip), author, price formatted as $XX.XX, and Buy button. Use Tailwind CSS card styling matching sample/templates/partials/products.html design (card with image on top, card-body with title/price, card-footer with button). | Restrictions: Must use Next.js Image from next/image, make button accessible with aria-label, use Tailwind classes only (no custom CSS), handle long titles with CSS truncation, format price to 2 decimals | _Leverage: Next.js Image component, Tailwind CSS, sample HTML design from sample/templates/partials/products.html | _Requirements: Requirement 1 (book display) | Success: Component renders book correctly, images optimized with lazy loading, Buy button triggers onBuy callback, responsive design works on mobile/desktop, accessible with proper ARIA labels. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 9. Create ProductGrid component
  - File: apps/web/design-system/product-grid.tsx
  - Arrange ProductCards in responsive 5-column grid
  - Handle loading state with skeleton UI
  - Purpose: Display book catalog grid layout
  - _Leverage: ProductCard component, Tailwind CSS grid utilities_
  - _Requirements: Requirement 1 (book catalog layout)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with expertise in responsive grid layouts | Task: Create apps/web/design-system/product-grid.tsx component following design.md "Component 1: ProductGrid" specification. Component accepts ProductGridProps { books: Book[], onBuy: (code: string) => void, loading?: boolean }. Use Tailwind CSS grid to create responsive layout: 5 columns on desktop (lg:grid-cols-5), 3 on tablet (md:grid-cols-3), 1 on mobile. Map over books array and render ProductCard for each book. Show skeleton loading state when loading=true (use gray placeholder cards). Match design from sample/templates/partials/products.html (row with multiple cards). | Restrictions: Must use Tailwind grid utilities (grid, grid-cols-*), pass onBuy handler to all ProductCard instances, implement responsive breakpoints correctly, loading state should show 5 skeleton cards | _Leverage: ProductCard component, Tailwind CSS grid, sample HTML grid structure | _Requirements: Requirement 1 (book catalog grid) | Success: Books displayed in responsive grid, 5 columns on desktop, responsive on all screen sizes, loading state shows skeletons, ProductCard receives correct props. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 10. Create Pagination component
  - File: apps/web/design-system/pagination.tsx
  - Implement First/Previous/Next/Last navigation controls
  - Disable buttons at boundaries (first/last page)
  - Purpose: Navigate through paginated book catalog
  - _Leverage: Tailwind button styling, accessibility best practices_
  - _Requirements: Requirement 1 (pagination controls)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in navigation and UI controls | Task: Create apps/web/design-system/pagination.tsx component following design.md "Component 3: Pagination" specification. Component accepts PaginationProps { currentPage: number, totalPages: number, onPageChange: (page: number) => void }. Render 4 buttons: First, Previous, Next, Last. Disable First and Previous when currentPage === 1, disable Next and Last when currentPage === totalPages. Match design from sample/templates/partials/pagination.html. Include current page indicator between controls. | Restrictions: Must disable buttons appropriately at boundaries, use semantic button elements, include aria-disabled for disabled state, use Tailwind for styling (btn, btn-primary, disabled:opacity-50), make keyboard accessible | _Leverage: Tailwind button utilities, sample HTML pagination design from sample/templates/partials/pagination.html | _Requirements: Requirement 1 (pagination) | Success: Pagination controls work correctly, buttons disabled at boundaries, page navigation triggers onPageChange callback, keyboard accessible, visually matches sample design. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 11. Create CartTable component
  - File: apps/web/design-system/cart-table.tsx
  - Display cart items with quantity input and totals
  - Handle empty cart and loading states
  - Purpose: Show cart contents and allow quantity updates
  - _Leverage: HTML table elements, Tailwind table styling_
  - _Requirements: Requirement 2 (cart display and updates)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with expertise in forms and data tables | Task: Create apps/web/design-system/cart-table.tsx component following design.md "Component 4: CartTable" specification. Component accepts CartTableProps { cart: Cart | null, onQuantityChange: (code: string, quantity: number) => void, loading?: boolean }. Display table with columns: Product Name, Price, Quantity (with number input), Sub Total. Calculate subtotal as price × quantity. Show total amount below table. Handle three states: loading (show spinner), cart is null (show "We couldn't load your cart"), cart.item is null (show "Your cart is empty"). Match design from sample/templates/partials/cart.html exactly. | Restrictions: Must use semantic HTML table (table, thead, tbody, tfoot), quantity input type="number" with min="1", calculate subtotal correctly, format prices as $XX.XX, handle all three states (loading, error, empty), make quantity input trigger onQuantityChange on change | _Leverage: Tailwind table classes, sample HTML cart design from sample/templates/partials/cart.html | _Requirements: Requirement 2 (cart display and quantity management) | Success: Cart displays correctly with all columns, quantity input updates trigger callback, calculations correct, empty and error states display appropriate messages, matches sample design. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 12. Create OrderForm component
  - File: apps/web/design-system/order-form.tsx
  - Implement customer info form with validation
  - Display inline validation errors
  - Purpose: Collect shipping information and submit orders
  - _Leverage: Zod validation, Tailwind form styling_
  - _Requirements: Requirement 3 (order form and checkout)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in forms and validation | Task: Create apps/web/design-system/order-form.tsx component following design.md "Component 5: OrderForm" specification and "Form Validation" section. Component accepts OrderFormProps { onSubmit: (data: OrderFormData) => Promise<void>, loading?: boolean }. Create form with fields: Customer Name (text, required), Customer Email (email, required), Customer Phone (text, required), Delivery Address (text, required). Use Zod schema from design.md for validation. Display inline errors below fields with red text and red border on invalid inputs (class="is-invalid" or "border-red-500"). Show required asterisk (*) on labels. Match design from sample/templates/partials/order-form.html exactly. | Restrictions: Must validate with Zod on submit, display field-level errors inline, mark required fields with asterisks, use HTML5 input types (email for email field), prevent submission if validation fails, show loading state on submit button, ensure accessibility (aria-required, aria-invalid, aria-describedby for errors) | _Leverage: Zod validation library, Tailwind form utilities, sample HTML form design from sample/templates/partials/order-form.html | _Requirements: Requirement 3 (order form with validation) | Success: Form validates correctly with Zod, inline errors display for invalid fields, email format validation works, form submission triggers onSubmit callback with validated data, accessible with proper ARIA attributes, matches sample design. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 5: Page Implementation

- [x] 13. Create UI spec for books page
  - File: apps/web/features/books/spec/page.book-list.yml
  - Define page structure, data source, view configuration
  - Include filters and pagination settings
  - Purpose: Specification for book catalog page generation
  - _Leverage: Existing YAML spec patterns from customer-list example_
  - _Requirements: Requirement 1 (book catalog specification)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Product Designer with expertise in YAML specifications and UI design | Task: Create apps/web/features/books/spec/page.book-list.yml following the YAML UI specification format from CLAUDE.md "UI Specification Format" section. Define: page: "BookList", route: "/books", layout with title "Books" and actions (empty for now), data source: "GET /api/books", queryKey: ["books", "list"], pagination: server, view type: grid (not table), columns: code, name, author, price, imageUrl. Include requirements section with accessibility and lighthouse targets. Reference existing page.customer-list.yml as pattern but adapt for books feature. | Restrictions: Must follow YAML spec format exactly, use correct route path, specify server pagination, define all book fields, include accessibility requirements from NFRs | _Leverage: Existing apps/web/features/customers/spec/page.customer-list.yml as template, CLAUDE.md UI spec format | _Requirements: Requirement 1 (book catalog) | Success: YAML spec is valid and complete, follows project format, includes all necessary fields for book display, can be used with pnpm gen:page command. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [x] 14. Generate and implement books page
  - File: apps/web/app/books/page.tsx
  - Run: pnpm gen:page (select book-list spec)
  - Enhance generated code with ProductGrid, Pagination
  - Purpose: Book catalog browsing page
  - _Leverage: Generated page skeleton, useBooks hook, ProductGrid, Pagination components_
  - _Requirements: Requirement 1 (complete book catalog feature)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in Next.js pages and data fetching | Task: Run pnpm gen:page and select book-list spec to generate initial page skeleton at apps/web/app/books/page.tsx. Enhance generated code following design.md page implementation patterns. Use useBooks hook from features/books/api/queries.ts with pagination state (useState for currentPage). Import ProductGrid and Pagination components. Implement handleBuy function that calls useAddToCart mutation and redirects to /cart on success. Handle loading, error, and empty states. Use "use client" directive for client component. Reference requirements.md Requirement 1 for complete acceptance criteria. | Restrictions: Start with generated skeleton (do not write from scratch), must use useBooks hook for data fetching, implement pagination state with useState, handle all states (loading, error, empty, success), redirect to /cart after adding item using Next.js useRouter | _Leverage: Generated page skeleton from pnpm gen:page, useBooks hook, ProductGrid and Pagination components, useAddToCart mutation | _Requirements: Requirement 1 (book catalog with pagination and buy functionality) | Success: Page displays book catalog in grid, pagination works correctly, Buy button adds to cart and redirects, loading and error states handled, meets all Requirement 1 acceptance criteria. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 15. Create UI spec for cart page
  - File: apps/web/features/cart/spec/page.cart.yml
  - Define cart display and order form layout
  - Specify data sources for cart and order submission
  - Purpose: Specification for cart and checkout page
  - _Leverage: YAML spec format patterns_
  - _Requirements: Requirements 2-3 (cart and order form specification)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Product Designer with expertise in checkout flow design | Task: Create apps/web/features/cart/spec/page.cart.yml following YAML UI specification format. Define: page: "Cart", route: "/cart", layout with title "Shopping Cart", data sources: GET /api/cart for cart data and POST /api/orders for form submission, queryKey: ["cart", "current"], view type: custom (cart table + order form), include form fields: customer.name, customer.email, customer.phone, deliveryAddress. Document that page shows cart table above and order form below (only when cart has items). Include accessibility requirements for form validation. | Restrictions: Must specify both cart data source and order submission endpoint, include all form fields from requirements, document conditional display of form (only if cart not empty), include validation requirements | _Leverage: YAML spec format from CLAUDE.md, requirements.md Requirements 2-3 | _Requirements: Requirements 2, 3 (cart and order form) | Success: YAML spec is complete with cart and form specifications, includes all required fields, documents conditional rendering logic, specifies validation requirements. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 16. Generate and implement cart page
  - File: apps/web/app/cart/page.tsx
  - Run: pnpm gen:page (select cart spec)
  - Integrate CartTable and OrderForm components
  - Purpose: Cart review and order placement page
  - _Leverage: Generated skeleton, useCart, useUpdateCart, useCreateOrder hooks, CartTable, OrderForm_
  - _Requirements: Requirements 2-3 (complete cart and checkout features)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in checkout flows and form handling | Task: Run pnpm gen:page and select cart spec to generate apps/web/app/cart/page.tsx skeleton. Enhance code to implement complete cart and checkout flow. Use useCart hook to fetch cart data, useUpdateCart mutation for quantity changes, useCreateOrder mutation for order submission. Import CartTable and OrderForm components. Show CartTable at top with cart data and handleQuantityChange callback. Show OrderForm below CartTable only if cart.item is not null (conditional rendering). OrderForm onSubmit calls createOrder mutation. Handle all states from requirements.md Requirement 2 acceptance criteria (empty cart, failed load, items present). Use "use client" directive. | Restrictions: Must use useCart, useUpdateCart, useCreateOrder hooks, conditionally render OrderForm only when cart has items, handle empty cart state with link back to /books, handle cart load failure, implement quantity update with debouncing (optional) or immediate update | _Leverage: Generated skeleton, useCart/useUpdateCart/useCreateOrder hooks, CartTable and OrderForm components, requirements.md Requirements 2-3 acceptance criteria | _Requirements: Requirements 2, 3 (cart management and order submission) | Success: Page displays cart correctly, quantity updates work, order form appears when cart has items, form submission creates order and redirects to /orders, empty and error states handled correctly, meets all acceptance criteria. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 17. Create UI spec for orders list page
  - File: apps/web/features/orders/spec/page.order-list.yml
  - Define orders table with Order ID and Status columns
  - Specify data source and view configuration
  - Purpose: Specification for order history page
  - _Leverage: YAML spec patterns, similar to customer-list_
  - _Requirements: Requirement 4 (order history specification)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Product Designer with expertise in data table specifications | Task: Create apps/web/features/orders/spec/page.order-list.yml following YAML UI specification format. Define: page: "OrderList", route: "/orders", layout with title "All Orders", data source: "GET /api/orders", queryKey: ["orders", "list"], pagination: none (for MVP), view type: table, columns: orderNumber (with link to detail page), status. Include requirements for clickable order numbers that navigate to /orders/{orderNumber}. Include error handling for failed load. Reference page.customer-list.yml as pattern. | Restrictions: Must follow YAML table spec format, specify both columns (orderNumber and status), document that orderNumber should be linkable to detail page, include error handling requirements | _Leverage: Existing page.customer-list.yml pattern, YAML spec format | _Requirements: Requirement 4 (order history viewing) | Success: YAML spec defines orders table correctly, includes link functionality for order numbers, specifies error handling, follows project format. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 18. Generate and implement orders list page
  - File: apps/web/app/orders/page.tsx
  - Run: pnpm gen:page (select order-list spec)
  - Use DataTable component with custom cell renderer for links
  - Purpose: Display list of all orders
  - _Leverage: Generated skeleton, useOrders hook, existing DataTable component_
  - _Requirements: Requirement 4 (order history display)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in data tables and routing | Task: Run pnpm gen:page and select order-list spec to generate apps/web/app/orders/page.tsx skeleton. Enhance code to use useOrders hook from features/orders/api/queries.ts. Import DataTable component from design-system. Configure columns: orderNumber (render as Next.js Link to /orders/{orderNumber}), status (render as text). Handle loading state (pass to DataTable), handle error state (show error alert), handle empty state (show "No orders yet" message). Use "use client" directive. Reference requirements.md Requirement 4 acceptance criteria. | Restrictions: Must reuse existing DataTable component, customize orderNumber column to render as clickable link using Next.js Link component, handle all states (loading, error, empty, success), display orders in reverse chronological order (handled by API) | _Leverage: Generated skeleton, useOrders hook, existing DataTable component from design-system, Next.js Link | _Requirements: Requirement 4 (order list with clickable order numbers) | Success: Orders display in table, order numbers are clickable links to detail page, status column shows order status, loading and error states handled, empty state displays message, meets Requirement 4 acceptance criteria. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 19. Implement order details page
  - File: apps/web/app/orders/[orderNumber]/page.tsx
  - Create dynamic route page for order details
  - Display full order information
  - Purpose: Show detailed order information
  - _Leverage: useOrder hook, Next.js dynamic routes_
  - _Requirements: Requirement 4 (order details viewing)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in Next.js dynamic routes | Task: Create apps/web/app/orders/[orderNumber]/page.tsx as Next.js dynamic route page. Extract orderNumber from params prop. Use useOrder(orderNumber) hook from features/orders/api/queries.ts to fetch order details. Display order information: order number, status, customer name/email/phone, delivery address, items (product name, quantity, price), total amount, created date. Handle loading state (spinner), 404 state (order not found - show message with link back to /orders), error state (show error message). Use "use client" directive. Format dates and currency appropriately. | Restrictions: Must use Next.js dynamic route with [orderNumber] folder, extract orderNumber from params, use useOrder hook, handle 404 case (order not found), format currency as $XX.XX, make customer info and address easily readable | _Leverage: useOrder hook, Next.js dynamic routes, Date and Number formatting | _Requirements: Requirement 4 (order details page) | Success: Page displays complete order details, handles dynamic orderNumber parameter, 404 case shows appropriate message, loading and error states handled, customer info and items displayed clearly. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 20. Enhance root layout with site header
  - File: apps/web/app/layout.tsx
  - Add navigation header with BookStore branding and Orders link
  - Maintain existing QueryClientProvider
  - Purpose: Global navigation across all pages
  - _Leverage: Existing layout structure, Next.js Link component_
  - _Requirements: Requirement 5 (navigation and site header)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in layouts and navigation | Task: Enhance apps/web/app/layout.tsx to add site header navigation. Create header component (can be inline or separate component) with BookStore logo/text (links to /) and Orders link (links to /orders). Use dark background (bg-gray-900 or similar) with white text matching sample/templates/layout.html design. Place header before {children} in layout. Maintain existing QueryClientProvider and other providers. Header should be sticky or fixed at top (optional). Use Next.js Link for navigation. | Restrictions: Do NOT remove existing providers (QueryClientProvider), add header within existing structure, use Next.js Link for navigation (not anchor tags), match styling from sample HTML header (dark background, white text), make header responsive | _Leverage: Existing apps/web/app/layout.tsx structure, Next.js Link, Tailwind utilities, sample HTML header from sample/templates/layout.html | _Requirements: Requirement 5 (site navigation) | Success: Header appears on all pages, BookStore logo links to home, Orders link navigates to orders page, styling matches sample design, responsive on mobile/desktop, maintains existing layout functionality. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 21. Update homepage to redirect to books
  - File: apps/web/app/page.tsx
  - Redirect to /books page
  - Purpose: Set book catalog as landing page
  - _Leverage: Next.js redirect function_
  - _Requirements: Requirement 1 (default landing page)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer with expertise in Next.js routing | Task: Update apps/web/app/page.tsx to redirect to /books page. Use Next.js redirect function from next/navigation. This can be a simple server component that immediately redirects: import { redirect } from 'next/navigation'; export default function HomePage() { redirect('/books') }. Alternatively, use client-side redirect with useRouter and useEffect, but server-side redirect is preferred for SEO. | Restrictions: Use Next.js redirect function (not window.location), make it immediate (no delay), clean implementation (minimal code) | _Leverage: Next.js redirect from next/navigation | _Requirements: Requirement 1 (homepage redirects to book catalog) | Success: Visiting root path (/) redirects immediately to /books, no flash of content, clean implementation. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 6: Testing

- [ ] 22. Write unit tests for query key factories
  - File: apps/web/features/books/api/queries.test.ts (and cart, orders)
  - Test query key generation for all features
  - Verify key structure matches design patterns
  - Purpose: Ensure correct cache key generation
  - _Leverage: Vitest, existing test patterns_
  - _Requirements: All requirements (testing foundation)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer specializing in unit testing and TanStack Query | Task: Create unit test files for query key factories: apps/web/features/books/api/queries.test.ts, apps/web/features/cart/api/queries.test.ts, apps/web/features/orders/api/queries.test.ts. Test that query key factory functions return correct array structures. For example, bookKeys.list(1, 10) should return ['books', 'list', { page: 1, pageSize: 10 }]. Test all factory methods for each feature. Use Vitest as test framework. Keep tests simple and focused on return values. | Restrictions: Test only query key factory functions (not actual hooks), use Vitest describe/it/expect syntax, no need to mock API calls (not testing hooks), verify array structure and values | _Leverage: Vitest, query key factories from features/*/api/queries.ts | _Requirements: All (query key testing) | Success: All query key factories tested, tests verify correct array structures, tests pass with pnpm test command. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 23. Write component tests for ProductCard and CartTable
  - Files: apps/web/design-system/product-card.test.tsx, cart-table.test.tsx
  - Test component rendering and user interactions
  - Verify callbacks are triggered correctly
  - Purpose: Ensure UI components work correctly
  - _Leverage: Vitest, @testing-library/react, @testing-library/user-event_
  - _Requirements: Requirements 1-2 (component testing)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend QA Engineer with expertise in React component testing | Task: Create component test files using Vitest and @testing-library/react. For product-card.test.tsx: test that book title, author, price display correctly, Buy button is present, clicking Buy triggers onBuy callback. For cart-table.test.tsx: test cart items display, quantity input shows correct value, changing quantity triggers onQuantityChange, empty state shows correct message, total amount calculates correctly. Use userEvent for simulating interactions. Mock Next.js Image component if needed. | Restrictions: Use @testing-library/react render and screen, use userEvent for interactions (not fireEvent), test user-visible behavior (not implementation details), mock external dependencies (Image component) | _Leverage: Vitest, @testing-library/react, @testing-library/user-event, existing test patterns | _Requirements: Requirements 1, 2 (ProductCard and CartTable testing) | Success: Component tests pass, interactions trigger correct callbacks, empty states tested, tests are maintainable and follow testing-library best practices. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 24. Write E2E test for complete checkout flow
  - File: apps/web/e2e/checkout.spec.ts
  - Test full user journey: browse → buy → cart → order
  - Verify order appears in order list
  - Purpose: Validate critical business flow end-to-end
  - _Leverage: Playwright, MSW mocked APIs_
  - _Requirements: All requirements (E2E validation)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Automation Engineer with expertise in Playwright E2E testing | Task: Create apps/web/e2e/checkout.spec.ts to test complete checkout flow. Test steps: 1) Navigate to /books 2) Verify book catalog displays 3) Click Buy button on first book 4) Verify redirect to /cart 5) Verify cart shows book item 6) Update quantity to 2 7) Verify total recalculates 8) Fill order form (name, email, phone, address) 9) Click Place Order 10) Verify redirect to /orders 11) Verify order appears in list. Use Playwright assertions (expect(page).toHaveURL, expect(page).toContainText, etc.). Test runs against MSW mocked APIs (no real backend needed). | Restrictions: Must test complete flow from start to finish, use Playwright page object pattern if complex, run against dev server with MSW enabled, verify each step before proceeding, use data-testid attributes if needed for stable selectors | _Leverage: Playwright, MSW mocked APIs, existing e2e test patterns | _Requirements: All requirements (complete checkout flow) | Success: E2E test covers complete user journey, test passes consistently, verifies all critical steps, runs in CI/CD pipeline with pnpm test:e2e. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

## Phase 7: Quality Assurance and Documentation

- [ ] 25. Run TypeScript type checking
  - Command: pnpm typecheck
  - Fix any type errors across the codebase
  - Verify strict mode compliance
  - Purpose: Ensure type safety throughout
  - _Leverage: TypeScript compiler, strict mode config_
  - _Requirements: NFR - Code quality (type safety)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer with expertise in type systems | Task: Run pnpm typecheck command and fix any TypeScript errors. Verify that all components, hooks, and utilities have proper type annotations. Ensure no `any` types are used (except in generated openapi.d.ts). Fix type errors by adding proper type annotations, importing correct types from openapi.d.ts, or refactoring code to be type-safe. Verify strict mode is enabled in tsconfig.json and all files comply. | Restrictions: Must achieve zero TypeScript errors, do NOT use `any` type as quick fix (use proper types), do NOT disable strict mode checks, import types from openapi.d.ts where appropriate | _Leverage: TypeScript compiler, generated types from openapi.d.ts, tsconfig strict mode | _Requirements: NFR - Type safety | Success: pnpm typecheck passes with zero errors, no `any` types in application code, strict mode enabled and compliant. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 26. Run ESLint and fix violations
  - Command: pnpm lint
  - Fix linting errors and warnings
  - Ensure code style consistency
  - Purpose: Maintain code quality standards
  - _Leverage: ESLint config, Next.js recommended rules_
  - _Requirements: NFR - Code quality (linting)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with expertise in code quality and linting | Task: Run pnpm lint command and fix all ESLint errors and warnings. Address issues such as: unused imports, unused variables, missing dependencies in useEffect, incorrect hook usage, accessibility issues (missing alt text, aria labels), Next.js specific warnings. Use eslint --fix for auto-fixable issues, manually fix remaining problems. Ensure all components follow React best practices and Next.js conventions. | Restrictions: Must achieve zero ESLint errors, aim for zero warnings (acceptable if unavoidable), do NOT disable ESLint rules without good reason, fix root cause not symptoms | _Leverage: ESLint configuration, Next.js recommended rules | _Requirements: NFR - Code quality standards | Success: pnpm lint passes with zero errors, minimal or zero warnings, code follows consistent style, React and Next.js best practices followed. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 27. Run all tests and verify coverage
  - Command: pnpm test
  - Ensure all unit and component tests pass
  - Verify >80% code coverage target
  - Purpose: Validate all features work correctly
  - _Leverage: Vitest, coverage reporting_
  - _Requirements: NFR - Testing requirements_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in test coverage and quality metrics | Task: Run pnpm test command to execute all unit and component tests. Verify all tests pass. Check coverage report (text and HTML output) to ensure >80% coverage for business logic (query key factories, mutations, component interactions). If coverage is below target, add missing tests for uncovered code paths. Focus on critical business logic: cart calculations, form validation, API mutations. Review HTML coverage report to identify gaps. | Restrictions: Must achieve >80% coverage for business logic code, all tests must pass, do NOT write trivial tests just to increase coverage (test meaningful behavior), focus coverage on feature code not framework code | _Leverage: Vitest coverage reporting (text + HTML), existing test utilities | _Requirements: NFR - 80% test coverage target | Success: pnpm test passes all tests, coverage report shows >80% for business logic, HTML coverage report generated, critical paths fully tested. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 28. Run E2E tests in production build
  - Commands: pnpm build && pnpm start & pnpm test:e2e
  - Test checkout flow in production environment
  - Verify build output and runtime behavior
  - Purpose: Ensure production readiness
  - _Leverage: Playwright, Next.js production build_
  - _Requirements: NFR - Testing, All requirements (production validation)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with expertise in CI/CD and production testing | Task: Build production bundle with pnpm build command. Start production server with pnpm start (runs in background). Run E2E tests with pnpm test:e2e against production build. Verify that checkout flow test passes in production environment. Check for any production-specific issues (missing env vars, build optimization issues, runtime errors). Stop production server after tests complete. Review build output for warnings or issues. | Restrictions: Must test against production build (not dev server), ensure build completes successfully without errors, verify MSW works in production mode, check bundle size is reasonable | _Leverage: Next.js production build, Playwright E2E tests, pnpm scripts | _Requirements: All requirements (production validation) | Success: Production build completes successfully, pnpm start runs without errors, E2E tests pass against production build, no runtime errors in production mode. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 29. Test accessibility with automated tools
  - Run Lighthouse accessibility audit
  - Test keyboard navigation on all pages
  - Verify screen reader compatibility
  - Purpose: Ensure WCAG 2.1 Level AA compliance
  - _Leverage: Lighthouse, browser DevTools, keyboard testing_
  - _Requirements: NFR - Accessibility (WCAG 2.1 Level AA)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Accessibility Specialist with expertise in WCAG compliance | Task: Test accessibility across all pages (books, cart, orders). Run Lighthouse accessibility audit in Chrome DevTools for each page, target 100 score. Test keyboard navigation: Tab through all interactive elements (buttons, links, form inputs), verify focus visible, ensure logical tab order, verify form can be submitted with Enter key. Test form validation error announcements. Verify images have alt text, form inputs have labels, buttons have aria-labels where needed. Document any accessibility issues found and fix them. | Restrictions: Must achieve Lighthouse accessibility score of 100 on all pages, all interactive elements must be keyboard accessible, focus indicators must be visible, form errors must be announced to screen readers, semantic HTML required | _Leverage: Lighthouse in Chrome DevTools, keyboard testing, design.md accessibility section | _Requirements: NFR - WCAG 2.1 Level AA compliance | Success: Lighthouse accessibility score 100 on all pages, complete keyboard navigation works, focus indicators visible, form validation accessible, semantic HTML used throughout. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 30. Test responsive design on multiple devices
  - Test layouts on mobile (320px+), tablet, desktop
  - Verify touch targets are 44x44px on mobile
  - Test all features work on different screen sizes
  - Purpose: Ensure mobile-first responsive design
  - _Leverage: Browser DevTools responsive mode, device emulation_
  - _Requirements: NFR - Usability (mobile-first design)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend QA Engineer with expertise in responsive design testing | Task: Test all pages on multiple screen sizes using Chrome DevTools responsive mode. Test breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1920px (large desktop). Verify: book grid adjusts columns responsively (1 on mobile, 3 on tablet, 5 on desktop), navigation header stacks or collapses on mobile, cart table scrolls or adjusts on mobile, order form fields stack vertically on mobile, buttons are min 44x44px on mobile (touch-friendly). Test landscape and portrait orientations on mobile. Document and fix any layout issues. | Restrictions: Must test at minimum 320px width (smallest mobile), verify touch targets ≥44x44px on mobile, ensure no horizontal scrolling unless intentional, test both portrait and landscape | _Leverage: Chrome DevTools responsive mode, Tailwind responsive classes | _Requirements: NFR - Mobile-first responsive design | Success: All pages work correctly on mobile (320px+), tablet, and desktop, book grid responsive, touch targets adequate on mobile, no layout breaking issues. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 31. Performance testing and optimization
  - Run Lighthouse performance audit
  - Check bundle size and optimize if needed
  - Verify image optimization with Next.js Image
  - Purpose: Meet performance NFRs (LCP <2.5s, FID <100ms)
  - _Leverage: Lighthouse, Next.js built-in optimizations_
  - _Requirements: NFR - Performance requirements_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Performance Engineer with expertise in web performance optimization | Task: Run Lighthouse performance audit on all pages. Target scores: Performance >90, First Contentful Paint <1.5s, Largest Contentful Paint <2.5s, Time to Interactive <3s, Cumulative Layout Shift <0.1. Verify Next.js Image components are used for all book covers with lazy loading enabled. Check bundle size in build output, ensure JavaScript bundle <200KB gzipped. If performance issues found: optimize images, implement code splitting, reduce bundle size, add loading skeletons to reduce CLS. Test on simulated 3G network (Chrome DevTools throttling). | Restrictions: Must achieve Lighthouse Performance score >90, meet Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1), use Next.js Image for all images, test on throttled network | _Leverage: Lighthouse, Next.js Image optimization, Next.js automatic code splitting | _Requirements: NFR - Performance (Core Web Vitals, page load <2s on 3G) | Success: Lighthouse Performance >90 on all pages, Core Web Vitals met, bundle size reasonable, images optimized with lazy loading, pages load in <2s on 3G. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._

- [ ] 32. Final integration testing and bug fixes
  - Manually test complete user flows across all pages
  - Fix any bugs or issues discovered
  - Verify all requirements are met
  - Purpose: Final validation before completion
  - _Leverage: Manual testing, requirements document_
  - _Requirements: All requirements (final validation)_
  - _Prompt: Implement the task for spec online-bookstore, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Senior QA Engineer with expertise in integration testing | Task: Perform comprehensive manual testing of entire bookstore application. Test flows: 1) Browse books with pagination, 2) Add book to cart and verify redirect, 3) Update cart quantity and verify total recalculation, 4) Submit order form with valid data, 5) Submit order form with invalid data and verify errors, 6) View orders list and click order number, 7) View order details page. Verify each acceptance criteria from requirements.md Requirements 1-5 is met. Document any bugs in a list, fix all critical bugs, verify fixes. Test edge cases: empty cart, no orders, network errors (temporarily break MSW handlers), form validation errors. | Restrictions: Must test all acceptance criteria from requirements.md systematically, fix all critical bugs before completion, test both happy path and error scenarios, verify all user-facing messages are clear | _Leverage: requirements.md acceptance criteria, manual testing checklist | _Requirements: All requirements (final validation against acceptance criteria) | Success: All requirements acceptance criteria validated and met, all critical bugs fixed, edge cases handled gracefully, user experience is smooth and intuitive. First, mark this task as in-progress in .spec-workflow/specs/online-bookstore/tasks.md by changing [ ] to [-]. After completing the task, mark it as complete by changing [-] to [x]._
