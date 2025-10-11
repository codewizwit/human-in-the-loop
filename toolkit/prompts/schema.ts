import { z } from 'zod';

/**
 * Zod schema for validating prompt variable structure
 */
export const promptVariableSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  defaultValue: z.string().optional(),
});

/**
 * Zod schema for validating prompt examples
 */
export const promptExampleSchema = z.object({
  input: z.record(z.string()),
  output: z.string().min(1),
  description: z.string().optional(),
});

/**
 * Zod schema for validating prompt metadata
 */
export const promptMetadataSchema = z.object({
  author: z.string().min(1),
  license: z.string().min(1),
  tags: z.array(z.string()),
  rating: z.number().min(0).max(5).optional(),
  usageCount: z.number().int().nonnegative().optional(),
  lastUpdated: z.string(),
});

/**
 * Zod schema for validating complete prompt structure
 */
export const promptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  category: z.enum([
    'code-review',
    'documentation',
    'testing',
    'refactoring',
    'debugging',
    'api-design',
    'security',
    'performance',
  ]),
  template: z.string().min(1),
  variables: z.array(promptVariableSchema),
  examples: z.array(promptExampleSchema),
  metadata: promptMetadataSchema,
});
