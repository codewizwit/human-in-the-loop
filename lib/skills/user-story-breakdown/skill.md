---
name: user-story-breakdown
description: >-
  Breaks down epics and features into actionable, testable user stories.
  Use when user asks to "break down this epic", "create user stories",
  "plan sprint stories", or mentions "story breakdown".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# User Story Breakdown

Breaks down epics and features into actionable, testable user stories following Agile best practices. Generates story point estimates, acceptance criteria, technical considerations, and identifies dependencies for effective sprint planning.

## When to Activate

- User asks to break down an epic or feature into user stories
- User wants help with sprint planning or backlog grooming
- User mentions story points, acceptance criteria, or INVEST criteria
- User asks for help structuring Agile work items
- User needs a story map or dependency analysis for a feature

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>Please describe the epic or feature you want to break down. What needs to be built?</question>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Who are the target user personas for this feature?</question>
<allow_custom>true</allow_custom>
<default>Skip - I'll define them based on the epic</default>
</ask_user_question>

<ask_user_question>
<question>What is the technical context? (tech stack, existing systems, known constraints)</question>
<allow_custom>true</allow_custom>
<default>Skip - I'll infer from the codebase</default>
</ask_user_question>

<ask_user_question>
<question>Which estimation method do you prefer for story points?</question>
<options>

  <option value="fibonacci">Fibonacci (1, 2, 3, 5, 8, 13)</option>
  <option value="t-shirt">T-Shirt sizes (XS, S, M, L, XL)</option>
  <option value="linear">Linear (1-10)</option>
  <option value="none">No estimation needed</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Plan (if complex)

For large epics, enter plan mode to:

- Identify major story themes
- Map out dependencies between stories
- Determine sprint allocation strategy
- Identify technical spikes needed

### Step 3: Execute

Break down the epic into user stories following INVEST criteria:

- **I**ndependent - Can be developed separately
- **N**egotiable - Flexible implementation details
- **V**aluable - Delivers user/business value
- **E**stimable - Team can size the work
- **S**mall - Fits in a sprint
- **T**estable - Clear success criteria

For each user story provide:

1. **Story format** - "As a [user], I want [goal], so that [benefit]"
2. **Acceptance criteria** - Given/When/Then format
3. **Story points** - Using selected estimation method
4. **Technical notes** - Implementation considerations
5. **Dependencies** - What must be done first
6. **Testing strategy** - Unit, integration, E2E needs

## Output Format

<output_format>
Write the user story breakdown to a markdown file in the workspace. Use proper markdown syntax with clear headings, priority markers, structured lists, tables, and formatted sections.

# [Epic Name] - Story Breakdown

## Epic Summary

**Epic Name**: [name]
**Epic Goal**: [goal statement]
**User Value**: [user value proposition]
**Business Value**: [business value proposition]

## Story Map

| Sprint | Story   | Points | Priority | Dependencies |
| ------ | ------- | ------ | -------- | ------------ |
| 1      | [story] | [pts]  | High     | None         |
| 1      | [story] | [pts]  | High     | Story 1      |
| 2      | [story] | [pts]  | Medium   | Story 2      |

## User Stories

### Story 1: [Title]

**Priority**: High / Medium / Low
**Story Points**: [estimate]

> As a [user], I want [goal], so that [benefit]

**Acceptance Criteria**:

- Given [context], when [action], then [expected result]
- Given [context], when [action], then [expected result]

**Technical Notes**:

- [Implementation consideration]
- [Architecture decision]

**Dependencies**: [list or none]

**Testing Strategy**:

- Unit: [what to test]
- Integration: [what to test]
- E2E: [what to test]

---

## Sprint Recommendations

### Sprint 1: Foundation

- Story 1 ([pts])
- Story 2 ([pts])
- **Sprint Total**: [X] points

### Sprint 2: Core Features

- Story 3 ([pts])
- **Sprint Total**: [X] points

## Risk Assessment

| Risk   | Impact | Likelihood | Mitigation   |
| ------ | ------ | ---------- | ------------ |
| [risk] | High   | Medium     | [mitigation] |

## Total Estimates

- **Total Stories**: [X]
- **Total Points**: [X]
- **Estimated Sprints**: [X]

### Special Markers

- High priority stories (must-have for MVP)
- Medium priority stories (important but not critical)
- Low priority stories (nice-to-have)
- Stories with significant technical risk
- Stories with complex dependencies
- Stories requiring technical spikes
  </output_format>

## Best Practices

- Follow INVEST criteria for every story
- Include Given/When/Then acceptance criteria
- Identify dependencies between stories early
- Group related stories for sprint planning
- Flag technical spikes separately from feature stories
- Include testing strategy for each story
- Keep stories small enough to complete in a single sprint

## Anti-Patterns

- Writing stories that are too large to estimate
- Skipping acceptance criteria
- Creating stories with circular dependencies
- Mixing technical tasks with user-facing stories without clear value
- Estimating without considering team velocity
- Breaking down into tasks instead of user stories

## Examples

**Authentication epic:**

> Break down a user authentication system epic into stories. We need signup, login, password reset, OAuth, and RBAC. Tech stack is React + Node.js + PostgreSQL.

**E-commerce feature:**

> Create user stories for a shopping cart feature with add/remove items, quantity updates, saved carts, and checkout flow.

**API migration:**

> Break down the migration from REST API v1 to v2. We need to support both versions during transition.

---

**Human-in-the-Loop by codewizwit**
