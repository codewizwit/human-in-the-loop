import { describe, it, expect } from '@jest/globals';
import {
  skillFrontmatterSchema,
  validateSkillFrontmatter,
} from '../skill-schema';

const validFrontmatter = {
  name: 'code-review-ts',
  description: 'Reviews TypeScript code. Use when the user says "review this".',
  version: '3.0.0',
  'allowed-tools': 'Read, Grep',
};

describe('skillFrontmatterSchema', () => {
  it('should accept valid frontmatter with allowed-tools as a string', () => {
    const result = skillFrontmatterSchema.safeParse(validFrontmatter);

    expect(result.success).toBe(true);
  });

  it('should accept valid frontmatter with allowed-tools as an array', () => {
    const result = skillFrontmatterSchema.safeParse({
      ...validFrontmatter,
      'allowed-tools': ['Read', 'Grep'],
    });

    expect(result.success).toBe(true);
  });
});

describe('validateSkillFrontmatter', () => {
  it('should return success with parsed data for valid frontmatter', () => {
    const result = validateSkillFrontmatter(validFrontmatter);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('code-review-ts');
      expect(result.data['allowed-tools']).toBe('Read, Grep');
    }
  });

  it('should accept allowed-tools provided as an array', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      'allowed-tools': ['Read'],
    });

    expect(result.success).toBe(true);
  });

  it('should reject a name that is not kebab-case', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      name: 'Code_Review',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.startsWith('name'))).toBe(true);
    }
  });

  it('should reject an empty name', () => {
    const result = validateSkillFrontmatter({ ...validFrontmatter, name: '' });

    expect(result.success).toBe(false);
  });

  it('should reject a version that is not semver', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      version: '3.0',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.startsWith('version'))).toBe(true);
    }
  });

  it('should reject a description shorter than 10 characters', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      description: 'too "x"',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a description without a quoted trigger phrase', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      description: 'A description with no trigger phrase anywhere in it',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.startsWith('description'))).toBe(true);
    }
  });

  it('should reject an empty allowed-tools string', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      'allowed-tools': '',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty allowed-tools array', () => {
    const result = validateSkillFrontmatter({
      ...validFrontmatter,
      'allowed-tools': [],
    });

    expect(result.success).toBe(false);
  });

  it('should collect multiple error messages when several fields are invalid', () => {
    const result = validateSkillFrontmatter({
      name: 'Bad Name',
      description: 'short',
      version: 'v1',
      'allowed-tools': '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(1);
    }
  });

  it('should reject a non-object input', () => {
    const result = validateSkillFrontmatter(null);

    expect(result.success).toBe(false);
  });
});
