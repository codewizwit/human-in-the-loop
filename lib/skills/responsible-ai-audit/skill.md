---
name: responsible-ai-audit
description: >-
  Comprehensive audit framework for evaluating AI systems against responsible AI
  principles. Use when user asks to "audit an AI system", "review AI ethics", or
  mentions "responsible AI".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# Responsible AI Audit

Evaluates AI systems and outputs against responsible AI principles including
accuracy, fairness, transparency, accountability, safety, and privacy. Produces
a structured audit report with lens-by-lens analysis, risk assessment, mitigation
recommendations, and a deployment decision framework. Aligns with the project's
RESPONSIBLE-AI-PLAYBOOK.md.

## When to Activate

- User asks to audit or evaluate an AI system or tool
- User mentions responsible AI, AI ethics, or AI safety review
- User wants to assess bias, fairness, or transparency of an AI output
- User asks about AI governance or deployment readiness

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What AI system or output would you like to audit?</question>
<option value="tool">An AI-powered tool or feature</option>
<option value="output">A specific AI-generated output</option>
<option value="pipeline">An AI/ML pipeline or workflow</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is the purpose of this AI system?</question>
<option value="assist">Assists developers or users with tasks</option>
<option value="automate">Automates decisions or processes</option>
<option value="generate">Generates content or code</option>
<option value="other">Other (please describe)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What risk level are you most concerned about?</question>
<option value="high">High - impacts people, decisions, or safety</option>
<option value="medium">Medium - supports decisions but human-reviewed</option>
<option value="low">Low - informational or optional tool</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Are there any known concerns you want me to focus on?</question>
<option value="bias">Potential bias or fairness issues</option>
<option value="transparency">Lack of transparency or explainability</option>
<option value="safety">Safety risks or harm potential</option>
<option value="none">No specific concerns, do a full audit</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For large AI systems with multiple components, enter plan mode:

<EnterPlanMode>
<summary>
Outline the audit scope, list components to evaluate, confirm which
responsible AI principles to prioritize, and propose the report structure.
</summary>
</EnterPlanMode>

### Step 3: System Analysis

1. Use Read and Grep to examine the AI system's implementation
2. Identify decision points, data flows, and user interactions
3. Map the system against responsible AI principles
4. Review existing documentation and guardrails

### Step 4: Lens-by-Lens Evaluation

Evaluate across these principles:

**Accuracy** - Correctness, hallucination risk, verification mechanisms
**Fairness** - Bias detection, representation, equitable outcomes
**Transparency** - Explainability, documentation, limitation disclosure
**Accountability** - Human oversight, error handling, auditability
**Safety** - Harm prevention, guardrails, misuse prevention
**Privacy** - Data handling, consent, security measures

For each principle, assess through four accountability lenses:

1. Developer Experience and Growth
2. Responsibility and Equity
3. Culture and Collaboration
4. Transparency and Trust

### Step 5: Risk Assessment

Determine overall risk level and identify:

- Primary risks with likelihood and impact
- Mitigation priority order
- Conditions for safe deployment

### Step 6: Deliver Report

Write the complete audit report to a markdown file with actionable
recommendations and a deployment decision.

## Output Format

<output_format>
Write the responsible AI audit report to a markdown file. Structure as follows:

**Executive Summary**

- Overall assessment, risk level, and deployment recommendation

**Lens-by-Lens Analysis**
For each accountability lens:

- Score: Pass / Pass with Concerns / Fail
- Key Findings (with checkmarks and warnings)
- Recommendations

**Risk Assessment**

- Overall Risk Level
- Primary Risks (numbered)
- Mitigation Priority

**Mitigation Recommendations**

1. Immediate Actions (must-fix before deployment)
2. Short-term Improvements (1-2 sprints)
3. Long-term Enhancements (ongoing monitoring)

**Deployment Decision**

- Recommendation: Deploy / Deploy with Conditions / Do Not Deploy
- Rationale
- Conditions (if applicable)

**Monitoring Plan**

- Metrics to Track
- Review Frequency
- Success Criteria
  </output_format>

## Best Practices

- Always gather the AI system description and context before auditing
- Evaluate every principle even if the user only mentioned one concern
- Provide specific, actionable recommendations for each finding
- Include both positive findings and areas for improvement
- Reference the RESPONSIBLE-AI-PLAYBOOK.md for alignment
- Consider the impact on different user groups and experience levels

## Anti-Patterns

- Do not skip principles that seem unrelated to the stated concern
- Do not provide a passing score without evidence of compliance
- Do not recommend deployment of high-risk systems without conditions
- Do not focus only on technical aspects while ignoring human impact
- Do not assume good intent substitutes for proper guardrails

## Examples

### Example 1: AI Code Review Bot Audit

**Input**: "Audit this AI code review bot that auto-comments on PRs with
suggestions and auto-approves PRs that pass all checks"

**Output**: Comprehensive audit finding critical failures across all
accountability lenses due to lack of opt-out, command language, and
auto-approval. Recommendation: Do Not Deploy without major redesign.

### Example 2: AI Test Generator Review

**Input**: "Evaluate our AI test generator that creates unit tests from
function signatures with clear AI-generated markers"

**Output**: Positive audit finding strong responsible AI practices with
clear labeling and human review requirements. Recommendation: Deploy
with Conditions (add edge case prompts and limitations documentation).

### Example 3: Content Moderation System

**Input**: "Review our AI content moderation pipeline for bias and fairness"

**Output**: Focused audit on fairness and bias detection across content
categories and user demographics, with recommendations for monitoring
dashboards and appeal mechanisms.
