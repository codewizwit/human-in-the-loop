# Security Review

Reviews code for security vulnerabilities including OWASP Top 10, authentication flaws, injection attacks, insecure dependencies, and compliance violations. Provides severity ratings, exploit scenarios, and remediation guidance with secure code examples.

## Overview

This prompt performs comprehensive security analysis of code, identifying vulnerabilities across authentication, authorization, input validation, data protection, and common attack vectors. It provides detailed findings with CVS scores, exploit scenarios, and secure code examples for remediation.

## When to Use This Prompt

Use this security review when:

- **Code Review** - Reviewing pull requests for security issues
- **Pre-Deployment** - Final security check before production
- **Security Audit** - Comprehensive security assessment
- **AI-Generated Code** - Validating code from AI assistants
- **Third-Party Code** - Reviewing external libraries or contractors' code
- **Compliance** - Ensuring GDPR, PCI DSS, HIPAA, SOC 2 compliance

## Usage

### Basic Security Review

```yaml
code: |
  app.post('/api/users', (req, res) => {
    const { username, email } = req.body;
    db.query(`INSERT INTO users VALUES ('${username}', '${email}')`);
    res.json({ success: true });
  });

language: javascript
framework: express
```

### With Context

```yaml
code: |
  [Your code here]

language: python
framework: django

context: |
  E-commerce application handling credit card payments
  Must be PCI DSS compliant
  Processes 10K transactions/day
  Stores customer PII

review_focus: Payment security, data encryption, PCI DSS compliance
```

### Complete Review

```yaml
code: |
  [Authentication system code]

language: typescript
framework: express

context: |
  User authentication service for SaaS application
  Handles OAuth2, JWT tokens, password reset
  Stores PII and payment information
  Must comply with GDPR and SOC 2

review_focus: |
  - Authentication and session management
  - Password storage and reset flow
  - OAuth2 implementation security
  - JWT token validation
  - Data protection and encryption
```

## Output Structure

### Executive Summary

- Overall security rating (Critical/High/Medium/Low)
- Issue count by severity
- Top 3 security concerns
- Quick assessment of deployment readiness

### Detailed Findings

For each vulnerability:

- **OWASP category** and CWE ID
- **Severity** with CVSS score
- **Vulnerable code** with line numbers
- **Exploit scenario** (step-by-step)
- **Impact assessment** (CIA triad + business impact)
- **Remediation** with secure code example
- **References** to OWASP, CWE, documentation

### Security Checklist

- Input validation
- Authentication & authorization
- Data protection
- API security
- Injection prevention
- Security headers

### Compliance Assessment

- GDPR requirements
- PCI DSS controls
- HIPAA safeguards
- SOC 2 criteria

### Remediation Roadmap

- Immediate action (24 hours)
- High priority (1 week)
- Medium priority (1 month)
- Low priority (backlog)

### Security Testing Recommendations

- Automated testing tools
- Manual testing areas
- Continuous monitoring setup

## Example Output

**Input (Vulnerable Login):**

```yaml
code: |
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.query(query, (err, results) => {
      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ success: false });
      }
    });
  });

language: javascript
framework: express
```

**Output Highlights:**

```markdown
## Executive Summary

**Overall Security Rating**: 🔴 Critical

**Critical Issues**: 2 🔴

**Top 3 Security Concerns**:

1. 🔴 SQL Injection - Complete database compromise possible
2. 🔴 Plaintext Password Storage - All credentials exposed
3. 🟠 Missing Authentication Rate Limiting - Brute force vulnerable

---

## Finding #1: SQL Injection Vulnerability

**OWASP**: A03:2021 - Injection
**CWE**: CWE-89
**Severity**: 🔴 Critical
**CVSS**: 9.8

**Exploit Scenario**:
```

POST /login
{ "username": "admin' OR '1'='1", "password": "x" }

Resulting query:
SELECT \* FROM users WHERE username = 'admin' OR '1'='1' AND password = 'x'

Result: Bypassed authentication, logged in as admin

````

**Remediation**:

```javascript
// Secure: Use parameterized queries
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username], async (err, results) => {
  if (results.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = results[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (isValid) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
````

---

## Remediation Roadmap

### Immediate Action (DO NOT DEPLOY)

- [ ] 🔴 Fix SQL injection with parameterized queries
- [ ] 🔴 Implement bcrypt password hashing

### High Priority (Within 1 week)

- [ ] 🟠 Add rate limiting
- [ ] 🟠 Implement input validation

````

## OWASP Top 10 Coverage

The prompt checks for all OWASP Top 10 (2021) vulnerabilities:

### A01: Broken Access Control

- Missing authentication checks
- Missing authorization checks
- Insecure direct object references (IDOR)
- Privilege escalation vulnerabilities
- CORS misconfigurations

### A02: Cryptographic Failures

- Plaintext password storage
- Weak hashing algorithms (MD5, SHA1)
- Hardcoded encryption keys
- Missing encryption for sensitive data
- Insecure random number generation

### A03: Injection

- SQL injection
- NoSQL injection
- Command injection
- LDAP injection
- Cross-site scripting (XSS)
- XML external entity (XXE)

### A04: Insecure Design

- Missing threat modeling
- Lack of security patterns
- Business logic flaws
- Missing abuse case consideration

### A05: Security Misconfiguration

- Default credentials
- Missing security headers
- Verbose error messages
- Unnecessary features enabled
- Outdated software versions

### A06: Vulnerable and Outdated Components

- Outdated dependencies with known CVEs
- Unmaintained libraries
- Unnecessary dependencies
- Missing security updates

### A07: Identification and Authentication Failures

- Weak password policies
- Missing multi-factor authentication
- Exposed session IDs in URLs
- Session fixation vulnerabilities
- Insecure password recovery

### A08: Software and Data Integrity Failures

- Insecure deserialization
- Unsigned software updates
- CI/CD pipeline vulnerabilities
- Untrusted data sources

### A09: Security Logging and Monitoring Failures

- Missing security event logging
- Log injection vulnerabilities
- Insufficient log retention
- Missing alerting on suspicious activity

### A10: Server-Side Request Forgery (SSRF)

- Unvalidated URL parameters
- Internal service exposure
- Cloud metadata access
- Unsafe redirect/forward

## Severity Ratings

### 🔴 Critical (CVSS 9.0-10.0)

**Characteristics**:

- Remote code execution
- Complete system compromise
- Mass data exfiltration
- Authentication bypass

**Examples**:

- SQL injection allowing arbitrary queries
- Remote code execution via deserialization
- Hardcoded admin credentials

**Action**: Immediate fix, do not deploy

### 🟠 High (CVSS 7.0-8.9)

**Characteristics**:

- Sensitive data exposure
- Authorization bypass
- Privilege escalation
- Significant business impact

**Examples**:

- Missing authentication on sensitive endpoints
- Weak password hashing
- Insecure file uploads

**Action**: Fix within 1 week

### 🟡 Medium (CVSS 4.0-6.9)

**Characteristics**:

- Information disclosure
- Limited exploitation scope
- Requires user interaction
- Moderate business impact

**Examples**:

- Missing security headers
- Verbose error messages
- Weak session management

**Action**: Fix within 1 month

### 🔵 Low/Informational (CVSS 0.1-3.9)

**Characteristics**:

- Best practice violations
- Defense in depth improvements
- Minor information leaks
- Low business impact

**Examples**:

- Missing rate limiting
- Outdated dependencies (no known exploits)
- Code quality issues

**Action**: Backlog, address when convenient

## Common Vulnerability Patterns

### SQL Injection

**Vulnerable**:

```javascript
const query = `SELECT * FROM users WHERE id = ${userId}`;
````

**Secure**:

```javascript
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId], callback);
```

### XSS (Cross-Site Scripting)

**Vulnerable**:

```javascript
res.send(`<div>${userInput}</div>`);
```

**Secure**:

```javascript
const escape = require('escape-html');
res.send(`<div>${escape(userInput)}</div>`);
```

### Command Injection

**Vulnerable**:

```javascript
exec(`ls ${userInput}`, callback);
```

**Secure**:

```javascript
const { spawn } = require('child_process');
spawn('ls', [userInput]); // Array arguments prevent injection
```

### Path Traversal

**Vulnerable**:

```javascript
const filePath = `./uploads/${req.params.filename}`;
res.sendFile(filePath);
```

**Secure**:

```javascript
const path = require('path');
const filename = path.basename(req.params.filename);
const filePath = path.join(__dirname, 'uploads', filename);
res.sendFile(filePath);
```

### Insecure Deserialization

**Vulnerable**:

```python
import pickle
data = pickle.loads(user_input)  # Dangerous!
```

**Secure**:

```python
import json
data = json.loads(user_input)  # Safe for untrusted input
```

### CSRF (Cross-Site Request Forgery)

**Vulnerable**:

```javascript
app.post('/transfer', (req, res) => {
  // No CSRF protection
  transferMoney(req.body.amount, req.body.to);
});
```

**Secure**:

```javascript
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

app.post('/transfer', (req, res) => {
  // CSRF token validated automatically
  transferMoney(req.body.amount, req.body.to);
});
```

## Compliance Checks

### GDPR (EU Data Protection)

**Requirements Checked**:

- [ ] Consent mechanisms for data collection
- [ ] Data minimization (only necessary data)
- [ ] Right to access (user can view their data)
- [ ] Right to deletion (user can delete their data)
- [ ] Data breach notification readiness
- [ ] Data processing agreements
- [ ] Encryption of personal data

### PCI DSS (Payment Card Data)

**Requirements Checked**:

- [ ] Cardholder data encrypted
- [ ] No storage of CVV/PIN
- [ ] Access controls on cardholder data
- [ ] Logging and monitoring
- [ ] Regular security testing
- [ ] Secure network architecture

### HIPAA (Healthcare Data)

**Requirements Checked**:

- [ ] PHI encrypted at rest and in transit
- [ ] Access controls and audit logs
- [ ] Authentication for all users
- [ ] Business associate agreements
- [ ] Incident response plan
- [ ] Regular risk assessments

### SOC 2 (Service Organization Controls)

**Requirements Checked**:

- [ ] Security controls documented
- [ ] Access reviews conducted
- [ ] Change management process
- [ ] Incident response plan
- [ ] Third-party risk assessment
- [ ] Security training program

## Security Testing Integration

### Pre-Commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Run security review on changed files
git diff --cached --name-only | grep '\\.js$' | while read file; do
  echo "Security checking $file..."
  # Run your security review tool
done
```

### CI/CD Integration

```yaml
# GitHub Actions
name: Security Review
on: [pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Security scan
        run: |
          npm install -g snyk
          snyk test
          npm audit --audit-level=high
```

### Automated Tools

**SAST (Static Analysis)**:

- **JavaScript/TypeScript**: ESLint Security Plugin, Snyk, SonarQube
- **Python**: Bandit, Safety, Snyk
- **Java**: SpotBugs, FindSecBugs, Checkmarx
- **Go**: gosec, Nancy

**Dependency Scanning**:

- **npm**: `npm audit`, Snyk, GitHub Dependabot
- **Python**: Safety, pip-audit
- **Java**: OWASP Dependency-Check
- **Go**: Nancy, Snyk

**Secret Detection**:

- TruffleHog
- GitGuardian
- GitHub secret scanning
- AWS Secrets Manager Scanner

## Best Practices by Language

### JavaScript/Node.js

1. Use `helmet` for security headers
2. Use `express-rate-limit` for rate limiting
3. Use `bcrypt` (12+ rounds) for password hashing
4. Use `jsonwebtoken` for JWT auth
5. Use `dotenv` for environment variables
6. Enable `strict mode`
7. Use `eslint-plugin-security`

### Python

1. Use `secrets` module for random generation
2. Use parameterized queries (SQLAlchemy)
3. Avoid `pickle` for untrusted data
4. Use `bandit` for security scanning
5. Keep dependencies updated with `safety`
6. Use `python-dotenv` for environment variables

### Java

1. Use `PreparedStatement` for SQL
2. Avoid `Runtime.exec()` with user input
3. Use `javax.crypto` for encryption
4. Enable SecurityManager
5. Use OWASP Dependency-Check
6. Configure Spring Security properly

### Go

1. Use `database/sql` with parameterized queries
2. Avoid `os/exec` with unsanitized input
3. Use `crypto` package (not custom crypto)
4. Use `gosec` for security scanning
5. Keep dependencies updated with `nancy`

## False Positive Handling

The review may flag code that is actually secure. Review findings critically:

**Example False Positive**:

```javascript
// Flagged as SQL injection
const query = `SELECT * FROM ${tableName} WHERE id = ?`;
```

**Why it's safe**:

- `tableName` is from a whitelist, not user input
- `id` parameter is properly parameterized

**How to handle**:

- Add comment explaining why it's safe
- Refactor to make security obvious
- Suppress warning with justification

## Related Resources

- [Responsible AI Audit](../responsible-ai-audit/README.md) - AI output quality review
- [Code Review Empathy](../../culture/code-review-empathy/README.md) - Constructive feedback
- [Unit Test Generator](../../testing/unit-test-generator/README.md) - Security test generation
- [ACCOUNTABILITY.md](../../../../ACCOUNTABILITY.md) - Responsible AI usage

## Contributing

To improve this security review prompt:

1. Report false positives/negatives
2. Suggest additional vulnerability patterns
3. Provide language-specific security guidance
4. Share secure code examples
5. Contribute compliance checklists

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
