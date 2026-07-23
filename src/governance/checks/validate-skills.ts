#!/usr/bin/env ts-node

import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Result of validating a single skill file
 */
export interface ValidationResult {
  filePath: string;
  skillName: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const REQUIRED_FRONTMATTER_FIELDS = [
  'name',
  'description',
  'version',
  'allowed-tools',
] as const;

const REQUIRED_SECTIONS = [
  { heading: 'When to Activate', alternatives: [] },
  { heading: 'Output Format', alternatives: ['Output'] },
] as const;

/**
 * Extracts YAML frontmatter from a markdown file
 * @param content - The full markdown content
 * @returns Parsed frontmatter data and remaining content, or null if no valid frontmatter
 */
function extractFrontmatter(content: string): {
  data: Record<string, unknown>;
  body: string;
} | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return null;
  }

  try {
    const data = parseYaml(match[1]) as Record<string, unknown>;
    if (!data || typeof data !== 'object') {
      return null;
    }
    return { data, body: match[2] };
  } catch {
    return null;
  }
}

/**
 * Extracts markdown headings at level 2 (##) from content
 * @param content - The markdown body content
 * @returns Array of heading text strings
 */
function extractHeadings(content: string): string[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings: string[] = [];
  let headingMatch: RegExpExecArray | null;

  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headings.push(headingMatch[1].trim());
  }

  return headings;
}

/**
 * Validates a skill.md file against the unified skill format specification
 * @param filePath - Absolute path to the skill.md file
 * @returns Validation result with pass/fail status and error messages
 */
export function validateSkillFile(filePath: string): ValidationResult {
  const result: ValidationResult = {
    filePath,
    skillName: path.basename(path.dirname(filePath)),
    valid: true,
    errors: [],
    warnings: [],
  };

  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    result.valid = false;
    result.errors.push(`Cannot read file: ${filePath}`);
    return result;
  }

  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    result.valid = false;
    result.errors.push(
      'Missing or invalid YAML frontmatter (must be delimited by --- lines)'
    );
    return result;
  }

  const { data, body } = frontmatter;

  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!(field in data) || data[field] === undefined || data[field] === null) {
      result.valid = false;
      result.errors.push(`Missing required frontmatter field: "${field}"`);
    }
  }

  if (typeof data['name'] === 'string') {
    if (!KEBAB_CASE_REGEX.test(data['name'])) {
      result.valid = false;
      result.errors.push(
        `Field "name" must be kebab-case, got: "${data['name']}"`
      );
    }
  } else if ('name' in data) {
    result.valid = false;
    result.errors.push(`Field "name" must be a string`);
  }

  if ('description' in data && typeof data['description'] !== 'string') {
    result.valid = false;
    result.errors.push(`Field "description" must be a string`);
  }

  if (typeof data['version'] === 'string') {
    if (!SEMVER_REGEX.test(data['version'])) {
      result.valid = false;
      result.errors.push(
        `Field "version" must be a valid semver string, got: "${data['version']}"`
      );
    }
  } else if ('version' in data) {
    result.valid = false;
    result.errors.push(`Field "version" must be a string`);
  }

  if ('allowed-tools' in data) {
    const tools = data['allowed-tools'];
    if (typeof tools === 'string') {
      if (tools.trim().length === 0) {
        result.valid = false;
        result.errors.push(`Field "allowed-tools" must not be empty`);
      }
    } else if (Array.isArray(tools)) {
      const nonStringItems = tools.filter(
        (item: unknown) => typeof item !== 'string'
      );
      if (nonStringItems.length > 0) {
        result.valid = false;
        result.errors.push(`Field "allowed-tools" must contain only strings`);
      }
    } else {
      result.valid = false;
      result.errors.push(
        `Field "allowed-tools" must be a comma-separated string or array of strings`
      );
    }
  }

  const headings = extractHeadings(body);

  for (const section of REQUIRED_SECTIONS) {
    const allAcceptable = [section.heading, ...section.alternatives];
    const found = headings.some((h) => allAcceptable.some((a) => a === h));
    if (!found) {
      result.valid = false;
      const names =
        section.alternatives.length > 0
          ? `"${section.heading}" (or "${section.alternatives.join('", "')}")`
          : `"${section.heading}"`;
      result.errors.push(`Missing required section: ${names}`);
    }
  }

  if (content.includes('<prompt>')) {
    result.valid = false;
    result.errors.push(
      'Contains raw <prompt> XML wrapper (old format detected)'
    );
  }

  return result;
}

/**
 * Scans a directory for skill.md files and validates each one
 * @param skillsDir - Path to the skills directory
 * @returns Array of validation results
 */
export function validateAllSkills(skillsDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (!fs.existsSync(skillsDir)) {
    return results;
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillMdPath = path.join(skillsDir, entry.name, 'skill.md');
    if (fs.existsSync(skillMdPath)) {
      results.push(validateSkillFile(skillMdPath));
    }
  }

  return results;
}

/**
 * Main entry point when run as CLI script
 */
function main(): void {
  const skillsDir = path.resolve(process.cwd(), 'lib', 'skills');

  console.log('Validating skill files...');
  console.log('');

  const results = validateAllSkills(skillsDir);

  if (results.length === 0) {
    console.log('No skill.md files found to validate');
    process.exit(0);
  }

  let hasFailures = false;

  for (const result of results) {
    const status = result.valid ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${result.skillName} (${result.filePath})`);

    for (const error of result.errors) {
      console.log(`  ERROR: ${error}`);
    }

    for (const warning of result.warnings) {
      console.log(`  WARN: ${warning}`);
    }

    if (!result.valid) {
      hasFailures = true;
    }
  }

  console.log('');
  const passed = results.filter((r) => r.valid).length;
  console.log(`Results: ${passed}/${results.length} skills passed validation`);

  if (hasFailures) {
    process.exit(1);
  }
}

const isMainModule = typeof require !== 'undefined' && require.main === module;

if (isMainModule) {
  main();
}
