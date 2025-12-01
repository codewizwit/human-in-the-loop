# API Documentation Generator

Generates comprehensive API documentation from your codebase including OpenAPI/Swagger specs, endpoint references, request/response examples, and developer guides.

## What It Does

- **Analyzes** your API codebase (controllers, routes, DTOs, schemas)
- **Generates** OpenAPI 3.0 specifications for REST APIs
- **Documents** GraphQL schemas with examples
- **Creates** human-readable API reference documentation
- **Includes** authentication guides and error references

## Usage Examples

### Example 1: Generate Full API Documentation

```
Generate API documentation for our backend service
```

**What You Get:**

- `docs/api/openapi.yaml` - Complete OpenAPI 3.0 spec
- `docs/api/README.md` - API overview and quickstart
- `docs/api/authentication.md` - Auth guide
- `docs/api/errors.md` - Error reference

### Example 2: Document Specific Endpoints

```
Create OpenAPI 3.0 documentation for the users API endpoints
```

**Sample Output:**

```yaml
openapi: 3.0.3
info:
  title: Users API
  version: 1.0.0

paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'

    post:
      summary: Create a new user
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
```

### Example 3: GraphQL Schema Documentation

```
Document our GraphQL API schema with examples
```

**What You Get:**

- Schema documentation with type descriptions
- Query/Mutation reference
- Example queries with variables
- Authentication requirements

## Documentation Components

| Component              | Description                         |
| ---------------------- | ----------------------------------- |
| **OpenAPI Spec**       | Machine-readable API definition     |
| **Endpoint Reference** | Method, path, parameters, responses |
| **Request Examples**   | Realistic request bodies            |
| **Response Examples**  | Success and error responses         |
| **Schema Docs**        | DTOs with validation constraints    |
| **Error Reference**    | Status codes and resolution         |
| **Auth Guide**         | How to authenticate requests        |

## Supported Frameworks

- **REST**: Express, NestJS, Fastify, Koa
- **GraphQL**: Apollo Server, NestJS GraphQL
- **Hybrid**: APIs with both REST and GraphQL

## Output Structure

```
docs/api/
├── openapi.yaml      # OpenAPI 3.0 specification
├── README.md         # API overview and quickstart
├── authentication.md # Authentication guide
├── errors.md         # Error code reference
└── [resource].md     # Per-resource documentation
```

## Best Practices Applied

- Valid OpenAPI 3.0.3 specifications
- Realistic example values (not lorem ipsum)
- Consistent error response structure
- Authentication requirements on all protected endpoints
- Validation constraints from DTOs
- Proper HTTP status codes

## Related Resources

- [API Design Best Practices](../../architecture/api-design) - Design your API right
- [Security Review](../../governance/security-review) - Security analysis
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3) - Official spec
- [Swagger Editor](https://editor.swagger.io/) - Validate and preview specs
