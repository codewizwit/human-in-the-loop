# API Design Best Practices

Analyzes API codebase for REST/GraphQL design best practices covering naming, versioning, security, and scalability.

## What You'll Be Asked

- **Review scope** - Full API or specific endpoints
- **API type** - REST, GraphQL, or both (auto-detected)
- **Focus areas** (optional) - Security, versioning, performance, documentation

## Usage Examples

### Example 1: Authentication Endpoints Review

Review user registration and login endpoints for security best practices.

**Expected Output:**

```markdown
**Endpoint Design:**
POST /v1/users # Register new user
POST /v1/auth/login # Authenticate user
POST /v1/auth/refresh # Refresh access token

**Security Recommendations:**

- JWT access tokens (15 min expiry)
- Rate limiting: 5 failed login attempts per 15 min
- Password: Min 12 chars with complexity requirements
```

### Example 2: GraphQL Schema Design

Analyze GraphQL schema for query efficiency, naming conventions, and type design.

**Expected Output:**

```markdown
**Key Improvements:**

- Use Connection pattern for pagination
- Add input types for mutations
- Implement field-level authorization
- Prevent N+1 queries with DataLoader

**Red Flags:**

- Missing error handling in resolvers
- No rate limiting on expensive queries
```

## Related Resources

- [OWASP API Security](https://owasp.org/www-project-api-security/) - Security best practices
- [REST API Tutorial](https://restfulapi.net/) - RESTful design principles
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/) - Official guide
- [Security Review](../../governance/security-review) - Deep security analysis
