---
name: 1-on-1-prep
description: >-
  Generates structured pre-read emails for 1-on-1 meetings with highlights,
  current work, and support needed sections. Use when user asks to "prepare
  for my 1-on-1", "write a pre-read", or mentions "1-on-1 prep".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# 1-on-1 Pre-Read Email Generator

Generates structured pre-read emails for 1-on-1 meetings that enable effective
async communication between team members and their managers. Produces
professional emails with three key sections: highlights and wins, current work
and focus, and questions or support needed. Adapts tone and content to the
author's role level (junior, senior, manager) and the time period covered.

## When to Activate

- User asks to prepare for a 1-on-1 meeting
- User mentions writing a pre-read email or meeting prep
- User wants to summarize their work for their manager
- User asks for help structuring a status update for a 1-on-1

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What time period should this pre-read cover?</question>
<option value="week">This week</option>
<option value="two-weeks">Last two weeks</option>
<option value="month">This month</option>
<option value="custom">Custom period</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is your role level?</question>
<option value="junior">Junior or early-career engineer</option>
<option value="senior">Senior engineer or individual contributor</option>
<option value="lead">Tech lead or staff engineer</option>
<option value="manager">Engineering manager</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What context can you share about your current work?</question>
<option value="projects">I can describe my current projects and status</option>
<option value="codebase">Review my recent commits and PRs for context</option>
<option value="both">Both project descriptions and codebase review</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For managers with multiple reports or multi-project updates, enter plan mode:

<EnterPlanMode>
<summary>
Outline the topics to cover, identify key wins and blockers, and structure
the pre-read sections based on role level and organizational context.
</summary>
</EnterPlanMode>

### Step 3: Gather Additional Details

If the user chose codebase review, use discovery to supplement the pre-read:

1. Use Glob to find recent git logs or changelogs
2. Use Grep to search for PR references or completed work
3. Use Read to examine recent documentation updates

Otherwise, proceed with user-provided project descriptions.

### Step 4: Generate Pre-Read

Compose the pre-read email using this structure:

**Highlights and Wins**

- Completed work with specific metrics and outcomes
- Achievements, problems solved, goals met
- Team collaboration and recognition of others
- Business value delivered and customer impact

**Current Work and Focus**

- Active projects with status indicators (on track, at risk, blocked)
- What the author is spending the most time on
- Upcoming work on the roadmap
- Brief mention of blockers (detailed asks go in Section 3)

**Questions and Support Needed**

- Decisions requiring manager input or approval
- Guidance on technical direction or priorities
- Resource needs (tools, budget, people)
- Career development topics for discussion
- Blockers requiring escalation

### Step 5: Deliver Pre-Read

Write the formatted pre-read email to a markdown file in the workspace.

## Output Format

<output_format>
Write the 1-on-1 pre-read email to a markdown file in the workspace. Structure
as follows:

**Email Header**

Subject line, greeting, and brief introductory sentence.

**Highlights and Wins**

3-5 bullet points with specific accomplishments, metrics, and impact. Give
credit to collaborators when relevant.

**Current Work and Focus**

Organized by project or focus area. Each item includes a status indicator
(on track, at risk, blocked), brief description of progress, and next steps.

**Questions and Support Needed**

Numbered list of 2-5 specific, actionable asks. Each includes enough context
for the manager to prepare a response. Distinguishes between decisions needed
and input wanted.

**Closing**

Brief, professional sign-off.

Target length: 300-500 words total. Professional but authentic tone. Formatted
for scannability with bullet points, bold text, and clear section breaks.
</output_format>

## Best Practices

- Be specific with metrics and outcomes rather than vague summaries
- Celebrate both significant wins and incremental progress
- Give credit to collaborators and team members by name
- Use clear status indicators for project updates
- Frame questions to invite discussion rather than demand answers
- Prioritize the 2-3 most important asks rather than listing everything
- Send the pre-read 24 hours before the meeting when possible
- Adapt tone to role level (junior: learning-focused; senior: strategic; manager: team-focused)

## Anti-Patterns

- Do not write overly long pre-reads that managers will not have time to read
- Do not include only positive updates while hiding blockers or risks
- Do not make vague requests like "I need help" without specifying what kind
- Do not skip the wins section even when things are challenging
- Do not include routine updates better suited for Slack or daily standups
- Do not use an impersonal or overly formal tone that lacks authenticity

## Examples

### Example 1: Senior Engineer Weekly Update

**Input**: "I need to write a pre-read for my 1-on-1 with Jordan. I'm a Senior
Frontend Engineer working on design system migration and performance optimization."

**Output**: Structured pre-read email covering shipped features with performance
metrics, migration progress with timeline and risks, mentoring activities, and
specific asks around priority calls, resource requests, and career development.

### Example 2: Engineering Manager Bi-Weekly Update

**Input**: "Need a pre-read for my 1-on-1 with Chris covering the last two weeks.
I'm an Engineering Manager working on team velocity, hiring, and Q2 planning."

**Output**: Manager-focused pre-read with team performance metrics, hiring
pipeline status, strategic planning progress, escalation requests for
cross-team dependencies, and organizational input needed on team structure.

### Example 3: Junior Developer Monthly Check-In

**Input**: "Help me write a monthly pre-read for Taylor. I'm a Junior Developer,
2 months at the company, learning React and TypeScript."

**Output**: Learning-focused pre-read highlighting first feature shipped,
completed training, growing code review contributions, and questions about
learning path guidance, stretch assignments, and performance expectations.
