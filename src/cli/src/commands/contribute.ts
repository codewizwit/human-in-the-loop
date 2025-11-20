import { existsSync, readFileSync } from 'fs';
import { join, basename, dirname } from 'path';
import { execSync } from 'child_process';
import { parse } from 'yaml';
import {
  logInfo,
  logStep,
  logSuccess,
  logError,
  logHeader,
  logNewLine,
  log,
} from '../utils/logger';

interface ValidationResult {
  pass: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that a file exists at the given path
 */
function validatePath(path: string): boolean {
  return existsSync(path);
}

/**
 * Detects the tool type from the path
 */
function detectToolType(path: string): string | null {
  const normalizedPath = path.toLowerCase();
  if (normalizedPath.includes('/prompts/')) return 'prompt';
  if (normalizedPath.includes('/agents/')) return 'agent';
  if (normalizedPath.includes('/context-packs/')) return 'context-pack';
  if (normalizedPath.includes('/evaluators/')) return 'evaluator';
  if (normalizedPath.includes('/guardrails/')) return 'guardrail';
  return null;
}

/**
 * Validates XML structure within template field
 */
function validateTemplateXML(template: string): ValidationResult {
  const result: ValidationResult = { pass: true, errors: [], warnings: [] };

  const tagPattern = /<(\w+)>/g;
  const closePattern = /<\/(\w+)>/g;

  const openTags = [...template.matchAll(tagPattern)].map((m) => m[1]);
  const closeTags = [...template.matchAll(closePattern)].map((m) => m[1]);

  const tagCounts: Record<string, number> = {};
  openTags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  closeTags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) - 1;
  });

  const unmatchedTags = Object.entries(tagCounts).filter(
    ([, count]) => count !== 0
  );
  if (unmatchedTags.length > 0) {
    unmatchedTags.forEach(([tag, count]) => {
      if (count > 0) {
        result.errors.push(`Unclosed XML tag: <${tag}>`);
      } else {
        result.errors.push(`Extra closing tag: </${tag}>`);
      }
    });
    result.pass = false;
  }

  const recommendedTags = ['context', 'instructions', 'output_format'];
  const hasRecommended = recommendedTags.some((tag) =>
    template.includes(`<${tag}>`)
  );

  if (!hasRecommended) {
    result.warnings.push(
      'Template missing recommended XML structure tags (context, instructions, output_format). See docs/xml-template-migration.md'
    );
  }

  const hasUserInput =
    template.includes('{{') && openTags.some((tag) => tag !== 'thinking');
  if (hasUserInput && !openTags.some((tag) => tag.includes('input'))) {
    result.warnings.push(
      'Template contains variables but no input-related XML tags. Consider wrapping user input in descriptive tags (e.g., <code_to_review>, <user_input>)'
    );
  }

  return result;
}

/**
 * Validates YAML file structure and required fields
 */
function validateYAML(yamlPath: string, type: string): ValidationResult {
  const result: ValidationResult = { pass: true, errors: [], warnings: [] };

  try {
    const content = readFileSync(yamlPath, 'utf-8');
    const data = parse(content) as Record<string, unknown>;

    const requiredFields = ['id', 'name', 'version', 'description', 'category'];
    const requiredMetadata = ['author', 'license'];

    for (const field of requiredFields) {
      if (!data[field]) {
        result.errors.push(`Missing required field: ${field}`);
        result.pass = false;
      }
    }

    const metadata = data.metadata as Record<string, unknown> | undefined;
    if (!metadata) {
      result.errors.push('Missing metadata section');
      result.pass = false;
    } else {
      for (const field of requiredMetadata) {
        if (!metadata[field]) {
          result.errors.push(`Missing required metadata field: ${field}`);
          result.pass = false;
        }
      }
    }

    if (type === 'prompt' && !data.template) {
      result.errors.push('Prompts must have a template field');
      result.pass = false;
    }

    if (type === 'prompt' && data.template) {
      const xmlValidation = validateTemplateXML(data.template as string);
      result.errors.push(...xmlValidation.errors);
      result.warnings.push(...xmlValidation.warnings);
      if (!xmlValidation.pass) {
        result.pass = false;
      }
    }

    if (
      !data.examples ||
      (Array.isArray(data.examples) && data.examples.length === 0)
    ) {
      result.warnings.push('No examples provided (recommended: at least 2)');
    }
  } catch (error) {
    result.errors.push(`Failed to parse YAML: ${(error as Error).message}`);
    result.pass = false;
  }

  return result;
}

/**
 * Validates README documentation
 */
function validateDocumentation(dirPath: string): ValidationResult {
  const result: ValidationResult = { pass: true, errors: [], warnings: [] };
  const readmePath = join(dirPath, 'README.md');

  if (!existsSync(readmePath)) {
    result.errors.push('Missing README.md file');
    result.pass = false;
    return result;
  }

  const content = readFileSync(readmePath, 'utf-8');

  if (!content.includes('## Usage')) {
    result.errors.push('README.md missing required "## Usage" section');
    result.pass = false;
  }

  if (content.length < 200) {
    result.warnings.push(
      'README.md is very short (recommended: detailed documentation)'
    );
  }

  return result;
}

/**
 * Creates a GitHub issue for the contribution
 */
function createGitHubIssue(
  type: string,
  toolName: string,
  validation: { yaml: ValidationResult; docs: ValidationResult }
): string {
  const allPassed = validation.yaml.pass && validation.docs.pass;
  const title = `[Contribution] New ${type}: ${toolName}`;

  const body = `## 🎁 New Contribution

**Type:** ${type}
**Name:** ${toolName}
**Status:** ${
    allPassed ? '✅ All validations passed' : '⚠️ Validation issues found'
  }

---

### Validation Results

#### YAML Structure
${validation.yaml.pass ? '✅ Passed' : '❌ Failed'}

${
  validation.yaml.errors.length > 0
    ? `**Errors:**\n${validation.yaml.errors.map((e) => `- ${e}`).join('\n')}\n`
    : ''
}
${
  validation.yaml.warnings.length > 0
    ? `**Warnings:**\n${validation.yaml.warnings
        .map((w) => `- ${w}`)
        .join('\n')}\n`
    : ''
}

#### Documentation
${validation.docs.pass ? '✅ Passed' : '❌ Failed'}

${
  validation.docs.errors.length > 0
    ? `**Errors:**\n${validation.docs.errors.map((e) => `- ${e}`).join('\n')}\n`
    : ''
}
${
  validation.docs.warnings.length > 0
    ? `**Warnings:**\n${validation.docs.warnings
        .map((w) => `- ${w}`)
        .join('\n')}\n`
    : ''
}

---

### Review Checklist

- [ ] YAML metadata complete and valid
- [ ] Documentation clear and comprehensive
- [ ] Examples provided (minimum 2)
- [ ] Follows contribution guidelines
- [ ] Code quality checks passed
- [ ] Maintainer review completed

---

### Next Steps

${
  allPassed
    ? '**For Contributor:**\n1. Create a pull request with your changes\n2. Link this issue to your PR\n3. Wait for maintainer review\n\n**For Maintainers:**\n1. Review the contribution\n2. Test functionality\n3. Approve and merge'
    : '**For Contributor:**\n1. Fix validation errors listed above\n2. Run `hit contribute` again to validate\n3. Create PR once all checks pass\n\n**For Maintainers:**\nWaiting for contributor to resolve validation issues.'
}

---

🤖 Generated with [Human-in-the-Loop CLI](https://www.npmjs.com/package/@human-in-the-loop/cli)`;

  try {
    const issueUrl = execSync(
      `gh issue create --title "${title}" --body "${body.replace(
        /"/g,
        '\\"'
      )}"`,
      { encoding: 'utf-8' }
    ).trim();

    return issueUrl;
  } catch (error) {
    throw new Error(
      `Failed to create GitHub issue: ${(error as Error).message}`
    );
  }
}

/**
 * Submits a new tool for review and contribution
 */
export async function contributeCommand(
  type: string,
  path: string
): Promise<void> {
  logInfo(`📤 Submitting ${type} for review...`);
  logNewLine();

  logStep(`Validating ${path}...`);
  if (!validatePath(path)) {
    logError(`Path does not exist: ${path}`);
    process.exit(1);
  }

  const detectedType = detectToolType(path);
  if (detectedType && detectedType !== type) {
    logInfo(
      `Detected type from path: ${detectedType} (you specified: ${type})`
    );
  }

  const toolDir = dirname(path);
  const toolName = basename(toolDir);

  logStep('Running quality checks...');

  const yamlValidation = validateYAML(path, type);
  const docsValidation = validateDocumentation(toolDir);

  logNewLine();

  if (yamlValidation.pass) {
    logSuccess('✅ YAML validation passed');
  } else {
    logError('❌ YAML validation failed');
    yamlValidation.errors.forEach((err) => log(`  - ${err}`));
  }

  if (docsValidation.pass) {
    logSuccess('✅ Documentation validation passed');
  } else {
    logError('❌ Documentation validation failed');
    docsValidation.errors.forEach((err) => log(`  - ${err}`));
  }

  if (
    yamlValidation.warnings.length > 0 ||
    docsValidation.warnings.length > 0
  ) {
    logNewLine();
    logInfo('⚠️  Warnings:');
    [...yamlValidation.warnings, ...docsValidation.warnings].forEach((warn) =>
      log(`  - ${warn}`)
    );
  }

  logNewLine();
  logStep('Creating GitHub issue...');

  try {
    const issueUrl = createGitHubIssue(type, toolName, {
      yaml: yamlValidation,
      docs: docsValidation,
    });

    logNewLine();
    logSuccess('Contribution issue created successfully!');
    log(`  → ${issueUrl}`);

    logNewLine();
    logHeader('Next steps:');
    if (yamlValidation.pass && docsValidation.pass) {
      log('  1. Create a pull request with your changes');
      log('  2. Link the PR to the issue above');
      log('  3. Wait for peer review (typically 3-5 days)');
      log('  4. Address any feedback');
      log('  5. Approval and merge');
    } else {
      log('  1. Fix the validation errors listed above');
      log('  2. Run validation again: hit contribute <type> <path>');
      log('  3. Create PR once all checks pass');
    }

    logNewLine();
    logStep('See CONTRIBUTING.md for more details.');
  } catch (error) {
    logError(`Failed to create issue: ${(error as Error).message}`);
    logInfo('Make sure you have gh CLI installed and authenticated:');
    log('  gh auth login');
    process.exit(1);
  }
}
