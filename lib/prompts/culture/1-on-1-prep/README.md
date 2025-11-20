# 1-on-1 Pre-Read Email Generator

Generates structured pre-read emails for 1-on-1 meetings with sections for highlights/wins, current work, and questions/support needed to enable effective async communication.

## Overview

This prompt helps team members prepare thoughtful pre-read emails that enable productive 1-on-1 conversations with their managers. By sending a structured update 24 hours before the meeting, both parties can:

- Come prepared with context and talking points
- Use meeting time for discussion, not status updates
- Make meetings optional if async discussion suffices
- Build a written record of progress and challenges

## When to Use This Prompt

Use this pre-read generator when:

- **Weekly/Bi-weekly 1-on-1s** - Regular check-ins with your manager
- **Skip-level meetings** - Updates for leadership above your direct manager
- **Project check-ins** - Focused updates on specific initiatives
- **Performance review prep** - Documentation of accomplishments and growth
- **Onboarding updates** - New team members sharing progress
- **Manager-to-manager** - Peer updates between engineering managers

## Usage

### Basic Weekly Update

```yaml
time_period: this week
team_member_name: Alex Chen
manager_name: Jordan
```

### Project-Focused Update

```yaml
time_period: last two weeks
team_member_name: Sam Rodriguez
role: Engineering Manager
manager_name: Chris
projects: |-
  - Team velocity improvement initiative
  - Hiring for two senior positions
  - Q2 planning and roadmap
team_context: Engineering org is scaling rapidly
```

### New Team Member Update

```yaml
time_period: this month
team_member_name: Jamie Liu
role: Junior Developer
manager_name: Taylor
projects: |-
  - Learning React and TypeScript fundamentals
  - First production feature (user profile updates)
team_context: New to company (2 months in)
```

## Email Structure

Every pre-read includes three core sections:

### 🎉 Highlights & Wins

**Purpose**: Share accomplishments and positive momentum

**What to include**:

- Completed work (features shipped, projects finished)
- Achievements (metrics improved, problems solved)
- Recognition (team collaboration, helping others)
- Impact (business value, customer feedback)

**Best practices**:

- Be specific with metrics and outcomes
- Celebrate both big wins and small progress
- Give credit to collaborators
- Connect wins to team/company goals

### 🚀 Current Work & Focus

**Purpose**: Provide visibility into active projects and priorities

**What to include**:

- In progress work with status indicators (✅ on track, ⚠️ at risk, 🚫 blocked)
- Focus areas (what you're spending most time on)
- Upcoming work (what's next on the roadmap)
- Brief context on blockers

**Best practices**:

- Use clear status indicators for quick scanning
- Be honest about challenges
- Provide context on why work matters
- Link to relevant docs, PRs, tickets

### 🤝 Questions & Support Needed

**Purpose**: Surface specific areas where manager input would be valuable

**What to include**:

- Decisions needed (requiring manager input/approval)
- Guidance requested (technical direction, priorities)
- Resource needs (help, tools, access, budget)
- Feedback wanted (on approach, code, design)
- Career development (growth opportunities, mentorship)
- Blockers to escalate (requiring manager intervention)

**Best practices**:

- Be specific about what you need
- Frame as questions to invite discussion
- Prioritize the most important 2-3 items
- Provide context for manager to prepare
- Distinguish "need decision" vs "want input"

## Examples

### Example 1: Senior Engineer Weekly Update

**Before (Unprepared Meeting):**

Manager: "How's it going?"
Engineer: "Good! Shipped some stuff. Working on the migration. Oh, and I need to talk about priorities..."
Manager: "OK, let me pull up the board... what migration?"

**After (With Pre-Read):**

```
Subject: 1-on-1 Pre-Read: This Week

Hi Jordan,

Here's my pre-read for our upcoming 1-on-1.

---

## 🎉 Highlights & Wins

- Shipped React 18 migration for checkout flow (15% of app) - no production issues after 3 days
- Reduced initial bundle size by 180KB - Lighthouse score improved 72 → 89
- Pair programmed with Maya on component patterns - she shipped her first feature independently!
- Customer feedback positive - support tickets for "app feels slow" down 40%

---

## 🚀 Current Work & Focus

**Design System Migration** (✅ on track)
- Completed: Checkout, dashboard, settings (45% of app)
- Next: User profile and admin pages (end of next week)
- Risk: Custom CSS overrides need refactoring - adding 2 days

**Performance Sprint** (✅ on track)
- Implemented route-based code splitting
- Next: Image optimization and CDN setup

**Mentoring Maya** (✅ on track)
- Ramping well, ~5 hours/week investment

---

## 🤝 Questions & Support Needed

1. **Priority call needed**: Design system vs performance sprint - both Q2 blockers. Pause performance to finish migration faster, or parallel? Trade-offs: [link]

2. **Resource request**: 10 hours QA support for React 18 migration to reduce regression risk?

3. **Career development**: Explore Staff Engineer track? Drafted growth areas: [link]

---

Best,
Alex
```

**Result**: Manager comes prepared with answers. Discussion focuses on priority decision (30 min deep dive) rather than status updates.

### Example 2: Engineering Manager Bi-Weekly Update

**Input:**

```yaml
time_period: last two weeks
team_member_name: Sam Rodriguez
role: Engineering Manager
manager_name: Chris
projects: |-
  - Team velocity improvement
  - Hiring for two senior positions
  - Q2 planning and roadmap
team_context: Engineering org scaling rapidly
```

**Output Highlights:**

```
## 🎉 Highlights & Wins

- Team velocity up 35% after async standups - sustainable pace, not crunch
- Closed both senior positions - offers accepted, start in 3 weeks
- Shipped Q2 roadmap ahead of schedule - great stakeholder feedback
- Retention win: Maria staying after competing offer
- Two team members enrolled in leadership training

## 🚀 Current Work & Focus

**Team Health** (✅ on track)
- Velocity holding for 3 sprints
- PR review time down 40%, meetings down 25%

**Q2 Execution** (⚠️ at risk)
- Sprint 1-2 on track, Sprint 3 packed
- Dependency: Platform API changes slipping

## 🤝 Questions & Support Needed

1. **Escalation**: Platform team delay affects 3 Q2 commitments - align timelines?
2. **Strategic input**: Squad model (2 teams of 5) vs single team? Trade-offs: [link]
3. **Budget**: $15K conference attendance for 2-3 people?
4. **Career**: More cross-functional strategy exposure opportunities?
```

### Example 3: Junior Developer First Month

**Input:**

```yaml
time_period: this month
team_member_name: Jamie Liu
role: Junior Developer
manager_name: Taylor
projects: |-
  - Learning React/TypeScript fundamentals
  - First production feature
team_context: New to company (2 months in)
```

**Output Highlights:**

```
## 🎉 Highlights & Wins

- Shipped first feature to production! 🎉 User profile form - no bugs
- Completed TypeScript course - much more confident
- Contributing to code reviews - first suggestion implemented!
- Paired with 4 team members - learning different styles
- Fixed 3 backlog bugs independently

## 🚀 Current Work & Focus

**Notification Preferences Page** (✅ on track)
- Component structure done, working on validation
- Target: Code review ready Friday

**Learning** (✅ on track)
- React testing library tutorials
- Reading "The Pragmatic Programmer"

## 🤝 Questions & Support Needed

1. **Learning path**: Comfortable with React/TypeScript. Focus next on testing, performance, or state management?
2. **Code review feedback**: Are my comments helpful or off track?
3. **Stretch assignment**: Ready for more challenging work after notifications?
4. **Visibility**: Am I on track for 2-month junior dev? Areas to improve?
```

## Best Practices

### For Individual Contributors

**DO**:

- ✅ Lead with wins - even small ones matter
- ✅ Be honest about blockers and challenges
- ✅ Ask specific questions, not just "need help"
- ✅ Connect work to team/company goals
- ✅ Give credit to collaborators
- ✅ Provide links to context (PRs, docs, dashboards)

**DON'T**:

- ❌ Just list tasks - explain impact and context
- ❌ Save all asks for meeting - let manager prepare
- ❌ Bury important decisions in paragraphs
- ❌ Be vague ("stuck on feature" vs "need API design guidance")
- ❌ Skip wins because they feel "too small"

### For Managers

**DO**:

- ✅ Share team-level wins and challenges
- ✅ Surface patterns across multiple reports
- ✅ Be transparent about organizational context
- ✅ Ask for strategic input from your manager
- ✅ Flag risks early with mitigation plans
- ✅ Include team development updates

**DON'T**:

- ❌ Just delegate upward without solutions
- ❌ Hide team struggles - escalate appropriately
- ❌ Overload with tactical details
- ❌ Skip your own career development needs

### Timing and Frequency

**Optimal timing**:

- Send **24 hours before** the meeting
- Gives manager time to prepare thoughtful responses
- Allows canceling meeting if async discussion works
- Shows respect for manager's time

**Frequency recommendations**:

- **Weekly 1-on-1s**: Brief update (200-300 words)
- **Bi-weekly 1-on-1s**: Medium update (300-400 words)
- **Monthly 1-on-1s**: Comprehensive update (400-500 words)
- **Skip-levels**: Quarterly (focus on bigger picture)

**When to skip**:

- Nothing substantial to share (don't force it)
- Emergency meeting called for specific issue
- Mostly verbal/whiteboarding session planned

## Benefits of Pre-Read Emails

### For Team Members

1. **Clearer thinking** - Writing forces you to organize thoughts
2. **Better outcomes** - Manager comes prepared with answers
3. **Career documentation** - Written record of accomplishments
4. **Reduced anxiety** - Agenda clarity reduces meeting stress
5. **Time efficiency** - 30 min meeting = deep discussion, not status

### For Managers

1. **Better preparation** - Time to think through responses
2. **Pattern recognition** - Spot themes across team pre-reads
3. **Prioritization** - Focus meeting time on what matters most
4. **Documentation** - Written record for performance reviews
5. **Scalability** - Manage larger teams effectively

### For Teams

1. **Async-first culture** - Reduces meeting dependency
2. **Transparency** - Shared visibility into priorities
3. **Knowledge sharing** - Pre-reads can be shared with skip-levels
4. **Onboarding** - New managers can read history
5. **Remote-friendly** - Works across time zones

## Integration with Other Practices

### With Performance Reviews

Pre-read emails create a natural record of:

- Accomplishments over time
- Growth and skill development
- Impact on team and projects
- Challenges overcome

**Tip**: Keep a "brag document" folder with all your pre-reads for easy performance review prep.

### With Project Documentation

Pre-reads complement:

- **ADRs (Architecture Decision Records)** - Reference in "Questions & Support Needed"
- **Project status docs** - Pre-read summarizes, doc has details
- **Sprint reviews** - Pre-read is personal view, sprint review is team view

### With Async Communication

Pre-reads work well with:

- **Slack updates** - Pre-read is deeper than daily standup
- **Written RFCs** - Link to RFCs in "Current Work"
- **Demo videos** - Embed in "Highlights" section

## Common Pitfalls

### Pitfall 1: Too Much Status, Not Enough Insight

**Bad**:

```
Working on feature X. Made progress. Will continue next week.
```

**Good**:

```
**Feature X** (✅ on track)
- Completed API integration, reduced latency by 200ms
- Next: Frontend polish and error handling
- Learned: GraphQL subscriptions more complex than expected - paired with Backend team
```

### Pitfall 2: No Specific Asks

**Bad**:

```
Need help with the migration.
```

**Good**:

```
**Decision needed**: Should we migrate entire codebase at once (2 weeks, high risk) or incrementally (6 weeks, safer)? Trade-offs doc: [link]. Need to decide by Friday to hit Q2 timeline.
```

### Pitfall 3: Hiding Problems

**Bad**:

```
Everything is fine! No issues!
```

**Good**:

```
**Project X** (⚠️ at risk)
- Timeline slipping due to API dependency
- Mitigation: Mocking API responses to unblock frontend
- Need: Escalation to align Backend team timeline
```

### Pitfall 4: Walls of Text

**Bad**:

```
This week I worked on several things including the design system migration which involved updating React components and also I helped onboard the new team member and reviewed some PRs and also there was an incident on Tuesday that I helped debug...
```

**Good**:

```
## 🚀 Current Work

**Design System Migration** (✅ on track)
- Updated 12 components to new patterns
- 45% complete, on track for May 30th

**Mentoring Maya** (✅ on track)
- Onboarding going well, first feature shipped

**Incident Response** (resolved)
- Debugged Tuesday outage - root cause: cache invalidation
```

## Customization Tips

### For Different Relationships

**Direct manager (weekly)**:

- Tactical details OK
- Specific technical questions
- Day-to-day blockers

**Skip-level (monthly/quarterly)**:

- Broader themes and patterns
- Strategic questions
- Career trajectory discussions
- Team health observations

**Peer managers (as needed)**:

- Cross-team dependencies
- Resource sharing opportunities
- Best practice exchanges

### For Different Career Stages

**Junior developers**:

- Focus on learning progress
- Ask for guidance frequently
- Celebrate small wins
- Be vulnerable about struggles

**Mid-level engineers**:

- Balance execution and growth
- Drive technical decisions
- Mentor junior team members
- Expand scope of impact

**Senior+ engineers**:

- Strategic technical direction
- Organizational influence
- Team multiplier impact
- Thought leadership

**Managers**:

- Team health and performance
- Organizational challenges
- Resource and budget needs
- Strategic planning input

## Template Variations

### Rapid-Fire Format (for weekly check-ins)

```
✅ Shipped: [1-2 items]
🚀 In Progress: [1-2 items with status]
❓ Need: [1-2 specific asks]
```

### Project-Focused Format

```
## Project Alpha Update

**Status**: ✅ On track
**Highlights**: [Key progress]
**Risks**: [What could derail]
**Decisions Needed**: [Specific asks]
```

### Career-Focused Format (for growth conversations)

```
## Growth Progress

**Skills Developed**: [What I've learned]
**Impact Created**: [How I've grown scope]
**Feedback Received**: [What I'm working on]
**Next Level**: [What I'm working toward]
```

## Related Resources

- [Code Review Empathy](../code-review-empathy/README.md) - Constructive feedback practices
- [User Story Breakdown](../../planning/user-story-breakdown/README.md) - Project planning alignment
- [ACCOUNTABILITY.md](../../../../ACCOUNTABILITY.md) - Responsible AI usage guidelines
- Manager Tools podcast - Communication best practices and 1-on-1 frameworks

## Further Reading

- **"The Making of a Manager"** by Julie Zhuo - Effective 1-on-1 practices
- **"Radical Candor"** by Kim Scott - Direct, kind feedback
- **"Work in Public"** - Documentation culture and async communication
- **Lara Hogan's blog** - 1-on-1 templates and questions

## Contributing

To improve this pre-read generator:

1. Share examples of effective pre-reads from your team
2. Suggest section formats for different contexts
3. Provide templates for specific roles or situations
4. Share outcomes from using structured pre-reads

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
