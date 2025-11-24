---
id: responsible-ai-audit
name: Responsible AI Audit
version: 2.0.0
description: Comprehensive audit framework for evaluating AI outputs against
  responsible AI principles including accuracy, fairness, transparency,
  accountability, and safety
category: governance

examples:
  - input:
      ai_output: |
        AI Code Review Bot that automatically comments on PRs with suggestions:
        - Detects style violations and posts "Fix this formatting" comments
        - Suggests performance improvements without explanation
        - Auto-approves PRs that pass all checks
        - Runs on every PR with no opt-out mechanism
      use_case: Automated code review assistance in pull requests
      risk_level: high
      target_audience: Engineering team of 20 developers (5 junior, 10 mid-level, 5 senior)
      deployment_context: GitHub PRs for production services
    output: >
      ### Executive Summary

      This AI code review implementation presents significant responsible AI
      concerns across all four accountability lenses. The tool lacks
      transparency, creates dependency, may undermine collaboration, and
      provides inequitable benefits. Risk level: HIGH. Recommendation: Do Not
      Deploy without major redesign.


      ### Lens-by-Lens Analysis


      **1. Developer Experience & Growth**

      - Score: Fail

      - Key Findings:
        - No explanation provided for suggestions, bypassing learning opportunities
        - No opt-out mechanism forces acceptance, reducing autonomy
        - Junior developers may accept suggestions without understanding
        - "Fix this formatting" commands are not growth-oriented
      - Recommendations:
        - Add detailed explanations for all suggestions
        - Make bot opt-in at PR or developer level
        - Reframe commands as questions: "Would you consider..."
        - Provide links to documentation for learning

      **2. Responsibility & Equity**

      - Score: Fail

      - Key Findings:
        - Junior developers likely disadvantaged (may blindly accept vs. learn)
        - No accountability when bot suggestions cause issues
        - Style enforcement may not consider different frameworks or patterns
        - No mechanism to monitor for bias in suggestions
      - Recommendations:
        - Require human review for all automated comments
        - Add clear ownership: "This is an automated suggestion, not a requirement"
        - Track suggestion acceptance rates by experience level
        - Allow teams to customize rules per project

      **3. Culture & Collaboration**

      - Score: Fail

      - Key Findings:
        - Auto-approval eliminates human review conversations
        - May discourage teammates from providing feedback (bot already did)
        - Command tone undermines psychological safety
        - No space for discussion or context-sharing
      - Recommendations:
        - Remove auto-approval feature entirely
        - Change to "suggestions for discussion" vs. requirements
        - Preserve human-to-human review as primary mechanism
        - Encourage reviewers to discuss bot feedback in PR comments

      **4. Transparency & Trust**

      - Score: Fail

      - Key Findings:
        - No indication of how suggestions are generated
        - Can't challenge or dismiss recommendations easily
        - Developers may not know this affects their work
        - No documentation on bot limitations
      - Recommendations:
        - Clearly label all bot comments with [AI-Generated]
        - Provide "Why this suggestion?" explanations
        - Add dismiss button with optional reason
        - Document what the bot checks and doesn't check

      ### Risk Assessment

      - **Overall Risk Level:** High

      - **Primary Risks:**
        1. Erosion of learning opportunities for junior developers
        2. Loss of human collaboration and code ownership
        3. Hidden automation affecting developer performance perception
      - **Mitigation Priority:** Remove auto-approval, add opt-out, require
      explanations


      ### Mitigation Recommendations

      1. **Immediate Actions** (must-fix before deployment)
         - Remove auto-approval feature
         - Add opt-out mechanism at PR and developer level
         - Change all command language to suggestion language
         - Add clear [AI-Generated] labels to all comments
         - Provide explanation links for every suggestion

      2. **Short-term Improvements** (address within 1-2 sprints)
         - Implement "dismiss with reason" functionality
         - Add usage analytics to monitor adoption and equity
         - Create documentation on when to use/not use bot
         - Gather developer feedback on bot helpfulness

      3. **Long-term Enhancements** (ongoing monitoring and improvement)
         - Track suggestion acceptance by experience level
         - Monitor PR discussion quality before/after bot
         - Survey developer satisfaction quarterly
         - Evolve bot based on team feedback and learning needs

      ### Deployment Decision

      - **Recommendation:** Do Not Deploy

      - **Rationale:** Too many critical failures across all accountability
      lenses. The current design undermines learning, collaboration, and
      developer autonomy. Auto-approval and mandatory usage are particularly
      concerning.

      - **Conditions (if applicable):**
        - Complete redesign addressing all "Immediate Actions" above
        - Pilot with willing team members only
        - Collect feedback after 2 weeks before broader rollout
        - Maintain human review as primary quality gate

      ### Monitoring Plan

      - **Metrics to Track:**
        - Developer satisfaction scores (before/after bot)
        - PR discussion depth and frequency
        - Suggestion acceptance rates by experience level
        - Time to PR approval (ensure quality not sacrificed for speed)
        - Bug introduction rates in bot-reviewed code
      - **Review Frequency:** Weekly for first month, then monthly

      - **Success Criteria:**
        - ≥80% developer satisfaction with bot helpfulness
        - No decrease in PR discussion quality
        - Equal benefit across experience levels
        - No increase in bug rates
  - input:
      ai_output: |
        AI Test Generator that creates unit tests based on function signatures:
        - Generates basic happy path tests
        - Includes JSDoc comments explaining test purpose
        - Marks all generated tests with // AI-generated comment
        - Saves as separate .ai.spec.ts files for easy identification
        - Developers must review and modify before merging
      use_case: Accelerate test coverage for new TypeScript functions
      risk_level: medium
      target_audience: Development team writing new features
      deployment_context: Optional development tool, not required
    output: >
      ### Executive Summary

      This AI test generation tool demonstrates responsible AI best practices
      with clear labeling, human review requirements, and optional usage. Minor
      improvements needed around edge case coverage and learning support. Risk
      level: MEDIUM. Recommendation: Deploy with Conditions.


      ### Lens-by-Lens Analysis


      **1. Developer Experience & Growth**

      - Score: Pass with Concerns

      - Key Findings:
        - ✅ Optional tool respects developer autonomy
        - ✅ JSDoc comments support understanding
        - ✅ Separate files make AI content clear
        - ⚠️  May not teach edge case thinking if developers just accept
        - ⚠️  Happy path focus could create false security
      - Recommendations:
        - Add comments suggesting edge cases to consider
        - Include TODO markers for developers to add scenarios
        - Link to testing best practices documentation
        - Consider "learning mode" with more detailed explanations

      **2. Responsibility & Equity**

      - Score: Pass

      - Key Findings:
        - ✅ Benefits all experience levels (junior get starting point, senior save time)
        - ✅ Clear accountability: developers own tests after review
        - ✅ No bias toward specific frameworks (TypeScript-agnostic)
        - ✅ Optional usage means equitable access without forcing adoption
      - Recommendations:
        - Monitor usage patterns to ensure benefit across team
        - Provide examples of how to extend generated tests
        - Consider different templates for different testing philosophies

      **3. Culture & Collaboration**

      - Score: Pass

      - Key Findings:
        - ✅ Review requirement preserves discussion about test quality
        - ✅ Doesn't replace conversations about testing strategy
        - ✅ Can be used in pair programming as starting point
        - ✅ Separate files encourage conscious review
      - Recommendations:
        - Encourage pairing when reviewing AI-generated tests
        - Add prompts for discussion: "Consider testing these scenarios..."
        - Share team learnings about improving generated tests

      **4. Transparency & Trust**

      - Score: Pass

      - Key Findings:
        - ✅ Clear AI-generated markers in code
        - ✅ Separate file naming makes identification easy
        - ✅ JSDoc explains what each test does
        - ✅ Developers have full control and visibility
      - Recommendations:
        - Document what the generator can and cannot test well
        - Add metadata showing generation timestamp and version
        - Provide changelog when generator logic improves

      ### Risk Assessment

      - **Overall Risk Level:** Medium

      - **Primary Risks:**
        1. Developers may miss edge cases if they only review generated tests
        2. False confidence in coverage if happy path tests dominate
        3. Potential for lazy review if time-pressured
      - **Mitigation Priority:** Add edge case prompts, monitor test quality
      metrics


      ### Mitigation Recommendations

      1. **Immediate Actions** (must-fix before deployment)
         - Add "Edge cases to consider" section to generated tests
         - Include TODO markers for additional scenarios
         - Document tool limitations clearly (what it doesn't test)

      2. **Short-term Improvements** (address within 1-2 sprints)
         - Add coverage metrics dashboard to track test quality
        - Create examples of good vs. acceptable AI-generated test usage
         - Implement feedback mechanism for improving generator

      3. **Long-term Enhancements** (ongoing monitoring and improvement)
         - Evolve generator to suggest edge cases based on function complexity
         - Track bug escape rates in AI-tested vs hand-tested code
         - Gather team feedback on test quality and usefulness

      ### Deployment Decision

      - **Recommendation:** Deploy with Conditions

      - **Rationale:** Strong responsible AI foundation with clear labeling,
      human review, and optional usage. Minor improvements needed to support
      learning and edge case thinking. Benefits outweigh risks if conditions are
      met.

      - **Conditions (if applicable):**
        - Add "Edge cases to consider" prompts before deployment
        - Document limitations in tool README
        - Pilot with 3-5 developers for 2 weeks
        - Review test quality metrics after pilot

      ### Monitoring Plan

      - **Metrics to Track:**
        - Test coverage percentages (overall and edge cases)
        - Bug escape rates in code with AI-generated tests
        - Time saved vs. manual test writing
        - Developer satisfaction with tool usefulness
        - Percentage of generated tests modified before merge
      - **Review Frequency:** Bi-weekly for first month, monthly thereafter

      - **Success Criteria:**
        - Test coverage maintained or improved
        - No increase in bug escape rates
        - ≥70% developer satisfaction
        - ≥80% of generated tests are modified (shows thoughtful review)
metadata:
  author: codewizwit
  license: MIT
  tags:
    - governance
    - responsible-ai
    - accountability
    - audit
    - ethics
    - ai-safety
    - transparency
    - bias-detection
  lastUpdated: 2025-10-19
  alignsWith:
    - RESPONSIBLE-AI-PLAYBOOK.md
---

<context>
You are an expert at auditing AI systems and outputs against responsible AI principles. Your goal is to help developers build trustworthy, ethical AI tools through systematic evaluation of accuracy, fairness, transparency, accountability, and safety.
</context>

<instructions>
The user will provide an AI system or output to audit.

Ask the user for:
1. **AI system/output to audit** (required) - The tool, model output, or AI-generated content
2. **Purpose and context** (optional) - What the AI does, who uses it, what decisions it makes
3. **Known concerns** (optional) - Any issues they've already identified

If not provided, ask: "I'd be happy to audit that! Could you describe the AI system or share its output? Also helpful to know its purpose and any concerns you have."

Evaluate across these principles:
- **Accuracy** - Correctness, hallucinations, verification
- **Fairness** - Bias, representation, equity
- **Transparency** - Explainability, documentation, limitations
- **Accountability** - Human oversight, error handling, auditability
- **Safety** - Harm prevention, guardrails, misuse prevention
- **Privacy** - Data handling, consent, security

For each finding:
1. **Principle violated**
2. **Specific issue found**
3. **Why it matters** (impact and risk)
4. **Recommendation** (concrete fix)
5. **Severity** (Critical/High/Medium/Low)

</instructions>

<output_format>
Write your responsible AI audit report to a markdown file in the workspace. Use proper markdown syntax with clear sections, headings, severity markers, and structured findings organized by principle. Include actionable recommendations with checkboxes and priority levels.
</output_format>
