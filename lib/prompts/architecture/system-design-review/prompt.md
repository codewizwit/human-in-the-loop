<prompt>
  <metadata>
    <id>system-design-review</id>
    <name>System Design Review</name>
    <version>2.0.0</version>
    <description>Analyzes your system architecture from codebase and documentation. Uses Read and Glob to examine architecture files, documentation, and code structure. Validates against best practices, scalability, maintainability, and operational excellence.</description>
    <category>architecture</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>architecture</tag>
      <tag>system-design</tag>
      <tag>scalability</tag>
      <tag>reliability</tag>
      <tag>security</tag>
      <tag>review</tag>
      <tag>best-practices</tag>
      <tag>trade-offs</tag>
    </tags>
    <lastUpdated>2025-01-18</lastUpdated>
  </metadata>

  <examples>
    <example>
      <description>Full system architecture review</description>
      <input>
        <user_message>Review the system architecture and provide recommendations</user_message>
      </input>
    </example>
    <example>
      <description>Focus on scalability</description>
      <input>
        <user_message>Review architecture focusing on scalability and performance concerns</user_message>
      </input>
    </example>
  </examples>

  <context>
You are an expert software architect with deep experience in distributed systems, scalability, security, and operational excellence.
  </context>

  <instructions>
Conduct a comprehensive architectural review of the system by analyzing the workspace.

## Analysis Approach

1. **Discovery Phase**:

   - Use Glob to find architecture documentation (docs/architecture/\*\*, README.md, ADRs)
   - Read package.json and configuration files to understand tech stack
   - Find infrastructure-as-code files (Terraform, CloudFormation, docker-compose)
   - Locate service definitions and API contracts

2. **Architecture Analysis Phase**:

   - Use Read to examine system documentation
   - Identify architecture patterns (microservices, monolith, event-driven, etc.)
   - Analyze service boundaries and dependencies
   - Review data flow and storage strategies
   - Examine deployment and scaling approaches

3. **Review Framework** - Analyze these architectural dimensions:
   </instructions>

  <constraints>
## Review Framework

Evaluate the proposed architecture across these critical dimensions:

### 1. Scalability &amp; Performance

- **Horizontal Scalability**: Can the system scale out by adding more instances?
- **Vertical Scalability**: What are the limits of scaling up individual components?
- **Performance Bottlenecks**: Identify potential bottlenecks (database, network, compute)
- **Caching Strategy**: Is caching appropriately used? (CDN, application, database levels)
- **Load Distribution**: How is load distributed? (load balancers, sharding, partitioning)
- **Async Processing**: Are long-running tasks handled asynchronously?

### 2. Reliability &amp; Resilience

- **Single Points of Failure**: Identify components that could bring down the entire system
- **Fault Tolerance**: How does the system handle component failures?
- **Disaster Recovery**: What is the backup and recovery strategy?
- **Circuit Breakers**: Are circuit breakers implemented for external dependencies?
- **Health Checks**: How is system health monitored and reported?
- **Graceful Degradation**: Can the system operate in degraded mode?

### 3. Security

- **Authentication &amp; Authorization**: How are users authenticated and authorized?
- **Data Encryption**: Is data encrypted at rest and in transit?
- **Network Security**: Are proper network boundaries and firewalls in place?
- **Secrets Management**: How are secrets, API keys, and credentials managed?
- **Attack Surface**: What is the attack surface and how is it minimized?
- **Compliance**: Does the design meet regulatory requirements (GDPR, HIPAA, SOC2)?

### 4. Maintainability &amp; Developer Experience

- **Code Organization**: Is the codebase well-structured and modular?
- **Service Boundaries**: Are service boundaries clear and well-defined?
- **Documentation**: Is the architecture well-documented?
- **Testing Strategy**: How will the system be tested? (unit, integration, E2E)
- **Local Development**: Can developers easily run the system locally?
- **Debugging &amp; Tracing**: How will issues be diagnosed in production?

### 5. Operational Excellence

- **Monitoring &amp; Alerting**: What metrics are tracked? How are anomalies detected?
- **Logging**: Is logging centralized and searchable?
- **Deployment Strategy**: How is the system deployed? (CI/CD, blue-green, canary)
- **Rollback Capability**: Can deployments be quickly rolled back?
- **Infrastructure as Code**: Is infrastructure defined as code?
- **Cost Optimization**: Are there opportunities to reduce infrastructure costs?

### 6. Data Management

- **Data Storage**: Are the right database technologies chosen for each use case?
- **Data Consistency**: How is data consistency maintained across services?
- **Data Migration**: How will schema changes and data migrations be handled?
- **Data Retention**: What is the data retention and archival strategy?
- **Database Scalability**: How will databases scale with growth?
- **Backup &amp; Recovery**: Are backups automated and regularly tested?

### 7. Integration &amp; Dependencies

- **Third-Party Services**: What external services are used? What are the risks?
- **API Contracts**: Are API contracts well-defined and versioned?
- **Service Communication**: How do services communicate? (REST, gRPC, message queues)
- **Dependency Management**: Are dependencies minimized and well-managed?
- **Vendor Lock-in**: What is the risk of vendor lock-in?

<output_format>
Write your system design review to a markdown file in the workspace. Use proper markdown syntax with clear headings, tables, code blocks, and structured sections. Follow this structure:

### Executive Summary

- Overall assessment: 🟢 Strong / 🟡 Needs Improvement / 🔴 Critical Issues
- 2-3 sentence summary of the architecture's strengths and key concerns
- Top 3 recommendations for improvement

### Detailed Findings

For each dimension (Scalability, Reliability, Security, etc.):

#### [Dimension Name]

**Assessment**: 🟢 Strong / 🟡 Needs Improvement / 🔴 Critical Issues

**Strengths**:

- List specific strengths in this dimension
- Highlight good architectural decisions

**Concerns**:

- List specific concerns or risks
- Explain potential impact (high/medium/low)

**Recommendations**:

- Provide actionable recommendations
- Suggest alternative approaches where applicable
- Include implementation guidance

### Trade-offs Analysis

Document key trade-offs made in the architecture:

| Decision | Benefits | Drawbacks | Alternatives Considered |
| -------- | -------- | --------- | ----------------------- |
| [Choice] | [Pros]   | [Cons]    | [Other options]         |

### Alternative Architectures

Suggest 1-2 alternative architectural approaches:

**Alternative 1: [Name]**

- Description: Brief overview
- When to use: Scenarios where this would be better
- Trade-offs: Key differences from proposed architecture

### Risk Assessment

| Risk               | Likelihood      | Impact          | Mitigation Strategy |
| ------------------ | --------------- | --------------- | ------------------- |
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to mitigate]   |

### Action Items

Prioritized list of concrete next steps:

**High Priority** (address before implementation):

- [ ] Action item with clear acceptance criteria

**Medium Priority** (address during implementation):

- [ ] Action item with clear acceptance criteria

**Low Priority** (future improvements):

- [ ] Action item with clear acceptance criteria

### Architectural Principles Checklist

- [ ] **Separation of Concerns**: Components have single, well-defined responsibilities
- [ ] **Loose Coupling**: Services can be modified independently
- [ ] **High Cohesion**: Related functionality is grouped together
- [ ] **Scalability**: System can handle growth in users, data, and traffic
- [ ] **Resilience**: System handles failures gracefully
- [ ] **Security**: Defense in depth with multiple security layers
- [ ] **Observability**: System behavior can be understood from outputs
- [ ] **Simplicity**: Architecture is as simple as possible, but no simpler
- [ ] **Cost Efficiency**: Resources are used efficiently
- [ ] **Developer Productivity**: Architecture enables fast, safe development

## Special Markers

- Use 🔴 for critical issues that must be addressed before implementation
- Use 🟡 for concerns that should be addressed soon
- Use 🟢 for well-designed aspects that follow best practices
- Use 💡 for suggestions and optimizations
- Use ⚠️ for warnings about potential risks or anti-patterns
  </output_format>
  </constraints>
  </prompt>
