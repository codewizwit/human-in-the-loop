# User Story Breakdown

Breaks down epics and features into actionable, testable user stories with acceptance criteria and story point estimates.

## What You'll Be Asked

- **Epic/feature description** - What needs to be built
- **User personas** (optional) - Who will use this feature
- **Acceptance criteria** (optional) - Success criteria or constraints
- **Technical context** (optional) - Tech stack, existing systems, dependencies

## Usage Examples

### Example 1: Authentication System Epic

Break down user registration, login, password reset, OAuth, and RBAC into sprintable stories.

**Expected Output:**

```markdown
## Epic Summary

**Epic Name:** User Authentication & Access Control
**User Value:** Secure access with multiple auth options

## User Stories

### Story 1: Basic Email/Password Registration

**As a** new user
**I want** to create an account with email/password
**So that** I can access the application

**Story Points:** 5
**Priority:** 🔴 High (MVP)
```

### Example 2: E-Commerce Checkout Flow

Decompose multi-step checkout into independent stories with dependencies and testing strategy.

**Expected Output:**

```markdown
### Story 3: Payment Processing Integration

**Story Points:** 8
**Dependencies:** 🔗 Stories 1-2 must be complete
**Testing Strategy:**

- Unit: Payment validation logic
- Integration: Stripe API mocking
- E2E: Full checkout flow

**Technical Notes:**
⚠️ PCI DSS compliance required
```

## Related Resources

- [Agile User Story Guide](https://www.atlassian.com/agile/project-management/user-stories) - Story writing best practices
- [INVEST Criteria](https://www.agilealliance.org/glossary/invest/) - Quality user story framework
- [1-on-1 Prep](../../culture/1-on-1-prep) - Sprint retrospective communication
