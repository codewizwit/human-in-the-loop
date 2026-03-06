---
name: api-documentation
description: >-
  Generates comprehensive API documentation from your codebase including OpenAPI
  specs, endpoint references, and developer guides. Use when user asks to
  "generate API docs", "document API endpoints", "create OpenAPI spec", or
  mentions "Swagger documentation".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
---

# API Documentation Generator

Analyzes controllers, routes, DTOs, and schemas in your codebase to produce OpenAPI/Swagger specifications, endpoint references, request/response examples, and developer guides. Supports both REST and GraphQL APIs with realistic examples and consistent formatting.

## When to Activate

- User asks to generate or create API documentation
- User mentions OpenAPI, Swagger, or API spec generation
- User wants endpoint references or developer guides for their API
- User asks to document REST endpoints or GraphQL schema
- User wants request/response examples for their API

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What type of API documentation do you need?</question>
<option value="openapi">OpenAPI/Swagger specification (REST)</option>
<option value="graphql">GraphQL schema documentation</option>
<option value="full">Full documentation suite (spec + guides + examples)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is the scope of the documentation?</question>
<option value="all">All API endpoints</option>
<option value="module">Specific module or resource</option>
<option value="update">Update existing documentation</option>
</AskUserQuestion>

### Step 2: Discovery Phase

1. Use Glob to find API-related files:
   - Controllers: `**/controllers/**/*.ts`, `**/*.controller.ts`
   - Routes: `**/routes/**/*.ts`, `**/*.resolver.ts`
   - DTOs/Schemas: `**/*.dto.ts`, `**/*.schema.ts`, `**/*.entity.ts`
2. Use Read to examine `package.json` for framework identification (Express, NestJS, Fastify, Apollo)
3. Use Grep to locate existing documentation (OpenAPI specs, Swagger files, JSDoc comments)
4. Identify authentication patterns, middleware, and decorators

### Step 3: Plan (if complex)

For large APIs with many endpoints or multiple resources, enter plan mode to organize the documentation effort:

<EnterPlanMode>
<summary>
Outline the documentation scope, list all discovered endpoints grouped by
resource, identify existing documentation to update vs. new documentation
to generate, and confirm output file locations with the user.
</summary>
</EnterPlanMode>

### Step 4: Analysis Phase

1. Use Read to examine each controller and route handler
2. Extract endpoint metadata: HTTP method, path, parameters, request body, response types
3. Identify authentication and authorization requirements per endpoint
4. Map DTOs to request/response schemas with validation constraints
5. Catalog error responses and status codes

### Step 5: Generate Documentation

For REST APIs, produce an OpenAPI 3.0 specification with:

- Info section (title, description, version, contact)
- Server definitions for each environment
- Path definitions for all endpoints with parameters, request bodies, and responses
- Component schemas derived from DTOs and entities
- Security scheme definitions
- Reusable response definitions for common errors

For GraphQL APIs, produce schema documentation with:

- Type definitions with field descriptions
- Query and Mutation references with argument documentation
- Example queries with variables
- Authentication requirements per operation

### Step 6: Deliver Results

Write documentation files to the workspace and provide a summary of:

- Files created or updated
- Count of endpoints documented
- Any gaps or undocumented endpoints
- Suggestions for improving documentation coverage

## Output Format

<output_format>
**OpenAPI Specification** (`docs/api/openapi.yaml`)
Complete, valid OpenAPI 3.0 spec with all endpoints, schemas, and examples.

**API Overview** (`docs/api/README.md`)
Human-readable overview with base URLs, authentication summary, quick start
guide, and endpoint inventory table.

**Per-Resource Documentation** (`docs/api/[resource].md`)
Detailed documentation for complex resources with request/response examples,
error references, and authentication requirements.

**Error Reference** (`docs/api/errors.md`)
Status code and error code reference table with descriptions and resolutions.

**Summary**
List of files created/updated, endpoint count, documentation gaps, and
improvement suggestions.
</output_format>

## Best Practices

- Generate valid OpenAPI 3.0.3 or later specifications
- Use realistic, representative example values rather than placeholder text
- Include all discovered endpoints without skipping any
- Document both success and error responses for every endpoint
- Preserve existing documentation when updating rather than overwriting
- Include authentication requirements for all protected endpoints
- Add validation constraints from DTOs to schema documentation
- Follow consistent naming conventions derived from the codebase

## Anti-Patterns

- Do not use placeholder values like "lorem ipsum" or "string" for examples
- Do not skip undocumented endpoints; flag them for the user instead
- Do not overwrite existing documentation without confirming with the user
- Do not generate documentation for generated or third-party code
- Do not omit error responses from endpoint documentation
- Do not ignore authentication and authorization requirements

## Examples

### Example 1: Full REST API Documentation

**Input**: "Generate API documentation for our backend service"

**Output**: Complete OpenAPI 3.0 specification, human-readable API overview with quick start guide, per-resource markdown references, and an error code reference table covering all discovered endpoints.

### Example 2: OpenAPI Spec for Specific Resource

**Input**: "Create OpenAPI 3.0 documentation for the users API endpoints"

**Output**: Focused OpenAPI specification for the users resource with full schema definitions, request/response examples, pagination metadata, and authentication requirements.

### Example 3: GraphQL Schema Documentation

**Input**: "Document our GraphQL API schema with examples"

**Output**: Schema documentation with annotated type definitions, query and mutation references, example queries with variables, and authentication guide for protected operations.

---

**Human-in-the-Loop by codewizwit**
