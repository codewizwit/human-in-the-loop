---
name: bias-detection
description: >-
  Analyzes AI-generated content and code for potential bias across protected
  characteristics. Use when user asks to "check for bias", "detect bias",
  "review for fairness", or mentions "inclusivity audit".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
---

# Bias Detection Analyzer

Analyzes AI-generated content, code, and system outputs for potential bias across protected characteristics including gender, race, age, disability, cultural background, and socioeconomic status. Produces structured findings with specific examples, explanations of why content is biased, severity ratings, and concrete alternative phrasing.

## When to Activate

- User asks to check content or code for bias
- User wants a fairness or inclusivity review of AI outputs
- User mentions bias detection, responsible AI, or ethical review
- User asks to review text, recommendations, or decisions for discriminatory patterns
- User wants to audit a system for equitable treatment across demographic groups

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What type of content would you like analyzed for bias?</question>
<option value="code">Source code or algorithms</option>
<option value="text">AI-generated text or copy</option>
<option value="decisions">Automated decisions or recommendations</option>
<option value="dataset">Training data or datasets</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Are there specific bias dimensions you are most concerned about?</question>
<option value="all">All dimensions (gender, race, age, disability, cultural, socioeconomic)</option>
<option value="gender">Gender bias</option>
<option value="racial">Racial and ethnic bias</option>
<option value="age">Age bias</option>
<option value="accessibility">Disability and accessibility bias</option>
<option value="custom">Other specific concern</option>
</AskUserQuestion>

### Step 2: Content Collection

If the user has not provided the content directly:

<AskUserQuestion>
<question>How would you like to provide the content for analysis?</question>
<option value="paste">Paste it directly</option>
<option value="file">Point to a file in the workspace</option>
<option value="directory">Scan a directory for patterns</option>
</AskUserQuestion>

For file-based analysis:

1. Use Glob to locate relevant source files
2. Use Read to examine the content
3. Use Grep to search for known bias-indicative patterns

### Step 3: Plan (if complex)

For large codebases or multi-file analysis, enter plan mode:

<EnterPlanMode>
<summary>
Outline the scope of the bias review, list the content areas to analyze,
identify the bias dimensions to evaluate, and confirm the analysis
approach with the user.
</summary>
</EnterPlanMode>

### Step 4: Analysis

Analyze the content across these dimensions:

**Gender Bias**

- Stereotypical role assumptions
- Exclusionary language or pronouns
- Default gender assumptions in code or copy

**Racial and Ethnic Bias**

- Cultural stereotypes or generalizations
- Representation gaps in examples or datasets
- Discriminatory filtering or eligibility patterns

**Age Bias**

- Ageist assumptions about capability
- Generational stereotypes
- Feature restrictions based on age without justification

**Disability Bias**

- Ableist language or assumptions
- Accessibility barriers in design decisions
- Exclusionary interaction patterns

**Socioeconomic Bias**

- Class-based assumptions about access or capability
- Privilege blindness in feature design
- Economic barriers to participation

**Cultural Bias**

- Western-centric defaults
- Language or locale assumptions
- Cultural insensitivity in examples or naming

For each finding:

1. Quote the specific problematic content
2. Explain why it constitutes bias with concrete reasoning
3. Provide alternative phrasing or implementation
4. Assign a severity rating (Critical, High, Medium, Low)

### Step 5: Deliver Report

Write the bias analysis report to a markdown file in the workspace.

## Output Format

<output_format>
**Executive Summary**
Overall bias risk rating (Critical/High/Medium/Low), categories of bias
detected, severity assessment, and deployment recommendation.

**Detailed Findings**
For each finding: quoted problematic content, bias dimension, explanation
of why it is biased, severity rating, and concrete alternative phrasing.

**Bias Dimension Summary**
Table showing each bias dimension analyzed with finding count and
highest severity per dimension.

**Recommendations**
Prioritized list of changes organized by severity with specific
remediation steps.

**Assessment Checklist**
Checklist of bias dimensions reviewed with pass/fail status for each.
</output_format>

## Best Practices

- Always quote the specific content that exhibits bias rather than describing it vaguely
- Provide concrete alternative phrasing for every finding, not just criticism
- Rate severity based on potential real-world harm to affected groups
- Consider intersectional bias where multiple dimensions overlap
- Acknowledge when content is borderline and explain the reasoning
- Frame findings constructively to encourage improvement rather than blame

## Anti-Patterns

- Do not flag content as biased without a clear explanation of why
- Do not provide only vague recommendations like "be more inclusive"
- Do not assume all demographic references are inherently biased
- Do not skip the context-gathering phase; bias depends heavily on context
- Do not conflate personal preference with genuine bias
- Do not ignore systemic or structural bias in favor of surface-level language issues

## Examples

### Example 1: Code Review for Bias

**Input**: "Check this authentication system code for bias"

**Output**: Structured report identifying age-based feature restrictions, language-based eligibility checks, and gendered pronoun assumptions in the code with severity ratings and refactored code alternatives.

### Example 2: AI-Generated Copy Review

**Input**: "Review this marketing copy generated by our AI for bias and inclusivity"

**Output**: Analysis covering gendered language patterns, cultural assumptions in examples, and socioeconomic bias in product positioning with specific alternative text for each finding.

### Example 3: Dataset Fairness Audit

**Input**: "Analyze our training dataset for representation bias across demographic groups"

**Output**: Statistical summary of demographic representation, identification of underrepresented groups, analysis of label distribution across demographics, and recommendations for dataset balancing strategies.

---

**Human-in-the-Loop by codewizwit**
