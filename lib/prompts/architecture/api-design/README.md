# API Design Best Practices Prompt

Expert guidance on REST and GraphQL API design following industry standards.

## Overview

This prompt provides comprehensive API design recommendations covering REST and GraphQL patterns, naming conventions, versioning strategies, security considerations, and scalability best practices. It analyzes your endpoint designs and provides actionable improvements aligned with industry standards.

## Installation

```bash
# Install via CLI (once available)
hitl install prompt/api-design

# Or copy directly
cp -r lib/prompts/architecture/api-design ~/.claude/prompts/
```

## Usage

### Input Variables

| Variable                | Required | Description                                      |
| ----------------------- | -------- | ------------------------------------------------ |
| `api_type`              | Yes      | The type of API: "REST", "GraphQL", or "both"    |
| `endpoints`             | Yes      | List of endpoints or operations to design/review |
| `business_requirements` | No       | Business context and requirements for the API    |
| `existing_design`       | No       | Existing API design to review (optional)         |

### Example Usage

```yaml
api_type: REST
endpoints: |
  - User registration
  - User login
  - Get user profile
  - Update user profile
business_requirements: |
  Building a user management system for a SaaS application.
  Need to support OAuth and API key authentication.
```

## Before/After Examples

### Example 1: REST User Management API

#### ❌ Before (Poor Design)

```http
POST /createUser
GET /getUser?id=123
POST /updateUser
DELETE /deleteUserAccount
POST /loginUser
POST /refreshToken
```

**Problems:**

- ❌ Verbs in URLs (`createUser`, `getUser`, `updateUser`)
- ❌ Inconsistent patterns (some use query params, some don't)
- ❌ Missing proper HTTP method usage
- ❌ No versioning strategy
- ❌ Unclear resource hierarchy
- ❌ Missing GDPR considerations

#### ✅ After (Following Best Practices)

**Endpoint Design:**

```http
POST   /v1/users                    # Register new user
POST   /v1/auth/login               # Authenticate user
GET    /v1/users/{id}               # Get user profile
PATCH  /v1/users/{id}               # Update user profile
DELETE /v1/users/{id}               # Delete user account (GDPR)
POST   /v1/auth/refresh             # Refresh access token
POST   /v1/auth/logout              # Revoke tokens
```

**Key Improvements:**

- ✅ Use `PATCH` instead of `PUT` for profile updates (allows partial updates)
- ✅ Separate `/auth` namespace for authentication operations
- ✅ Include token refresh endpoint for security
- ✅ User ID in path, not query parameter
- ✅ Plural resource names (`/users` not `/user`)
- ✅ URL versioning (`/v1/`) for clarity

**Security Recommendations:**

- **Authentication**: JWT access tokens (15 min expiry) + refresh tokens (7 days)
- **Rate Limiting**:
  - Registration: 3 attempts per IP per hour
  - Login: 5 failed attempts per user per 15 minutes
  - Profile operations: 100 requests per user per minute
- **Input Validation**:
  - Email: RFC 5322 format validation
  - Password: Min 12 chars, require uppercase, lowercase, number, special char
  - Profile updates: Whitelist allowed fields
- **GDPR Compliance**:
  - DELETE endpoint performs hard delete + anonymization
  - Audit log retention policy

**Sample Request/Response:**

```http
POST /v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd123",
  "firstName": "Jane",
  "lastName": "Doe"
}

Response: 201 Created
{
  "data": {
    "id": "usr_1a2b3c4d",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "isVerified": false
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

---

### Example 2: GraphQL E-Commerce API

#### ❌ Before (Poor Design)

```graphql
type Query {
  products: [Product]
  product(id: ID): Product
}

type Mutation {
  addToCart(productId: ID, qty: Int): Cart
  checkout(cartId: ID): Order
}

type Product {
  id: ID
  name: String
  price: Float
}
```

**Problems:**

- ❌ No pagination support (returns all products)
- ❌ Missing error handling in mutations
- ❌ Inline mutation arguments (not scalable)
- ❌ Nullable fields that should be required
- ❌ No filtering or sorting capabilities
- ❌ Missing input validation (qty could be negative)
- ❌ Oversimplified types (price needs currency)

#### ✅ After (Following Best Practices)

**Schema Design:**

```graphql
# Queries
type Query {
  products(
    filter: ProductFilter
    sort: ProductSort
    first: Int = 20
    after: String
  ): ProductConnection!

  product(id: ID!): Product
  cart(id: ID!): Cart
}

# Mutations
type Mutation {
  addToCart(input: AddToCartInput!): AddToCartPayload!
  removeFromCart(input: RemoveFromCartInput!): RemoveFromCartPayload!
  updateCartItem(input: UpdateCartItemInput!): UpdateCartItemPayload!
  checkout(input: CheckoutInput!): CheckoutPayload!
}

# Types
type Product {
  id: ID!
  name: String!
  description: String
  price: Money!
  images: [Image!]!
  inStock: Boolean!
  inventory: Int!
}

type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ProductEdge {
  node: Product!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Money {
  amount: Float!
  currency: String!
}

# Input types
input ProductFilter {
  category: String
  priceMin: Float
  priceMax: Float
  inStockOnly: Boolean
}

input AddToCartInput {
  cartId: ID
  productId: ID!
  quantity: Int! @constraint(min: 1, max: 99)
}

# Payload types (return errors + data)
type AddToCartPayload {
  cart: Cart
  errors: [UserError!]
}

type UserError {
  field: String
  message: String!
  code: String!
}
```

**Key Improvements:**

- ✅ **Pagination**: Use Connection pattern (Relay spec) for scalability
- ✅ **Input types**: Dedicated input types for all mutations (not inline args)
- ✅ **Non-nullable**: Use `!` for required fields, avoid overuse
- ✅ **Payload pattern**: Return both data and errors from mutations
- ✅ **Filtering**: Structured filter input instead of many arguments
- ✅ **Validation**: Use directives like `@constraint` for input validation
- ✅ **Money type**: Proper representation with amount and currency

**Security Recommendations:**

- **Query Complexity**: Limit query depth (max 5 levels) and breadth
- **Rate Limiting**:
  - Anonymous users: 100 queries per 15 min
  - Authenticated: 1000 queries per 15 min
  - Mutations: 50 per 15 min per user
- **Field-level auth**: Sensitive fields (profit margin, supplier info) require admin role
- **Input validation**: Quantity limits, price validation, cart size limits
- **Caching**: Implement DataLoader to prevent N+1 queries

**Sample Query/Response:**

```graphql
query GetProducts {
  products(
    filter: { category: "electronics", inStockOnly: true }
    first: 10
  ) {
    edges {
      node {
        id
        name
        price {
          amount
          currency
        }
        inStock
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

Response:
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "prod_123",
            "name": "Wireless Headphones",
            "price": {
              "amount": 99.99,
              "currency": "USD"
            },
            "inStock": true
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "Y3Vyc29yOnYyOpK5"
      },
      "totalCount": 847
    }
  }
}
```

---

## What This Prompt Covers

### REST APIs

- ✅ Resource naming conventions (plural nouns, kebab-case)
- ✅ Proper HTTP method usage (GET, POST, PUT, PATCH, DELETE)
- ✅ HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500)
- ✅ URL structure and hierarchy
- ✅ Versioning strategies (URL, header, query param)

### GraphQL APIs

- ✅ Schema organization (types, interfaces, unions)
- ✅ Connection pattern for pagination
- ✅ Input types for mutations
- ✅ Payload pattern for error handling
- ✅ Query and mutation naming
- ✅ Field-level authorization

### Security

- ✅ Authentication strategies (OAuth 2.0, JWT, API keys)
- ✅ Authorization patterns (RBAC, ABAC)
- ✅ Rate limiting per endpoint and user
- ✅ Input validation and sanitization
- ✅ Security headers (CORS, CSP, HSTS)

### Best Practices

- ✅ Consistent naming conventions (camelCase, snake_case, kebab-case)
- ✅ Response structure standardization
- ✅ Error handling patterns
- ✅ Pagination strategies (cursor-based, offset-based)
- ✅ Performance optimization (caching, compression, batch operations)
- ✅ Documentation requirements (OpenAPI, GraphQL descriptions)

## Integration Options

### 1. CLI Integration

```bash
hitl run prompt/api-design \
  --api_type "REST" \
  --endpoints "User CRUD, Product search, Order checkout" \
  --business_requirements "High-traffic e-commerce platform"
```

### 2. IDE Integration (VS Code)

Add as a snippet or use with AI-powered code completion tools.

### 3. CI/CD Pipeline

Integrate into PR validation to review API design changes:

```yaml
- name: Validate API Design
  run: hitl validate api-design --changed-files="${{ github.event.pull_request.changed_files }}"
```

### 4. Pre-Commit Hook

Review API designs before committing:

```bash
# .git/hooks/pre-commit
hitl check api-design --staged
```

## Tips for Best Results

1. **Be Specific**: Provide detailed endpoint descriptions and business context
2. **Include Existing Design**: If reviewing, include current implementation for comparison
3. **Specify Requirements**: Mention scale, performance, security, or compliance needs
4. **Ask for Examples**: Request sample requests/responses for clarity
5. **Iterate**: Use output to refine design, then re-validate

## Related Prompts

- [code-review-ts](../../code-review-ts/README.md) - TypeScript code review guidance
- [code-review-empathy](../../culture/code-review-empathy/README.md) - Empathetic code review feedback

## Contributing

Found an issue or want to improve this prompt? See our [Contributing Guidelines](../../../../CONTRIBUTING.md).

## License

MIT License - See [LICENSE](../../../../LICENSE) for details.

## Metadata

- **Category**: Architecture
- **Tags**: api-design, rest, graphql, best-practices, security
- **Version**: 1.0.0
- **Last Updated**: 2025-10-15
