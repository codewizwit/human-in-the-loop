---
name: api-design
description: >-
  Analyzes your API codebase and provides guidance on REST/GraphQL design.
  Use when user asks to "review my API design", "design a REST API",
  "optimize API endpoints", or mentions "API best practices".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# API Design Best Practices

Analyzes your API codebase and provides guidance on REST/GraphQL design. Uses Read and Grep to examine existing endpoints, routes, and schemas. Covers naming conventions, versioning, security, scalability, and industry best practices.

## When to Activate

- User asks to review, audit, or improve an API design
- User asks to design a REST or GraphQL API from scratch
- User wants guidance on API versioning, naming, or security
- User mentions endpoint design, rate limiting, or response formatting
- User asks about API documentation or developer experience

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What type of API would you like me to review or help design?</question>
<options>

  <option value="rest">REST API</option>
  <option value="graphql">GraphQL API</option>
  <option value="both">Both REST and GraphQL</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What is your primary optimization goal?</question>
<options>

  <option value="security">Security hardening</option>
  <option value="performance">Performance and scalability</option>
  <option value="dx">Developer experience</option>
  <option value="full-review">Full comprehensive review</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Discovery Phase

1. Use Glob to find API files (routes, controllers, resolvers, schemas)
2. Read package.json to identify API framework (Express, NestJS, Fastify, Apollo, etc.)
3. Identify API type (REST, GraphQL, or both)
4. Locate API documentation (OpenAPI/Swagger, GraphQL schema)

### Step 3: API Analysis Phase

1. Use Read to examine route definitions and endpoint handlers
2. Use Grep to find authentication/authorization patterns
3. Analyze request/response structures
4. Identify versioning strategy
5. Review error handling patterns

### Step 4: Plan (if complex)

For large codebases with many endpoints, enter plan mode to organize the review into phases:

- Phase 1: Endpoint inventory and structure analysis
- Phase 2: Security and authentication review
- Phase 3: Performance and scalability assessment
- Phase 4: Documentation and DX evaluation

### Step 5: Generate Design Guidance

Provide comprehensive guidance covering the following areas:

#### 1. RESTful Principles (if applicable)

**Resource Naming**

- Use plural nouns for collections (e.g., `/users`, `/orders`)
- Use hierarchical structure for relationships (e.g., `/users/{id}/orders`)
- Avoid verbs in URLs (use HTTP methods instead)
- Use kebab-case for multi-word resources (e.g., `/purchase-orders`)

**HTTP Methods**

- `GET` - Retrieve resource(s), idempotent, cacheable
- `POST` - Create new resource, not idempotent
- `PUT` - Update/replace entire resource, idempotent
- `PATCH` - Partial update, not necessarily idempotent
- `DELETE` - Remove resource, idempotent

**Status Codes**

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST with resource creation
- `204 No Content` - Successful DELETE or update with no response body
- `400 Bad Request` - Invalid input/validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Conflict with current state (e.g., duplicate)
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

#### 2. GraphQL Schema Design (if applicable)

**Schema Organization**

- Clear type definitions with meaningful names
- Proper use of scalars, objects, interfaces, unions
- Nullable vs non-nullable fields (use `!` judiciously)
- Connection pattern for pagination
- Input types for mutations

**Query Design**

- Descriptive query names (e.g., `getUser`, `searchProducts`)
- Proper argument types and validation
- Efficient resolvers (avoid N+1 queries)
- Field-level authorization

**Mutation Design**

- Clear action-based names (e.g., `createOrder`, `updateUserProfile`)
- Input validation at schema level
- Meaningful return types (include errors)
- Optimistic concurrency control

#### 3. Naming Conventions

**Consistency**

- Choose camelCase, snake_case, or kebab-case and stick to it
- Industry standard: camelCase for JSON/GraphQL, kebab-case for URLs
- Boolean fields: use `is`, `has`, `can` prefixes (e.g., `isActive`)
- Dates: ISO 8601 format with timezone
- IDs: UUIDs or meaningful prefixes (e.g., `usr_`, `ord_`)

**Clarity**

- Descriptive names that reveal intent
- Avoid abbreviations unless universally understood
- Use domain language (ubiquitous language)

#### 4. Versioning Strategy

**Options**

- URL versioning: `/v1/users`, `/v2/users` (most common)
- Header versioning: `Accept: application/vnd.api.v1+json`
- Query parameter: `/users?version=1` (not recommended)

**Best Practices**

- Version only when breaking changes occur
- Deprecation policy (e.g., support N-1 versions)
- Clear migration guide for version upgrades
- Sunset headers for deprecated versions

#### 5. Security Considerations

**Authentication**

- Use OAuth 2.0 / OpenID Connect for user auth
- Use API keys for service-to-service
- JWT tokens with short expiration
- Refresh token rotation

**Authorization**

- Role-Based Access Control (RBAC) or Attribute-Based (ABAC)
- Field-level permissions for sensitive data
- Resource ownership validation

**Input Validation**

- Validate all inputs (type, format, range)
- Sanitize to prevent injection attacks
- Rate limiting per endpoint and per user
- Request size limits

**Security Headers**

- CORS configuration (restrict origins)
- Content-Security-Policy
- X-Frame-Options
- Strict-Transport-Security (HTTPS only)

**Rate Limiting**

- Per-user and per-IP limits
- Different limits for authenticated vs anonymous
- Clear rate limit headers (X-RateLimit-\*)
- Graceful degradation with 429 status

#### 6. Response Design

**Consistent Structure**

```json
{
  "data": {},
  "error": {},
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Pagination**

- Cursor-based for real-time data
- Offset-based for static data
- Include `total`, `hasNext`, `cursor` in metadata

**Error Handling**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

#### 7. Performance and Scalability

- Implement caching (ETags, Cache-Control)
- Support compression (gzip, brotli)
- Provide filtering, sorting, field selection
- Batch operations where appropriate
- Async operations for long-running tasks (webhooks/polling)
- Monitor and optimize slow endpoints

#### 8. Documentation

- OpenAPI/Swagger for REST
- GraphQL schema with descriptions
- Example requests and responses
- Error code reference
- Authentication guide
- Rate limit information

## Output Format

<output_format>
Write your API design recommendations to a markdown file in the workspace. Use proper markdown syntax with code blocks, headings, and tables. Follow this structure:

**Endpoint Design:**
[Specific endpoint designs with URLs/schemas, methods, parameters]

**Key Improvements:**

- [Bulleted list of specific improvements or validations]

**Security Recommendations:**

- [Auth, rate limiting, validation specifics]

**Versioning Strategy:**
[Recommended approach for this API]

**Sample Request/Response:**
[Code examples showing proper structure]

**Red Flags:**
[Any concerns or potential issues identified]
</output_format>

## Best Practices

- Follow RESTful or GraphQL best practices
- Prioritize developer experience and API usability
- Include security considerations for all recommendations
- Provide concrete examples for all suggestions
- Consider scalability and performance implications

## Anti-Patterns

- Designing APIs without consistent naming conventions
- Skipping versioning strategy until it is too late
- Exposing internal implementation details in API responses
- Using verbs in REST endpoint URLs
- Returning different response structures for success vs error
- Ignoring pagination for list endpoints

## Examples

**Review entire API design:**

> Review the API design and suggest improvements

**Focus on API security:**

> Review API endpoints for security best practices, especially authentication

**Design new API:**

> Help me design a REST API for an e-commerce product catalog

---

**Human-in-the-Loop by codewizwit**
