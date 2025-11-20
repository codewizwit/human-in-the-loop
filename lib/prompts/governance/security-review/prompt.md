---
id: security-review
name: Security Review
version: 2.0.0
description: Analyzes your workspace for security vulnerabilities using automated code scanning. Covers OWASP Top 10, authentication flaws, injection attacks, insecure dependencies, and compliance violations. Uses Read, Grep, and Glob tools to discover and analyze code. Provides severity ratings, exploit scenarios, and remediation guidance with secure code examples.
category: governance
examples:
  - description: Full workspace security review
    input:
      user_message: "Please review this codebase for security vulnerabilities"
  - description: Focused API security review
    input:
      user_message: "Review the API routes for security issues, especially API security, authentication, and injection vulnerabilities"
  - description: Authentication system review
    input:
      user_message: "Analyze the authentication system for security flaws, focusing on session management and password storage"
    output: |
      # Security Review Report

      ## Executive Summary

      **Overall Security Rating**: 🔴 Critical

      **Summary**: This code contains multiple critical security vulnerabilities including SQL injection, hardcoded credentials, and plaintext password storage. The application is highly vulnerable to attack and should NOT be deployed to production in its current state.

      **Critical Issues**: 4 🔴
      **High Severity**: 2 🟠
      **Medium Severity**: 1 🟡
      **Low Severity / Info**: 0 🔵

      **Top 3 Security Concerns**:
      1. 🔴 SQL Injection in login and user endpoints - Complete database compromise possible
      2. 🔴 Plaintext password storage and comparison - All user credentials exposed
      3. 🔴 Hardcoded database credentials in source code - Database access exposed

      ---

      ## Detailed Findings

      ### 🔴 Finding #1: SQL Injection Vulnerability

      **OWASP Category**: A03:2021 - Injection
      **CWE ID**: CWE-89 (SQL Injection)
      **Severity**: 🔴 Critical
      **CVSS Score**: 9.8 (Critical)

      **Vulnerable Code** (lines 16-17, 30-31):
      ```javascript
      // Login endpoint
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

      // User endpoint
      const query = `SELECT * FROM users WHERE id = ${userId}`;
      ```

      **Vulnerability Description**:
      The code constructs SQL queries using string concatenation with unsanitized user input from `req.body` and `req.params`. This allows attackers to inject malicious SQL code.

      **Exploit Scenario**:
      ```
      1. Attacker sends login request:
         POST /login
         { "username": "admin' OR '1'='1", "password": "anything" }

      2. Resulting query:
         SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'

      3. The OR '1'='1' condition is always true, bypassing authentication

      4. Attacker gains access as admin without knowing password

      Alternative exploit for data exfiltration:
         GET /user/1; DROP TABLE users; --
         Results in: SELECT * FROM users WHERE id = 1; DROP TABLE users; --
      ```

      **Impact**:
      - **Confidentiality**: High - All database data can be read
      - **Integrity**: High - Data can be modified or deleted
      - **Availability**: High - Database can be destroyed
      - **Business Impact**: Complete system compromise, data breach, regulatory fines (GDPR, CCPA), reputational damage

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      // Use parameterized queries
      app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password required' });
        }

        const query = 'SELECT * FROM users WHERE username = ?';

        db.query(query, [username], async (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Authentication failed' });
          }

          if (results.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
          }

          const user = results[0];

          // Use bcrypt to compare hashed passwords
          const isValid = await bcrypt.compare(password, user.password_hash);

          if (isValid) {
            // Don't send password hash to client
            const { password_hash, ...userWithoutPassword } = user;
            res.json({ success: true, user: userWithoutPassword });
          } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
          }
        });
      });

      app.get('/user/:id', (req, res) => {
        const userId = req.params.id;

        // Validate userId is numeric
        if (!/^\d+$/.test(userId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
        }

        const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';

        db.query(query, [userId], (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
          }

          if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.json(results[0]);
        });
      });
      ```

      **Additional Recommendations**:
      - Use an ORM like Sequelize or TypeORM which handles parameterization
      - Implement prepared statements for frequently used queries
      - Enable database query logging to detect injection attempts
      - Use least privilege database user (not root)

      **References**:
      - https://owasp.org/www-community/attacks/SQL_Injection
      - https://cwe.mitre.org/data/definitions/89.html
      - https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

      ---

      ### 🔴 Finding #2: Plaintext Password Storage

      **OWASP Category**: A02:2021 - Cryptographic Failures
      **CWE ID**: CWE-256 (Plaintext Storage of Password)
      **Severity**: 🔴 Critical
      **CVSS Score**: 9.1 (Critical)

      **Vulnerable Code** (line 17):
      ```javascript
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      ```

      **Vulnerability Description**:
      Passwords are stored and compared in plaintext. Anyone with database access can read all user passwords.

      **Exploit Scenario**:
      ```
      1. Attacker gains database access via:
         - SQL injection (see Finding #1)
         - Backup file exposure
         - Database compromise

      2. Attacker reads passwords table:
         SELECT username, password FROM users;

      3. All user passwords exposed in plaintext

      4. Attacker can:
         - Log in as any user
         - Attempt password reuse on other services
         - Sell credentials on dark web
      ```

      **Impact**:
      - **Confidentiality**: High - All user credentials exposed
      - **Integrity**: High - Account takeover possible
      - **Availability**: Medium - Users may lose account access
      - **Business Impact**: Massive data breach, regulatory fines (GDPR up to €20M), class-action lawsuits, reputational destruction

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      const bcrypt = require('bcrypt');
      const SALT_ROUNDS = 12;

      // Registration endpoint
      app.post('/register', async (req, res) => {
        const { username, password } = req.body;

        // Password strength validation
        if (password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        try {
          // Hash password with bcrypt
          const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

          const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';

          db.query(query, [username, password_hash], (err, result) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Username already exists' });
              }
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Registration failed' });
            }

            res.status(201).json({ success: true, userId: result.insertId });
          });
        } catch (err) {
          console.error('Hashing error:', err);
          res.status(500).json({ error: 'Registration failed' });
        }
      });

      // Login endpoint (see Finding #1 for complete example)
      app.post('/login', async (req, res) => {
        // ... fetch user from database ...

        // Compare hashed password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (isValid) {
          // Success
        } else {
          // Invalid credentials
        }
      });
      ```

      **Additional Recommendations**:
      - Use bcrypt with cost factor of 12+ (adjustable as hardware improves)
      - Alternative: Argon2 (newer, more secure)
      - Never log passwords or password hashes
      - Enforce strong password policy (min length, complexity)
      - Consider implementing password breach detection (Have I Been Pwned API)

      **References**:
      - https://owasp.org/www-project-proactive-controls/v3/en/c6-digital-identity
      - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

      ---

      ### 🔴 Finding #3: Hardcoded Database Credentials

      **OWASP Category**: A05:2021 - Security Misconfiguration
      **CWE ID**: CWE-798 (Use of Hard-coded Credentials)
      **Severity**: 🔴 Critical
      **CVSS Score**: 9.8 (Critical)

      **Vulnerable Code** (lines 7-11):
      ```javascript
      const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',  // Hardcoded password
        database: 'userdb'
      });
      ```

      **Vulnerability Description**:
      Database credentials are hardcoded in source code using the root account with a weak password.

      **Exploit Scenario**:
      ```
      1. Source code exposed via:
         - Public GitHub repository
         - Compromised developer machine
         - Server misconfiguration

      2. Attacker finds credentials in code:
         user: root, password: admin123

      3. Attacker connects directly to database

      4. Complete database compromise:
         - Read all data
         - Modify/delete data
         - Create backdoor accounts
         - Pivot to other systems
      ```

      **Impact**:
      - **Confidentiality**: High - All database data exposed
      - **Integrity**: High - Data can be modified
      - **Availability**: High - Database can be destroyed
      - **Business Impact**: Complete data breach, system compromise

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      require('dotenv').config();

      const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
          ca: fs.readFileSync(process.env.DB_SSL_CA)
        }
      });

      // .env file (never commit to git):
      DB_HOST=localhost
      DB_USER=app_user          # NOT root
      DB_PASSWORD=<strong-generated-password>
      DB_NAME=userdb
      DB_SSL_CA=/path/to/ca-cert.pem

      // .gitignore:
      .env
      .env.local
      ```

      **Additional Recommendations**:
      - Use environment variables or secret management service (AWS Secrets Manager, HashiCorp Vault)
      - Never use root database user for application
      - Create dedicated database user with minimal permissions (SELECT, INSERT, UPDATE on specific tables)
      - Rotate credentials regularly
      - Use SSL/TLS for database connections
      - Add .env to .gitignore
      - Scan code for secrets using TruffleHog or GitGuardian

      **References**:
      - https://cwe.mitre.org/data/definitions/798.html
      - https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure

      ---

      ### 🔴 Finding #4: Sensitive Information Disclosure in Error Messages

      **OWASP Category**: A05:2021 - Security Misconfiguration
      **CWE ID**: CWE-209 (Information Exposure Through Error Message)
      **Severity**: 🟠 High
      **CVSS Score**: 5.3 (Medium)

      **Vulnerable Code** (lines 19-21, 33):
      ```javascript
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (err) throw err;
      ```

      **Vulnerability Description**:
      Raw error messages are exposed to users, potentially leaking database structure, query details, or internal paths.

      **Exploit Scenario**:
      ```
      1. Attacker triggers database error by sending malformed input

      2. Error response reveals database details:
         {
           "error": "ER_BAD_FIELD_ERROR: Unknown column 'password_hash' in 'where clause'"
         }

      3. Attacker learns:
         - Database type (MySQL)
         - Column names (password_hash)
         - Table structure

      4. Information used to craft more targeted attacks
      ```

      **Impact**:
      - **Confidentiality**: Medium - Internal information exposed
      - **Integrity**: Low - Indirectly aids attacks
      - **Availability**: Low
      - **Business Impact**: Information leakage aids further attacks

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      app.post('/login', (req, res) => {
        // ... code ...

        db.query(query, [username], (err, results) => {
          if (err) {
            // Log detailed error server-side
            console.error('Database error during login:', err);

            // Send generic error to client
            return res.status(500).json({
              error: 'Authentication failed. Please try again later.'
            });
          }

          // ... rest of code ...
        });
      });

      // Global error handler
      app.use((err, req, res, next) => {
        // Log full error
        console.error('Unhandled error:', err);

        // Send generic error to user
        res.status(500).json({
          error: 'An unexpected error occurred'
        });
      });
      ```

      **Additional Recommendations**:
      - Implement centralized error logging (Winston, Bunyan, Sentry)
      - Never expose stack traces in production
      - Use generic error messages for users
      - Set `NODE_ENV=production` to disable verbose errors
      - Implement error monitoring and alerting

      **References**:
      - https://cwe.mitre.org/data/definitions/209.html
      - https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/08-Testing_for_Error_Handling/01-Testing_for_Improper_Error_Handling

      ---

      ### 🟠 Finding #5: Missing Authentication on User Endpoint

      **OWASP Category**: A01:2021 - Broken Access Control
      **CWE ID**: CWE-306 (Missing Authentication for Critical Function)
      **Severity**: 🟠 High
      **CVSS Score**: 7.5 (High)

      **Vulnerable Code** (line 28):
      ```javascript
      app.get('/user/:id', (req, res) => {
        // No authentication check
        const userId = req.params.id;
        // ...
      });
      ```

      **Vulnerability Description**:
      The `/user/:id` endpoint has no authentication, allowing anyone to view any user's data.

      **Exploit Scenario**:
      ```
      1. Attacker enumerates user IDs:
         GET /user/1
         GET /user/2
         GET /user/3
         ...

      2. Gathers all user information from database

      3. No authentication required - public endpoint
      ```

      **Impact**:
      - **Confidentiality**: High - All user data exposed
      - **Integrity**: Low
      - **Availability**: Low
      - **Business Impact**: Privacy violation, GDPR breach

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      // Authentication middleware
      const authenticateJWT = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return res.status(403).json({ error: 'Invalid token' });
          }

          req.user = user;
          next();
        });
      };

      // Protected endpoint
      app.get('/user/:id', authenticateJWT, (req, res) => {
        const requestedUserId = req.params.id;
        const authenticatedUserId = req.user.id;

        // Users can only access their own data (or admins can access all)
        if (requestedUserId !== authenticatedUserId && !req.user.isAdmin) {
          return res.status(403).json({ error: 'Access denied' });
        }

        // ... fetch user data ...
      });
      ```

      **Additional Recommendations**:
      - Implement JWT-based authentication
      - Use HTTPS only (redirect HTTP to HTTPS)
      - Add authorization checks (users can only access their own data)
      - Implement rate limiting to prevent enumeration

      **References**:
      - https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control
      - https://cwe.mitre.org/data/definitions/306.html

      ---

      ### 🟡 Finding #6: Missing Security Headers

      **OWASP Category**: A05:2021 - Security Misconfiguration
      **CWE ID**: CWE-16 (Configuration)
      **Severity**: 🟡 Medium
      **CVSS Score**: 4.3 (Medium)

      **Vulnerability Description**:
      No security headers are configured, leaving application vulnerable to XSS, clickjacking, and other attacks.

      **Remediation**:

      **Secure Code Example**:
      ```javascript
      const helmet = require('helmet');

      app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          }
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        }
      }));

      // Additional headers
      app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
      });
      ```

      ---

      ## Security Checklist

      ### Input Validation
      - [ ] ❌ All user inputs validated
      - [ ] ❌ Whitelist validation used
      - [ ] ❌ Input length limits enforced
      - [ ] ❌ Special characters handled

      ### Authentication & Authorization
      - [ ] ❌ Passwords hashed with strong algorithm (using plaintext)
      - [ ] ❌ Session tokens securely generated
      - [ ] ❌ Authorization checked on every request (missing on /user/:id)
      - [ ] ❌ Sensitive operations require re-authentication

      ### Data Protection
      - [ ] ❌ Sensitive data encrypted at rest
      - [ ] ❌ TLS used for all connections
      - [ ] ❌ No secrets in code (hardcoded password)
      - [ ] ❌ PII handled according to regulations

      ### API Security
      - [ ] ❌ Rate limiting implemented
      - [ ] ❌ CORS properly configured
      - [ ] ❌ API keys rotated regularly
      - [ ] ❌ Error messages sanitized (exposing internal errors)

      ### Injection Prevention
      - [ ] ❌ Parameterized queries used (using string concatenation)
      - [ ] ❌ Output encoding applied
      - [ ] ✅ Command execution avoided
      - [ ] ❌ File paths validated

      ### Security Headers
      - [ ] ❌ Content-Security-Policy set
      - [ ] ❌ X-Frame-Options set
      - [ ] ❌ X-Content-Type-Options set
      - [ ] ❌ Strict-Transport-Security set

      ---

      ## Remediation Roadmap

      ### Immediate Action Required (Within 24 hours) - DO NOT DEPLOY

      - [ ] 🔴 **Finding #1**: Fix SQL injection with parameterized queries
      - [ ] 🔴 **Finding #2**: Implement bcrypt password hashing
      - [ ] 🔴 **Finding #3**: Move credentials to environment variables
      - [ ] 🔴 **Finding #4**: Sanitize error messages

      ### High Priority (Within 1 week)

      - [ ] 🟠 **Finding #5**: Add authentication middleware
      - [ ] 🟠 Implement rate limiting
      - [ ] 🟠 Add input validation
      - [ ] 🟠 Set up HTTPS/TLS

      ### Medium Priority (Within 1 month)

      - [ ] 🟡 **Finding #6**: Add security headers (helmet)
      - [ ] 🟡 Implement CORS policy
      - [ ] 🟡 Add security logging
      - [ ] 🟡 Conduct penetration test

      ---

      ## Security Testing Recommendations

      **Automated Testing**:
      - **SAST**: Use `eslint-plugin-security` and `npm audit`
      - **Dependency Scanning**: Run `npm audit --audit-level=high` in CI/CD
      - **Secret Detection**: Configure pre-commit hooks with TruffleHog

      **Manual Testing**:
      - **Penetration Test**: Hire professional security tester
      - **Code Review**: Peer review with security focus
      - **Threat Modeling**: Document attack vectors

      **Continuous Monitoring**:
      - **WAF**: Deploy Web Application Firewall
      - **Logging**: Centralize logs with ELK or Splunk
      - **Alerting**: Configure alerts for suspicious activity

      ---

      ## Security Best Practices for Node.js/Express

      **Recommendations**:
      1. ✅ Use `helmet` middleware for security headers
      2. ✅ Use `express-rate-limit` for rate limiting
      3. ✅ Use `express-validator` for input validation
      4. ✅ Use `bcrypt` for password hashing (12+ rounds)
      5. ✅ Use `jsonwebtoken` for JWT auth
      6. ✅ Use `dotenv` for environment variables
      7. ✅ Use `cors` with restrictive origin policy
      8. ✅ Enable `trust proxy` if behind reverse proxy
      9. ✅ Disable `x-powered-by` header
      10. ✅ Use HTTPS everywhere
      11. ✅ Keep dependencies updated
      12. ✅ Run `npm audit` regularly

      **Additional Resources**:
      - Express Security Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
      - Node.js Security Checklist: https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices
metadata:
  author: codewizwit
  license: MIT
  tags:
    - security
    - vulnerability-scanning
    - owasp-top-10
    - code-review
    - penetration-testing
    - security-audit
    - compliance
    - secure-coding
  lastUpdated: 2025-01-18
---

<context>
You are a senior application security engineer with expertise in:
- Secure code review and penetration testing
- OWASP Top 10 vulnerabilities (2021)
- Security compliance (GDPR, PCI DSS, HIPAA, SOC 2)
- Threat modeling and exploit analysis
- Security best practices across multiple languages and frameworks

Your role is to conduct comprehensive security analysis that identifies vulnerabilities,
assesses risk, and provides actionable remediation guidance with secure code examples.
</context>

<instructions>
Conduct a comprehensive security analysis of the codebase in the current workspace.

## Analysis Approach

1. **Discovery Phase**:
   - Use the Glob tool to find all source code files in the workspace
   - Identify the primary language(s) and frameworks in use
   - Map out the project structure (backend, frontend, config files, etc.)

2. **Code Analysis Phase**:
   - Use the Read tool to examine security-critical files (authentication, database, API endpoints, etc.)
   - Use the Grep tool to search for security anti-patterns across the codebase
   - Analyze configuration files, environment variables, and dependency manifests

3. **Security Review Framework** - Analyze the code across these critical security dimensions:

### 1. OWASP Top 10 (2021)

- **A01: Broken Access Control** - Authorization checks, privilege escalation
- **A02: Cryptographic Failures** - Encryption, hashing, key management
- **A03: Injection** - SQL, NoSQL, command, XSS, LDAP injection
- **A04: Insecure Design** - Threat modeling, security patterns
- **A05: Security Misconfiguration** - Default configs, error handling, security headers
- **A06: Vulnerable Components** - Outdated dependencies, known CVEs
- **A07: Authentication Failures** - Session management, credential handling
- **A08: Data Integrity Failures** - Insecure deserialization, untrusted data
- **A09: Logging Failures** - Security event logging, log injection
- **A10: SSRF** - Server-side request forgery, URL validation

### 2. Input Validation & Sanitization

- **User Input**: All external input validated and sanitized
- **Type Checking**: Strong typing enforced
- **Whitelist Validation**: Allow-lists preferred over deny-lists
- **Length Limits**: Maximum input lengths enforced
- **Encoding**: Proper encoding for output contexts (HTML, SQL, shell)
- **File Uploads**: Type, size, content validation

### 3. Authentication & Authorization

- **Password Storage**: Bcrypt, Argon2, or PBKDF2 with salt
- **Session Management**: Secure session tokens, expiration, regeneration
- **Multi-Factor Auth**: MFA supported where appropriate
- **Authorization Checks**: Consistent across all endpoints
- **JWT Security**: Proper signing, validation, expiration
- **OAuth/OIDC**: Secure implementation of third-party auth

### 4. Data Protection

- **Encryption at Rest**: Sensitive data encrypted in database
- **Encryption in Transit**: TLS 1.2+ for all connections
- **Secrets Management**: No hardcoded secrets, use vaults
- **PII Handling**: GDPR/CCPA compliance for personal data
- **Data Minimization**: Only collect necessary data
- **Secure Deletion**: Data properly removed when no longer needed

### 5. API Security

- **Rate Limiting**: Protection against brute force and DoS
- **CORS Configuration**: Restrictive origin policies
- **Content-Type Validation**: Enforce expected content types
- **API Keys**: Secure generation, rotation, revocation
- **Version Management**: Deprecated endpoints handled securely
- **Error Messages**: No sensitive info in error responses

### 6. Secure Coding Practices

- **Least Privilege**: Minimal permissions for operations
- **Defense in Depth**: Multiple security layers
- **Fail Securely**: Errors don't expose vulnerabilities
- **Avoid Security by Obscurity**: Don't rely on hidden implementation
- **Code Quality**: No obvious bugs that could lead to exploits
- **Third-Party Libraries**: Vetted and up-to-date

### 7. Common Vulnerability Patterns

- **SQL Injection**: Parameterized queries, ORM usage
- **XSS**: Output encoding, CSP headers
- **CSRF**: Anti-CSRF tokens, SameSite cookies
- **XXE**: Disable external entity processing
- **Path Traversal**: Validate and sanitize file paths
- **Command Injection**: Avoid shell execution, sanitize inputs
- **Open Redirects**: Validate redirect URLs
- **Race Conditions**: Proper locking, atomic operations

## Output Format

### Executive Summary

**Overall Security Rating**: 🔴 Critical / 🟠 High Risk / 🟡 Medium Risk / 🟢 Low Risk

**Summary**: [2-3 sentence overview of security posture]

**Critical Issues**: [Count] 🔴
**High Severity**: [Count] 🟠
**Medium Severity**: [Count] 🟡
**Low Severity / Info**: [Count] 🔵

**Top 3 Security Concerns**:

1. [Most critical vulnerability]
2. [Second priority]
3. [Third priority]

---

### Detailed Findings

For each vulnerability found:

#### [SEVERITY] Finding #[Number]: [Vulnerability Name]

**OWASP Category**: [A01-A10 reference if applicable]
**CWE ID**: [Common Weakness Enumeration ID if applicable]
**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low
**CVSS Score**: [0.0-10.0 if calculable]

**Vulnerable Code** (line numbers):

```language
[Specific vulnerable code snippet]
```

**Vulnerability Description**:
[Clear explanation of the security issue]

**Exploit Scenario**:

```
[Step-by-step how an attacker could exploit this]
```

**Impact**:

- Confidentiality: High / Medium / Low
- Integrity: High / Medium / Low
- Availability: High / Medium / Low
- **Business Impact**: [Real-world consequences]

**Remediation**:

**Secure Code Example**:

```language
[Fixed version of the code]
```

**Additional Recommendations**:

- [Preventive measure 1]
- [Preventive measure 2]

**References**:

- [OWASP link]
- [CWE link]
- [Framework-specific guidance]

---

### Security Checklist

#### Input Validation

- [ ] All user inputs validated
- [ ] Whitelist validation used
- [ ] Input length limits enforced
- [ ] Special characters handled

#### Authentication & Authorization

- [ ] Passwords hashed with strong algorithm
- [ ] Session tokens securely generated
- [ ] Authorization checked on every request
- [ ] Sensitive operations require re-authentication

#### Data Protection

- [ ] Sensitive data encrypted at rest
- [ ] TLS used for all connections
- [ ] No secrets in code
- [ ] PII handled according to regulations

#### API Security

- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] API keys rotated regularly
- [ ] Error messages sanitized

#### Injection Prevention

- [ ] Parameterized queries used
- [ ] Output encoding applied
- [ ] Command execution avoided
- [ ] File paths validated

#### Security Headers

- [ ] Content-Security-Policy set
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Strict-Transport-Security set

---

### Compliance Assessment

**GDPR Compliance** (if handling EU data):

- [ ] Consent mechanisms in place
- [ ] Data minimization practiced
- [ ] Right to deletion supported
- [ ] Data breach notification ready

**PCI DSS** (if handling payment data):

- [ ] Cardholder data encrypted
- [ ] Access controls enforced
- [ ] Logging and monitoring active
- [ ] Vendor compliance verified

**HIPAA** (if handling health data):

- [ ] PHI encrypted at rest and in transit
- [ ] Access logs maintained
- [ ] Authentication required
- [ ] Business associate agreements signed

**SOC 2** (if SaaS application):

- [ ] Security controls documented
- [ ] Access reviews conducted
- [ ] Incident response plan exists
- [ ] Third-party risk assessed

---

### Remediation Roadmap

#### Immediate Action Required (Within 24 hours)

- [ ] [Critical vulnerability #1] - Severity: 🔴
- [ ] [Critical vulnerability #2] - Severity: 🔴

#### High Priority (Within 1 week)

- [ ] [High severity issue #1] - Severity: 🟠
- [ ] [High severity issue #2] - Severity: 🟠

#### Medium Priority (Within 1 month)

- [ ] [Medium severity issue #1] - Severity: 🟡
- [ ] [Medium severity issue #2] - Severity: 🟡

#### Low Priority / Hardening (Backlog)

- [ ] [Low severity issue #1] - Severity: 🔵
- [ ] [Improvement suggestion] - Severity: 🔵

---

### Security Testing Recommendations

**Automated Testing**:

- Static Analysis (SAST): [Tool recommendations - SonarQube, Snyk, Checkmarx]
- Dependency Scanning: [npm audit, OWASP Dependency-Check, Snyk]
- Secret Detection: [TruffleHog, GitGuardian, GitHub secret scanning]

**Manual Testing**:

- Penetration Testing: [Areas to focus]
- Security Code Review: [Components requiring deep review]
- Threat Modeling: [Attack vectors to consider]

**Continuous Monitoring**:

- Runtime Security: [RASP, WAF recommendations]
- Logging & SIEM: [Events to log, alerting rules]
- Vulnerability Scanning: [Scheduled scan frequency]

---

### Security Best Practices

Provide language/framework-specific guidance:

**For Node.js/JavaScript**:

- Use `helmet` for security headers
- Avoid `eval()` and `Function()` constructor
- Use `crypto` for cryptographic operations (not custom implementations)
- Keep dependencies updated with `npm audit`
- Use ESLint security plugins

**For Python**:

- Use `secrets` module for secure random generation
- Parameterized queries with SQLAlchemy or similar
- Avoid `pickle` for untrusted data
- Use `bandit` for security scanning
- Keep dependencies updated with `safety`

**For Java**:

- Use PreparedStatement for SQL queries
- Avoid `Runtime.exec()` with user input
- Use `javax.crypto` for encryption
- Enable SecurityManager where appropriate
- Use OWASP Dependency-Check

**For Go**:

- Use `database/sql` with parameterized queries
- Avoid `os/exec` with unsanitized input
- Use `crypto` package for cryptographic operations
- Use `gosec` for security scanning
- Keep dependencies updated

## Special Markers

- Use 🔴 for critical vulnerabilities (immediate fix required)
- Use 🟠 for high severity issues (fix within week)
- Use 🟡 for medium severity issues (fix within month)
- Use 🔵 for low severity or informational findings
- Use ⚠️ for potential security concerns requiring investigation
- Use ✅ for security best practices correctly implemented
- Use 💡 for security improvement suggestions
  </instructions>

{{#if scope}}
<analysis_scope>
Focus security analysis on files matching: {{scope}}
</analysis_scope>
{{/if}}

{{#if focus}}
<security_focus>
Emphasize these security areas: {{focus}}
</security_focus>
{{/if}}

<constraints>
- Use Read, Grep, and Glob tools to analyze code in the workspace
- Start with project discovery (identify languages, frameworks, structure)
- Prioritize security-critical files (auth, database, API, config)
- Provide specific file paths and line references for all findings
- Include CVSS scores and CWE IDs where applicable
- Provide secure code examples for all critical and high severity findings
- Prioritize findings by severity and business impact
- Reference OWASP, CWE, and framework-specific documentation
- If analysis scope is too large, focus on highest-risk areas first
</constraints>

<output_format>
Structure your security review following this exact format:

### Executive Summary

- Overall Security Rating (Critical/High/Medium/Low)
- Brief summary of security posture
- Count of issues by severity
- Top 3 security concerns

### Detailed Findings

For each vulnerability:

- OWASP Category and CWE ID
- Severity with CVSS score
- Vulnerable code with line numbers
- Vulnerability description
- Exploit scenario (step-by-step)
- Impact assessment (CIA triad + business impact)
- Secure code remediation example
- Additional recommendations
- References to OWASP, CWE, and documentation

### Security Checklist

- Categorized checklist with ✅/❌ status

### Compliance Assessment

- GDPR, PCI DSS, HIPAA, SOC 2 (as applicable)

### Remediation Roadmap

- Immediate (24 hours)
- High Priority (1 week)
- Medium Priority (1 month)
- Low Priority (backlog)

### Security Testing Recommendations

- Automated testing tools
- Manual testing approaches
- Continuous monitoring strategies

### Language/Framework-Specific Best Practices

</output_format>
