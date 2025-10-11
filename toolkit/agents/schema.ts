import { z } from 'zod';

/**
 * Zod schema for validating agent permissions
 */
export const permissionSchema = z.enum([
  'read:filesystem',
  'write:filesystem',
  'execute:bash',
  'network:fetch',
  'git:operations',
]);

/**
 * Zod schema for validating agent tools
 */
export const agentToolSchema = z.enum([
  'file-read',
  'file-write',
  'file-edit',
  'bash',
  'web-fetch',
  'grep',
  'glob',
]);

/**
 * Zod schema for validating evaluation rules
 */
export const evaluationRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  threshold: z.number().min(0).max(1),
});

/**
 * Zod schema for validating agent metrics
 */
export const agentMetricsSchema = z.object({
  averageLatency: z.number().nonnegative(),
  successRate: z.number().min(0).max(1),
  costPerExecution: z.number().nonnegative(),
  totalExecutions: z.number().int().nonnegative(),
});

/**
 * Zod schema for validating complete agent configuration
 */
export const agentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  model: z.string().min(1),
  tools: z.array(agentToolSchema),
  contextPacks: z.array(z.string()),
  permissions: z.array(permissionSchema),
  evaluationCriteria: z.array(evaluationRuleSchema),
  metrics: agentMetricsSchema.optional(),
  author: z.string().min(1),
  license: z.string().min(1),
  tags: z.array(z.string()),
});
