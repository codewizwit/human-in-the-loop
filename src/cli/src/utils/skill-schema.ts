import { z } from 'zod';

const KEBAB_CASE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const VALID_TOOLS = [
  'Read',
  'Glob',
  'Grep',
  'Write',
  'Edit',
  'AskUserQuestion',
  'EnterPlanMode',
] as const;

/**
 * Zod schema for validating the YAML frontmatter of a unified skill file.
 *
 * Enforces kebab-case naming, semver versioning, trigger phrase presence
 * in the description, and a minimum of one allowed tool.
 */
export const skillFrontmatterSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(
      KEBAB_CASE_PATTERN,
      'name must be kebab-case (lowercase letters, numbers, and hyphens)'
    ),
  description: z
    .string()
    .min(10)
    .refine(
      (desc) => desc.includes('"'),
      'description must include at least one trigger phrase wrapped in double quotes'
    ),
  version: z
    .string()
    .regex(SEMVER_PATTERN, 'version must follow semver format (e.g., 3.0.0)'),
  'allowed-tools': z
    .array(z.enum(VALID_TOOLS))
    .min(1, 'allowed-tools must contain at least one tool'),
});

/**
 * TypeScript type inferred from the skill frontmatter Zod schema.
 *
 * Represents the validated shape of YAML frontmatter in a unified skill file.
 */
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;

/** Successful validation result containing the parsed frontmatter data */
interface ValidationSuccess {
  success: true;
  data: SkillFrontmatter;
}

/** Failed validation result containing an array of error messages */
interface ValidationFailure {
  success: false;
  errors: string[];
}

/** Discriminated union returned by validateSkillFrontmatter */
export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validates skill frontmatter data against the unified skill schema.
 *
 * @param data - Raw parsed YAML frontmatter object to validate
 * @returns A discriminated result with `success: true` and parsed `data`,
 *          or `success: false` and an `errors` array of human-readable messages
 */
export function validateSkillFrontmatter(data: unknown): ValidationResult {
  const result = skillFrontmatterSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ),
  };
}
