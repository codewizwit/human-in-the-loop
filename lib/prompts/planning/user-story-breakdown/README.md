# User Story Breakdown

Breaks down epics and features into actionable, testable user stories following Agile best practices. Generates story points estimates, acceptance criteria, technical considerations, and identifies dependencies for effective sprint planning.

## Overview

This prompt transforms high-level epics into well-defined user stories that follow the INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable). It provides comprehensive breakdown with acceptance criteria, technical considerations, dependency mapping, and sprint planning recommendations.

## When to Use This Prompt

Use this story breakdown when:

- **Epic Planning** - Converting large features into deliverable stories
- **Sprint Planning** - Preparing backlog for upcoming sprints
- **Estimation Sessions** - Breaking down work for story pointing
- **Technical Refinement** - Adding technical details to user stories
- **Dependency Analysis** - Understanding story relationships and blockers
- **New Feature Planning** - Structuring new capabilities for development

## Usage

### Basic Epic Breakdown

```yaml
epic_description: |
  Add multi-language support to the application, allowing users to
  switch between English, Spanish, and French. All UI text, emails,
  and error messages should be translated.
```

### With User Personas

```yaml
epic_description: |
  Build a dashboard for sales managers to track team performance,
  view pipeline metrics, and generate reports.

user_personas: |
  - Sales Managers: Need visibility into team performance
  - Sales Reps: Need to see their individual metrics
  - Executives: Need high-level summary for board meetings
```

### With Technical Context

```yaml
epic_description: |
  Implement real-time notifications for user actions like mentions,
  likes, and new followers.

technical_context: |
  Stack: React frontend, Node.js backend, MongoDB database
  Existing: WebSocket server already running for chat
  Constraints: Mobile push notifications via Firebase
  Performance: Must handle 10K concurrent users

estimation_method: fibonacci
```

### Complete Context

```yaml
epic_description: |
  Build a payment system supporting credit cards and PayPal,
  with subscription management and invoice generation.

user_personas: |
  - Customers: Pay for services easily and securely
  - Admins: Manage subscriptions and view payment history

technical_context: |
  Using Stripe for payment processing
  PostgreSQL for transaction storage
  Need PCI DSS compliance
  Must support webhook handling for payment events

acceptance_criteria: |
  - Users can save payment methods securely
  - Subscriptions auto-renew on schedule
  - Failed payments trigger retry logic
  - Invoices emailed automatically
  - Admin can refund payments

estimation_method: t-shirt-sizes
```

## Output Structure

### Epic Summary

- Epic name and goal
- User and business value
- High-level overview

### User Stories

For each story:

- **Priority** (High/Medium/Low with visual markers)
- **Story Points** (Using specified estimation method)
- **Sprint Ready** status
- **User Story** in standard format
- **Acceptance Criteria** in Given-When-Then format
- **Technical Considerations**
- **Dependencies** (depends on / blocks)
- **Testing Strategy**
- **Definition of Done** checklist

### Story Breakdown Summary

- Total stories and points
- Distribution by priority
- Estimated sprints needed
- Recommended sprint plan

### Dependency Graph

- Visual representation of story relationships
- Critical path identification
- Blocking dependencies

### Risks and Assumptions

- Identified risks with mitigation
- Assumptions needing validation
- Open questions for stakeholders

### Technical Spikes

- Spikes needed to unblock stories
- Time-boxed research tasks
- Success criteria for spikes

## Example: Authentication System

**Input:**

```yaml
epic_description: |
  Build a user authentication system allowing sign up, login,
  password reset, and profile management. Support email/password
  and OAuth (Google, GitHub). Include RBAC with admin and user roles.

technical_context: |
  React frontend, Node.js/Express backend, PostgreSQL
  Need: Auth middleware, JWT tokens, database schema

estimation_method: fibonacci
```

**Output Highlights:**

```markdown
## Epic Summary

**Epic Name**: User Authentication & Access Control
**Total Stories**: 8 stories (52 points)
**Estimated Sprints**: 3 sprints

## User Stories (Sample)

### Story 1: Email/Password Sign Up

**Priority**: 🔴 High
**Story Points**: 5
**Sprint Ready**: Yes

**User Story**:
```

As a new user
I want to create an account with my email and password
So that I can access the application

```

**Acceptance Criteria**:

- [ ] **Given** valid email and password, **When** I submit, **Then** account created and I'm logged in
- [ ] **Given** invalid email format, **When** I submit, **Then** validation error shown
- [ ] **Given** weak password, **When** I submit, **Then** password requirements displayed
- [ ] **Given** existing email, **When** I submit, **Then** "Email already registered" error

**Technical Considerations**:

- Use bcrypt for password hashing (10 rounds)
- PostgreSQL users table schema
- Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special char
- Rate limiting: 5 attempts/IP/hour

**Dependencies**:

- Depends on: None (foundational)
- Blocks: Story 2 (Login), Story 4 (Profile)

**Testing Strategy**:

- Unit: Password hashing, email validation
- Integration: Sign-up API with database
- E2E: Complete sign-up flow

## Sprint Plan

**Sprint 1** (23 points):

- Story 1: Email/Password Sign Up (5)
- Story 2: Email/Password Login (3)
- Story 3: Password Reset (8)
- Story 6: RBAC Spike (3)
- Story 4: Profile Management (5)

**Sprint 2** (18 points):

- Story 5a: OAuth - Google (8)
- Story 5b: OAuth - GitHub (5)
- Story 8: RBAC Middleware (5)

**Sprint 3** (8 points):

- Story 7: Admin User Management (8)
```

## INVEST Criteria

The prompt ensures every story follows INVEST:

### Independent

- Stories can be developed in any order (within dependency constraints)
- Minimal coupling between stories
- Each story delivers standalone value

### Negotiable

- Acceptance criteria are specific but implementation details are flexible
- Room for technical discussion with team
- Can adjust scope based on feedback

### Valuable

- Every story delivers clear user or business value
- "So that" clause explains the benefit
- Ties back to epic goals

### Estimable

- Stories have sufficient detail for estimation
- Technical considerations clarify unknowns
- Spikes called out when estimation not possible

### Small

- Stories completable within 1 sprint
- Large stories (>8 points) flagged for breakdown
- Guidance on further splitting provided

### Testable

- Clear acceptance criteria
- Testing strategy defined
- Definition of done checklist

## Story Sizing Guidelines

### Small Stories (1-3 points)

**Characteristics**:

- Simple CRUD operations
- UI updates without backend changes
- Configuration changes
- Minor bug fixes

**Examples**:

- Add validation to existing form field
- Update button text and styling
- Add logging to existing endpoint

### Medium Stories (5-8 points)

**Characteristics**:

- Full-stack feature (UI + API + database)
- Integration with existing system
- Moderate complexity
- Some unknowns but estimable

**Examples**:

- Add new API endpoint with database queries
- Implement client-side form with validation
- Integrate third-party service (known API)

### Large Stories (13+ points)

**Characteristics**:

- Complex integration across multiple systems
- Significant unknowns
- Requires technical spike
- Should be broken down further

**Action**: The prompt identifies these and suggests breakdown.

## Acceptance Criteria Best Practices

### Given-When-Then Format

```
Given [initial context/state]
When [action or event]
Then [expected outcome]
```

**Example**:

```
Given I am a logged-in user with admin role
When I navigate to the user management page
Then I see a list of all users with edit/delete actions
```

### Non-Functional Requirements

Include in acceptance criteria:

- **Performance**: Page loads in <2 seconds
- **Security**: Passwords encrypted at rest
- **Accessibility**: Keyboard navigation supported
- **Internationalization**: UI supports RTL languages

### Edge Cases

Always consider:

- Empty states (no data, no results)
- Error conditions (network failure, invalid input)
- Boundary values (max length, min value)
- Concurrent actions (simultaneous edits)

## Dependency Management

### Types of Dependencies

**Story Dependencies**:

- Story A must complete before Story B starts
- Example: Sign Up before Login

**Technical Dependencies**:

- Infrastructure, APIs, third-party services
- Example: OAuth requires provider credentials

**External Dependencies**:

- Design assets, content, stakeholder decisions
- Example: Copy text approval from marketing

### Dependency Strategies

**Parallel Work**:

- Identify independent stories for concurrent development
- Distribute across team members

**Critical Path**:

- Identify longest chain of dependencies
- Prioritize to unblock downstream work

**Spike First**:

- Complete technical spikes before dependent stories
- Timeboxed research reduces risk

## Sprint Planning Integration

### Velocity-Based Planning

**Calculate Team Velocity**:

- Average story points completed per sprint (last 3-5 sprints)
- Example: Team completes 20-25 points/sprint

**Load Sprints**:

- Don't exceed team velocity
- Account for holidays, meetings, etc.
- Leave buffer for unforeseen work

### Prioritization

**MoSCoW Method**:

- **Must Have**: Critical for MVP (🔴 High priority)
- **Should Have**: Important but not critical (🟡 Medium)
- **Could Have**: Nice to have (🟢 Low)
- **Won't Have**: Out of scope

### Sprint Goals

Each sprint should have clear goal:

- Sprint 1: "Users can sign up and log in"
- Sprint 2: "OAuth and authorization complete"
- Sprint 3: "Admin user management functional"

## Technical Spikes

### When to Create Spikes

- **Unknown Technology**: New library or framework
- **Architecture Decision**: Multiple valid approaches
- **Performance Validation**: Will approach meet requirements?
- **Third-Party Integration**: API behavior unclear

### Spike Structure

```markdown
### Spike: OAuth Provider Selection

**Goal**: Choose OAuth library for Node.js

**Research Questions**:

- Passport.js vs. simple-oauth2 vs. custom?
- Token refresh handling?
- Multi-provider support?

**Time Box**: 1 day

**Success Criteria**:

- Library selected with rationale documented
- Proof-of-concept with Google OAuth
- Unblocks Story 5a (OAuth Login)

**Deliverables**:

- ADR (Architecture Decision Record)
- Sample code
- Integration plan
```

## Common Patterns

### API Endpoint Story

```
Story: Create User Profile Endpoint

As a frontend developer
I want a GET /api/profile endpoint
So that I can display user profile information

Acceptance Criteria:
- [ ] GET /api/profile returns authenticated user's data
- [ ] Response includes: id, email, name, created_at
- [ ] Returns 401 if not authenticated
- [ ] Returns 200 with JSON on success
- [ ] Response time <200ms

Technical:
- Use requireAuth middleware
- Query users table by JWT user_id
- Exclude password_hash from response
```

### UI Component Story

```
Story: User Profile Card Component

As a user
I want to see my profile information in a card
So that I can verify my account details

Acceptance Criteria:
- [ ] Card displays user avatar, name, email
- [ ] Card is responsive (mobile and desktop)
- [ ] Clicking "Edit" navigates to profile edit page
- [ ] Avatar shows initials if no image uploaded

Technical:
- React functional component
- Styled with Tailwind CSS
- Use ProfileContext for data
- Unit tests with React Testing Library
```

### Database Migration Story

```
Story: Add User Roles Table

As a developer
I want a roles table in the database
So that we can implement role-based access control

Acceptance Criteria:
- [ ] Migration creates roles table (id, name, description)
- [ ] Migration creates user_roles join table
- [ ] Seed default roles (admin, user)
- [ ] Migration is reversible (down migration)
- [ ] Foreign keys enforce referential integrity

Technical:
- Use Knex.js migrations
- Add indexes on user_id and role_id
- Document schema in README
```

## Best Practices

### For Product Owners

1. **Clear Epic Definition** - Provide context, goals, and acceptance criteria
2. **Identify Users** - Define personas and their needs
3. **Prioritize Ruthlessly** - Not everything is high priority
4. **Be Available** - Answer open questions quickly
5. **Review Stories** - Validate acceptance criteria match intent

### For Development Teams

1. **Ask Questions** - Clarify ambiguity before committing
2. **Estimate Honestly** - Include testing and documentation time
3. **Challenge Large Stories** - Push back on >8 point stories
4. **Update Stories** - Refine acceptance criteria as you learn
5. **Track Velocity** - Use historical data for planning

### For Story Writing

1. **User-Centric** - Focus on user benefit, not implementation
2. **Specific Criteria** - Vague criteria lead to scope creep
3. **Vertical Slices** - Full-stack stories deliver value
4. **Include Non-Functionals** - Performance, security, accessibility
5. **Technical Notes** - Guide developers without constraining

## Anti-Patterns to Avoid

### Technical Stories Without User Value

❌ **Bad**:

```
As a developer
I want to refactor the authentication module
So that the code is cleaner
```

✅ **Good**:

```
As a user
I want faster login times
So that I can access my account quickly

Technical: Refactor auth module to reduce login time from 2s to <500ms
```

### Horizontal Slices

❌ **Bad**: Separate stories for "Build API", "Build Database", "Build UI"

✅ **Good**: Single story delivering end-to-end feature

### Missing Acceptance Criteria

❌ **Bad**: "Add user search functionality"

✅ **Good**: Detailed criteria with search behavior, results display, error handling

### Overly Large Stories

❌ **Bad**: 21-point story "Build entire authentication system"

✅ **Good**: Broken into 6-8 smaller stories with clear scope

## Integration with Agile Workflow

### Backlog Refinement

1. **Review Epic** - Understand goals and context
2. **Generate Stories** - Use this prompt for initial breakdown
3. **Team Review** - Validate with developers
4. **Estimate** - Planning poker or other method
5. **Prioritize** - Order by business value and dependencies

### Sprint Planning

1. **Set Sprint Goal** - Based on priority stories
2. **Select Stories** - Within team velocity
3. **Confirm Readiness** - All dependencies clear
4. **Assign Owners** - Developers commit to stories

### Daily Standups

- Reference story IDs when discussing progress
- Update story status (in progress, blocked, done)
- Raise blockers related to dependencies

### Sprint Review

- Demo completed stories against acceptance criteria
- Get product owner sign-off
- Update story points if estimates were off

### Retrospective

- Review story breakdown quality
- Identify patterns in over/under estimation
- Improve future story writing

## Related Resources

- [E2E Strategy Generator](../../testing/e2e-strategy/README.md) - Test planning
- [ACCOUNTABILITY.md](../../../../ACCOUNTABILITY.md) - Responsible AI usage

Coming soon:

- Technical Spike Template - Research task planning
- API Documentation Generator - Document APIs

## Contributing

To improve this user story breakdown prompt:

1. Share examples of well-broken-down epics
2. Suggest additional acceptance criteria patterns
3. Provide domain-specific story templates (e-commerce, SaaS, mobile)
4. Report edge cases or missing considerations
5. Contribute estimation calibration data

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
