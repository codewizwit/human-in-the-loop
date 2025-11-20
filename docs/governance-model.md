# Governance Model

Quality review process, versioning strategy, and metrics for the Human in the Loop toolkit.

---

## Review Process

### Automated Checks (GitHub Actions)

All pull requests trigger automated validation:

**1. Quality Checks**

- TypeScript compilation
- Type checking (strict mode)
- Code formatting (Prettier)
- Security audit (`pnpm audit`)

**2. Documentation Checks**

- TypeDoc comments present (no inline comments)
- README exists in new feature directories
- Usage examples included
- Clear section headers

**3. Contribution Validation**

All validation scripts located in `src/governance/checks/`:

- `validate-prompts.sh` - YAML structure and required metadata
- `check-docs.sh` - README presence and completeness
- `check-inline-comments.sh` - TypeDoc-only enforcement
- `check-links.sh` - Documentation link validation

**4. Security**

- Secret detection (Trufflehog)
- No hardcoded credentials
- Dependency vulnerabilities

### Running Checks Locally

Before submitting a PR, run all governance checks:

```bash
# Run all checks
pnpm validate

# Or run individual checks
./src/governance/checks/validate-prompts.sh
./src/governance/checks/check-docs.sh
./src/governance/checks/check-inline-comments.sh
./src/governance/checks/check-links.sh
```

### Human Review

After automated checks pass, maintainers review for:

**Quality & Usefulness**

- Does it solve a real problem?
- Is documentation clear and complete?
- Are examples realistic?
- Is it well-tested?

**Safety & Accountability**

- Aligns with [Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md)?
- Preserves human oversight?
- Appropriate guardrails?
- Transparent operation?

**Technical Correctness**

- Code quality
- Best practices
- Performance
- Maintainability

### Review Timeline

- **Automated checks**: < 10 minutes
- **First maintainer review**: 2-5 business days
- **Follow-up**: 1-2 business days
- **Approval**: After all feedback addressed

---

## Versioning Strategy

### Semantic Versioning

All toolkit components follow [semver](https://semver.org/):

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

**Examples:**

- `1.0.0` → `1.0.1`: Bug fix
- `1.0.1` → `1.1.0`: New feature added
- `1.1.0` → `2.0.0`: Breaking change

### Version Constraints

**For Prompts:**

- Changing template structure → MAJOR
- Adding optional variables → MINOR
- Fixing typos/clarifications → PATCH

**For Agents:**

- Changing required permissions → MAJOR
- Adding new tools → MINOR
- Bug fixes → PATCH

### Deprecation Policy

When introducing breaking changes:

1. **Announce** deprecation 3 months in advance
2. **Maintain** old version during deprecation period
3. **Provide** migration guide
4. **Remove** after deprecation period ends

---

## Release Process

### Release Cycle

- **Patches**: Released as needed (bug fixes)
- **Minor**: Monthly releases (new features)
- **Major**: Quarterly releases (breaking changes)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version numbers bumped
- [ ] Migration guide written (if breaking changes)
- [ ] Release notes drafted
- [ ] Security audit completed

---

## Quality Metrics

### Tool Quality Metrics

Each tool is tracked for:

**Usage Metrics:**

- Install count
- Active users
- Retention rate

**Quality Metrics:**

- User ratings (1-5 stars)
- Issue reports
- Bug resolution time

**Impact Metrics:**

- Time saved
- Errors prevented
- Developer satisfaction

### Toolkit Health Dashboard

View metrics:

```bash
hit stats --toolkit-health

# Output:
# Total Tools: 127
# Active Users: 1,453
# Avg Rating: 4.7/5
# Bug Resolution Time: 2.3 days
```

### Tool Lifecycle

Tools progress through stages:

1. **Beta** - New, under evaluation
2. **Stable** - Proven, recommended
3. **Mature** - Battle-tested, widely used
4. **Deprecated** - Being phased out
5. **Archived** - No longer maintained

---

## Maintenance Requirements

### Tool Maintainers

Contributors who submit tools commit to:

- **Respond to issues** within 1 week
- **Fix critical bugs** within 2 weeks
- **Maintain compatibility** with toolkit updates
- **Keep documentation current**
- **Support for 6+ months** after submission

### Inactive Tools

Tools become **deprecated** if:

- No maintenance for 6+ months
- Critical bugs unfixed for 3+ months
- Incompatible with current toolkit version
- Better alternative exists

---

## Community Governance

### Roles

**Contributors**

- Submit tools
- Report issues
- Suggest improvements

**Maintainers**

- Review contributions
- Merge pull requests
- Release new versions
- Moderate discussions

**Core Team**

- Set project direction
- Make final decisions
- Maintain infrastructure

### Decision Making

**Minor Decisions**: Maintainer consensus
**Major Decisions**: Core team vote
**Breaking Changes**: Community RFC process

---

## Compliance & Auditing

### Audit Logs

All AI interactions are logged:

- Timestamp
- User
- Tool used
- Input (redacted)
- Output (redacted)
- Evaluation results

### Compliance Requirements

Organizations using the toolkit must:

- Review audit logs regularly
- Report security incidents
- Follow data handling policies
- Respect user privacy

### Security Incident Response

1. **Report** via [GitHub Security Advisories](https://github.com/codewizwit/human-in-the-loop/security/advisories/new)
2. **Triage** within 24 hours
3. **Fix** critical issues within 48 hours
4. **Disclose** after fix is deployed
5. **Post-mortem** within 1 week

---

## Related Documentation

- [Contributing Guidelines](./contributing-guidelines.md) - How to submit tools
- [Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md) - Core principles
- [Architecture](./architecture.md) - Technical overview

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
