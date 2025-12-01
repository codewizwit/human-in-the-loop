# Security Review

Comprehensive security analysis covering OWASP Top 10, authentication flaws, injection attacks, and compliance violations.

## What You'll Be Asked

- **Review scope** - Full workspace, specific API routes, or authentication system
- **Focus areas** (optional) - OWASP categories, authentication, input validation
- **Compliance requirements** (optional) - GDPR, PCI DSS, HIPAA, SOC 2

## Usage Examples

### Example 1: Full Workspace Security Scan

Scan entire codebase for SQL injection, XSS, authentication issues, and hardcoded secrets.

**Expected Output:**

```markdown
## Executive Summary

**Overall Security Rating**: 🔴 Critical

**Critical Issues**: 4 🔴

- SQL Injection in login endpoint
- Plaintext password storage
- Hardcoded database credentials

### Finding #1: SQL Injection

**CVSS Score**: 9.8 (Critical)
**Exploit Scenario:**
POST /login { "username": "admin' OR '1'='1" }
```

### Example 2: Authentication System Review

Deep dive on session management, password storage, and JWT implementation.

**Expected Output:**

```markdown
### Authentication & Authorization

- [ ] ❌ Passwords hashed with bcrypt (using plaintext)
- [ ] ❌ Session tokens securely generated
- [ ] ❌ MFA supported for sensitive operations

**Secure Code Example:**
const password_hash = await bcrypt.hash(password, 12);
```

## Related Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web application security risks
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/) - Security implementation guides
- [CWE Database](https://cwe.mitre.org/) - Common weakness enumeration
- [API Design](../../architecture/api-design) - Secure API patterns
