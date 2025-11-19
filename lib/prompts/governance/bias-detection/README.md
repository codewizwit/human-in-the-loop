# Bias Detection Analyzer

Analyzes AI-generated content and outputs for potential bias across protected characteristics including gender, race, age, disability, cultural background, and socioeconomic status with specific examples and alternatives.

## Overview

This prompt performs comprehensive bias analysis on AI-generated content to identify language, assumptions, and design decisions that may exclude, marginalize, or harm specific groups of people. It provides detailed findings with severity ratings, impact assessments, and specific recommendations for creating more equitable and inclusive outputs.

## When to Use This Prompt

Use this bias detection analyzer when:

- **Reviewing AI-Generated Content** - Validate outputs from LLMs, code generators, or writing assistants
- **Code Review** - Check for biased assumptions in code, variable names, or comments
- **Content Creation** - Review documentation, UI copy, marketing materials, or communications
- **Design Decisions** - Evaluate product features, workflows, or user experiences
- **Policy Development** - Analyze organizational policies or guidelines
- **Training Materials** - Review educational content or onboarding materials
- **Event Planning** - Check inclusivity of team events, meetups, or conferences

## Usage

### Basic Bias Analysis

```yaml
content: |-
  Welcome back! Click here to continue.
  The system administrator should configure his settings.
```

### Code Analysis

```yaml
content: |-
  function validateUser(user) {
    if (user.age > 65) {
      return { error: 'Too old for advanced features' };
    }
    if (user.language !== 'en') {
      return { error: 'English only' };
    }
    return { valid: true };
  }

content_type: JavaScript code
context: User authentication system for SaaS product
```

### Focused Analysis

```yaml
content: |-
  [Your content here]

content_type: Documentation
analysis_focus: Gender bias and disability accessibility
```

## Bias Categories Analyzed

### 1. Gender Bias

**What we detect**:

- Gendered language assuming roles or capabilities
- Masculine defaults (he/him for generic person)
- Stereotypical associations (nurses as women, engineers as men)
- Exclusion of non-binary individuals
- Gender presentation assumptions

**Common examples**:

- ❌ "A developer should test his code"
- ✅ "Developers should test their code"
- ❌ "man-hours", "manpower"
- ✅ "person-hours", "workforce"

### 2. Racial and Ethnic Bias

**What we detect**:

- Assumptions about names, culture, capabilities based on race/ethnicity
- Stereotypical characterizations
- Exclusionary language (whitelist/blacklist)
- Cultural appropriation or misrepresentation
- Colorism in language

**Common examples**:

- ❌ "blacklist/whitelist"
- ✅ "blocklist/allowlist" or "denylist/allowlist"
- ❌ Assuming Western naming conventions only
- ✅ Supporting diverse name formats globally

### 3. Age Bias

**What we detect**:

- Assumptions about technical capability based on age
- Ageist language ("digital native", "too old to learn")
- Exclusion in examples or features
- Generational stereotypes

**Common examples**:

- ❌ "Even your grandma can use this"
- ✅ "This interface is intuitive for all users"
- ❌ Age-based feature restrictions
- ✅ User preference-based options

### 4. Disability Bias

**What we detect**:

- Ableist language or capability assumptions
- Inaccessible design patterns
- Person-first vs. identity-first language misuse
- Physical, cognitive, or sensory ability assumptions
- Lack of accommodations

**Common examples**:

- ❌ "Click here" (not screen reader friendly)
- ✅ "Select the 'Submit' button"
- ❌ Color-only information
- ✅ Multiple visual cues (color + icon + text)

### 5. Cultural and Religious Bias

**What we detect**:

- Holiday or calendar assumptions
- Western-centric perspectives
- Religious assumptions or exclusions
- Ethnocentric design decisions

**Common examples**:

- ❌ "Everyone celebrates Christmas"
- ✅ "During the holiday season"
- ❌ Assuming Monday-Friday work weeks globally
- ✅ Configurable work week settings

### 6. Socioeconomic Bias

**What we detect**:

- Assumptions about resources, technology, or services
- Language stigmatizing poverty
- Exclusionary pricing language
- Education or literacy assumptions
- Class-based stereotypes

**Common examples**:

- ❌ "Just upgrade to the latest iPhone"
- ✅ "Works on devices from 2018 onwards"
- ❌ Assuming high-speed internet
- ✅ Offline-first or low-bandwidth options

### 7. Intersectionality

**What we detect**:

- Overlapping biases affecting multiply marginalized groups
- One-dimensional diversity missing compound discrimination
- Failure to consider diverse lived experiences

**Examples**:

- Considering disabled people of color
- Recognizing older LGBTQ+ experiences
- Understanding low-income immigrant challenges

## Output Structure

### Executive Summary

- Overall bias risk level
- Categories detected
- Severity assessment
- Deployment recommendation

### Detailed Findings

For each bias:

- Severity rating (🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low)
- Specific location/quote
- Issue description
- Affected groups
- Impact assessment
- Alternative phrasing
- Rationale

### Fairness Metrics

- Representation analysis
- Accessibility score (0-100)
- Inclusivity checklist

### Recommendations

- Immediate actions (Critical/High)
- Important improvements (Medium)
- Best practice enhancements (Low)

### Human Review Note

Reminder that automated analysis requires human validation from affected communities.

## Examples

### Example 1: Code with Multiple Biases

**Input:**

```yaml
content: |-
  function validateUser(username, password) {
    // Check if user is a native English speaker
    if (user.language !== 'en') {
      return { eligible: false, reason: 'English only support' };
    }

    // Verify user is not too old
    if (user.age > 65) {
      return { eligible: false, reason: 'Advanced features restricted' };
    }

    // Default pronouns
    console.log(`Welcome back, ${user.name}. We hope he enjoys the new features.`);

    return { eligible: true };
  }

content_type: JavaScript code
context: Authentication system for SaaS product
```

**Output Highlights:**

````markdown
### Executive Summary

- **Overall Bias Risk**: 🔴 Critical
- **Categories Detected**: Age Bias, Cultural/Linguistic Bias, Gender Bias
- **Recommendation**: ❌ Do Not Deploy

### Finding #1: Cultural and Linguistic Discrimination

**Severity**: 🔴 Critical

English-only requirement excludes 75% of global population and violates accessibility principles.

**Alternative**:

```javascript
const supportedLanguages = ['en', 'es', 'fr', 'de', 'ja', 'zh'];
const userLanguage = supportedLanguages.includes(user.language)
  ? user.language
  : 'en';
```
````

### Finding #2: Age Discrimination

**Severity**: 🔴 Critical

Age-based feature restriction is illegal in many jurisdictions and based on false stereotypes.

**Alternative**:

```javascript
// Remove age restriction entirely
// Offer optional simplified mode for ALL users based on preference
```

### Finding #3: Gender Assumption

**Severity**: 🟠 High

Assumes he/him pronouns, excluding women and non-binary users.

**Alternative**:

```javascript
console.log(`Welcome back, ${user.name}. Enjoy the new features!`);
```

````

### Example 2: Team Event with Exclusionary Assumptions

**Input:**

```yaml
content: |-
  ## Team Building Event

  Join us for our annual team building!
  - Rock climbing wall (test your limits!)
  - Intense competitive games
  - Happy hour with craft cocktails
  - Late night activities

  Date: December 25th
  Time: 6 PM - 11 PM
  Location: Downtown (street parking)
  Dress code: Business casual

  Everyone is expected to participate!

content_type: Company event invitation
context: Team building for engineering department
````

**Output Highlights:**

````markdown
### Executive Summary

- **Overall Bias Risk**: 🟠 High
- **Categories Detected**: Disability, Religious/Cultural, Socioeconomic, Age
- **Recommendation**: ⚠️ Deploy with Significant Changes

### Finding #1: Physical Ability Assumptions

**Severity**: 🟠 High

Mandatory physical activities exclude people with disabilities.

**Alternative**:

```markdown
Multiple activity options:

- Rock climbing wall (optional)
- Board games and collaborative challenges
- Networking and social time
- Various seating areas

All activities are optional.
```
````

### Finding #2: Religious Exclusion

**Severity**: 🔴 Critical

December 25th excludes non-Christian employees and forces choice between religion and work.

**Alternative**:

```markdown
Date: January 15th (avoiding major religious holidays)

Note: We've chosen this date to avoid winter holiday conflicts.
```

### Finding #3: Alcohol-Centric Socialization

**Severity**: 🟡 Medium

Excludes people who don't drink for religious, health, or personal reasons.

**Alternative**:

```markdown
Refreshments: Craft cocktails, mocktails, specialty coffee and tea, fresh juices, sparkling water.

We're committed to inclusive social environment regardless of alcohol consumption.
```

### Fairness Metrics

- **Accessibility Score**: 25/100
- **Inclusivity Checklist**: 1/7 criteria met

### Recommendations

1. Move date from December 25th
2. Make all activities optional
3. Provide non-alcoholic options prominently
4. Earlier timing (3-8 PM) for caregivers
5. Remove dress code
6. Multiple transportation options

```

## Severity Levels

### 🔴 Critical (Immediate Action Required)

**Characteristics**:
- Direct discrimination or exclusion
- Violates laws or regulations
- Causes significant harm
- Affects large user populations

**Examples**:
- Age-based feature restrictions
- Language-only support
- Religious holiday scheduling conflicts
- Direct stereotyping or slurs

**Action**: Do not deploy until fixed

### 🟠 High (Fix Before Deploy)

**Characteristics**:
- Significant exclusion or marginalization
- Reinforces harmful stereotypes
- Accessibility barriers
- Affects substantial user groups

**Examples**:
- Gendered pronouns for generic users
- Ableist language
- Cultural assumptions
- Socioeconomic gatekeeping

**Action**: Fix within 1 week

### 🟡 Medium (Important Improvement)

**Characteristics**:
- Suboptimal inclusivity
- Minor exclusions or assumptions
- Missed opportunities for better representation
- Moderate impact

**Examples**:
- Missing diverse examples
- Western-centric date formats
- Incomplete accommodation information

**Action**: Fix within 1 month

### 🔵 Low (Best Practice Enhancement)

**Characteristics**:
- Minor language refinements
- Additional inclusive options
- Proactive improvements
- Low impact

**Examples**:
- Adding more diverse examples
- Expanding language options
- Enhanced accessibility features

**Action**: Include in backlog

## Best Practices

### For Content Creators

**DO**:
- ✅ Use gender-neutral language (they/them, "developers" not "developer...he")
- ✅ Include diverse examples (names, locations, scenarios)
- ✅ Consider global audiences (timezones, holidays, languages)
- ✅ Test with diverse user groups
- ✅ Provide multiple participation options
- ✅ Make assumptions explicit and question them
- ✅ Use person-first or identity-first language as appropriate

**DON'T**:
- ❌ Assume everyone is able-bodied, young, English-speaking
- ❌ Use gendered language for generic examples
- ❌ Center activities around alcohol or physical ability
- ❌ Schedule on religious holidays
- ❌ Use whitelist/blacklist, master/slave, or similar terms
- ❌ Make assumptions about resources, education, or access
- ❌ Rely on stereotypes even if "positive"

### For Code Reviewers

**Check for**:
- Variable names with gendered or biased terms
- Validation logic with discriminatory rules
- UI text with assumptions about users
- Error messages with ableist language
- Configuration defaults excluding groups
- Feature flags based on protected characteristics

### For Product Teams

**Consider**:
- Accessibility from the start (not as afterthought)
- Cultural context for global users
- Diverse personas in user research
- Inclusive design patterns
- Multiple ways to accomplish tasks
- Accommodation requests in event planning

## Fairness Metrics Explained

### Accessibility Score (0-100)

**Language Accessibility** (0-40 points):
- Gender-neutral language: 10 points
- Culturally inclusive: 10 points
- Clear, jargon-free: 10 points
- Multiple language support: 10 points

**Content Accessibility** (0-30 points):
- Screen reader compatible: 10 points
- Keyboard navigable: 10 points
- Color contrast sufficient: 10 points

**Design Inclusivity** (0-30 points):
- Diverse representation: 10 points
- Multiple participation paths: 10 points
- Accommodation-aware: 10 points

### Inclusivity Checklist

- [ ] **Gender-neutral language** - They/them for generic, no gendered role assumptions
- [ ] **Racially inclusive** - Diverse examples, no stereotypes, inclusive terminology
- [ ] **Age-inclusive** - No age assumptions, accessible to all ages
- [ ] **Disability-aware** - Accessible content, no ableist language
- [ ] **Culturally sensitive** - Globally aware, respects diverse practices
- [ ] **Socioeconomically inclusive** - No wealth/access assumptions
- [ ] **Intersectional** - Considers multiply marginalized identities

## Common Bias Patterns

### Pattern 1: Default Male

**Problem**:
```

A user should update his profile settings.

```

**Fix**:
```

Users should update their profile settings.

```

### Pattern 2: Western-Centric Dates/Times

**Problem**:
```

Meeting every Monday 9am EST

```

**Fix**:
```

Meeting schedule:

- Americas: Monday 9am EST
- Europe: Monday 2pm GMT
- Asia: Tuesday 2am JST
  Recordings available for async participation

```

### Pattern 3: Ability Assumptions

**Problem**:
```

Simply click the button to continue

```

**Fix**:
```

Select the 'Continue' button using your mouse, keyboard, or assistive device

```

### Pattern 4: Socioeconomic Gatekeeping

**Problem**:
```

Requires latest MacBook Pro

```

**Fix**:
```

System requirements:

- CPU: Intel i5 or equivalent (2018+)
- RAM: 8GB minimum
- OS: macOS 10.14+, Windows 10+, Linux

```

### Pattern 5: Cultural/Religious Assumptions

**Problem**:
```

Christmas party - everyone must attend!

```

**Fix**:
```

Year-end celebration (Jan 15)
Optional attendance, multiple activity options
Respects diverse winter holiday observances

````

## Integration with Other Practices

### With Code Review

```yaml
# In pull request template
- [ ] Code reviewed for bias using Bias Detection prompt
- [ ] Variable names are inclusive
- [ ] No discriminatory logic
- [ ] Error messages are respectful
````

### With Content Publishing

```yaml
# Before publishing checklist
- [ ] Bias analysis completed
- [ ] Diverse representation included
- [ ] Accessibility verified
- [ ] Cultural sensitivity reviewed
```

### With Product Design

```yaml
# Design review questions
- [ ] Does this work for users with disabilities?
- [ ] Does this assume specific cultural context?
- [ ] Are there multiple ways to accomplish this?
- [ ] Have we tested with diverse users?
```

## Limitations and Human Review

### Why Human Review is Essential

**AI limitations**:

- Cannot fully understand cultural context
- May miss community-specific language preferences
- Cannot weigh lived experience
- May not recognize emerging terms or reclaimed language

**Human expertise needed**:

- Members of affected communities
- Diversity and inclusion specialists
- Accessibility experts
- Cultural consultants
- Legal counsel (for discrimination concerns)

### When to Escalate

**Automatic escalation**:

- Critical or High severity findings
- Legal compliance concerns
- Controversial content
- Uncertain context

**Best practice escalation**:

- All governance and policy content
- Public-facing communications
- Product features affecting large user bases
- Anything setting organizational precedent

## Resources

### Inclusive Language Guides

- **Google Developer Documentation Style Guide** - Inclusive language section
- **Microsoft Style Guide** - Bias-free communication
- **Conscious Style Guide** - Comprehensive bias-free language
- **18F Content Guide** - Government accessibility standards

### Accessibility Resources

- **WCAG 2.1** - Web Content Accessibility Guidelines
- **WAI-ARIA** - Accessible Rich Internet Applications
- **Inclusive Design Principles** - Microsoft inclusive design toolkit
- **A11y Project** - Community-driven accessibility resources

### Diversity and Inclusion

- **Project Include** - DEI resources for tech
- **Better Allies** - Daily actions for inclusion
- **Interfaith Calendar** - Religious holiday awareness
- **Cultural Intelligence** - Cross-cultural competence

### Legal and Compliance

- **ADA** - Americans with Disabilities Act
- **ADEA** - Age Discrimination in Employment Act
- **Title VII** - Civil Rights Act (employment discrimination)
- **GDPR** - Data protection and privacy (EU)

## Related Prompts

- [Responsible AI Audit](../responsible-ai-audit/README.md) - AI output quality review
- [Security Review](../security-review/README.md) - Security vulnerability analysis
- [Code Review Empathy](../../culture/code-review-empathy/README.md) - Constructive feedback
- [1-on-1 Prep](../../culture/1-on-1-prep/README.md) - Inclusive meeting practices

## Contributing

To improve this bias detection prompt:

1. Share examples of biases detected or missed
2. Suggest additional bias categories or patterns
3. Provide community-specific language guidance
4. Report false positives with context
5. Contribute examples from different domains

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.

## Accountability Statement

This bias detection tool is part of our commitment to responsible AI development. It aims to:

- **Reduce harm** caused by biased AI outputs
- **Promote equity** in AI-generated content
- **Center affected communities** in bias assessment
- **Acknowledge limitations** of automated analysis
- **Require human validation** from diverse perspectives

We recognize that bias detection is an ongoing practice requiring continuous learning, community input, and humility about AI limitations.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
