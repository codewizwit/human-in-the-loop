---
name: security-review
description: >-
  Conducts comprehensive security analysis of your codebase covering OWASP Top
  10, authentication flaws, injection attacks, and compliance violations. Use
  when user asks to "security review", "security audit", "find vulnerabilities",
  or mentions "OWASP" or "penetration testing".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
---

# Security Review

Analyzes your workspace for security vulnerabilities using automated code scanning. Covers OWASP Top 10 (2021), authentication flaws, injection attacks, insecure dependencies, and compliance violations. Provides severity ratings with CVSS scores, exploit scenarios, and remediation guidance with secure code examples.

## When to Activate

- User asks for a security review or security audit of their codebase
- User wants to find vulnerabilities or security flaws
- User mentions OWASP, penetration testing, or secure coding
- User asks about authentication, injection, or encryption security
- User wants compliance assessment (GDPR, PCI DSS, HIPAA, SOC 2)

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What is the scope of this security review?</question>
<option value="full">Full codebase security audit</option>
<option value="api">API endpoints and authentication</option>
<option value="auth">Authentication and session management</option>
<option value="deps">Dependency and supply chain security</option>
<option value="focused">Specific files or modules</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Does your application handle any regulated data?</question>
<option value="none">No regulated data</option>
<option value="pii">Personal data (GDPR/CCPA)</option>
<option value="payment">Payment data (PCI DSS)</option>
<option value="health">Health data (HIPAA)</option>
<option value="multiple">Multiple compliance requirements</option>
</AskUserQuestion>

### Step 2: Discovery Phase

1. Use Glob to find all source code files in the workspace
2. Use Read to examine `package.json` or equivalent to identify the language, framework, and dependencies
3. Map the project structure: backend, frontend, configuration files, infrastructure
4. Identify security-critical files: authentication modules, database access, API routes, configuration

### Step 3: Plan (if complex)

For large codebases, enter plan mode to organize the review into phases:

<EnterPlanMode>
<summary>
Outline the review scope organized by security domain. List the
security-critical files and modules identified during discovery.
Propose a phased approach: Phase 1 for injection and authentication,
Phase 2 for data protection and API security, Phase 3 for configuration
and compliance. Confirm priority areas with the user.
</summary>
</EnterPlanMode>

### Step 4: Code Analysis

Use Read to examine security-critical files and Grep to search for vulnerability patterns across the codebase.

**OWASP Top 10 (2021) Analysis**

- A01: Broken Access Control - authorization checks, privilege escalation
- A02: Cryptographic Failures - encryption, hashing, key management
- A03: Injection - SQL, NoSQL, command, XSS, LDAP injection
- A04: Insecure Design - threat modeling, security patterns
- A05: Security Misconfiguration - default configs, error handling, security headers
- A06: Vulnerable Components - outdated dependencies, known CVEs
- A07: Authentication Failures - session management, credential handling
- A08: Data Integrity Failures - insecure deserialization, untrusted data
- A09: Logging Failures - security event logging, log injection
- A10: SSRF - server-side request forgery, URL validation

**Input Validation and Sanitization**

- User input validation and sanitization coverage
- Type checking and whitelist validation
- Length limits and encoding for output contexts

**Authentication and Authorization**

- Password storage algorithms (bcrypt, Argon2, PBKDF2)
- Session token generation, expiration, and regeneration
- Authorization consistency across all endpoints
- JWT signing, validation, and expiration

**Data Protection**

- Encryption at rest and in transit
- Secrets management and hardcoded credentials
- PII handling and data minimization

**API Security**

- Rate limiting and brute force protection
- CORS configuration
- Error message sanitization
- Content-type validation

**Common Vulnerability Patterns**

- SQL injection via string concatenation
- XSS via unencoded output
- CSRF token validation
- Path traversal in file operations
- Command injection via shell execution
- Race conditions in concurrent operations

### Step 5: Deliver Report

Write the security review report to a markdown file in the workspace. For each vulnerability, include the OWASP category, CWE ID, severity with CVSS score, vulnerable code with file paths and line numbers, exploit scenario, impact assessment, and secure code remediation example.

## Output Format

<output_format>
**Executive Summary**
Overall security rating (Critical/High/Medium/Low), summary of security
posture, count of issues by severity, and top 3 security concerns.

**Detailed Findings**
For each vulnerability: OWASP category and CWE ID, severity with CVSS
score, vulnerable code with line numbers, vulnerability description,
step-by-step exploit scenario, impact assessment (confidentiality,
integrity, availability, business impact), secure code remediation
example, additional recommendations, and reference links.

**Security Checklist**
Categorized checklist covering input validation, authentication,
data protection, API security, injection prevention, and security
headers with pass/fail status.

**Compliance Assessment**
Applicable compliance framework evaluation (GDPR, PCI DSS, HIPAA,
SOC 2) with checklist items.

**Remediation Roadmap**
Prioritized timeline: immediate (24 hours) for critical issues,
high priority (1 week), medium priority (1 month), low priority
(backlog).

**Security Testing Recommendations**
Automated testing tools (SAST, dependency scanning, secret detection),
manual testing approaches (penetration testing, code review, threat
modeling), and continuous monitoring strategies.

**Language/Framework-Specific Best Practices**
Targeted recommendations for the identified technology stack.
</output_format>

## Best Practices

- Start with project discovery before diving into code analysis
- Prioritize security findings over style issues
- Include specific file paths and line numbers for all findings
- Provide working secure code examples for all critical and high severity findings
- Reference OWASP, CWE, and framework-specific documentation
- Assess both technical and business impact for each finding
- Consider the full attack chain, not just individual vulnerabilities

## Anti-Patterns

- Do not review generated or third-party library code as if it were application code
- Do not suggest breaking changes without migration guidance
- Do not report theoretical vulnerabilities without evidence from the codebase
- Do not skip authentication and authorization checks even for internal APIs
- Do not provide remediation advice without secure code examples
- Do not ignore configuration files and environment setup in the review
- Do not conflate low-severity style issues with genuine security vulnerabilities

## Examples

### Example 1: Full Codebase Security Audit

**Input**: "Please review this codebase for security vulnerabilities"

**Output**: Comprehensive security report with executive summary, detailed findings covering SQL injection, plaintext password storage, and hardcoded credentials, each with CVSS scores, exploit scenarios, secure code examples, a security checklist, and a prioritized remediation roadmap.

### Example 2: API Security Review

**Input**: "Review the API routes for security issues, especially authentication and injection vulnerabilities"

**Output**: Focused security report on API endpoints covering input validation gaps, missing rate limiting, authentication bypass risks, and CORS misconfiguration with specific fix examples for each finding.

### Example 3: Authentication System Review

**Input**: "Analyze the authentication system for security flaws, focusing on session management and password storage"

**Output**: Deep-dive report on authentication security covering password hashing algorithm strength, session token generation, refresh token rotation, JWT configuration, and multi-factor authentication gaps with implementation guidance.

---

**Human-in-the-Loop by codewizwit**
