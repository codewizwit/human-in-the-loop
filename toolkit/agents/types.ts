/**
 * Permission types for agent capabilities
 */
export type Permission =
  | 'read:filesystem'
  | 'write:filesystem'
  | 'execute:bash'
  | 'network:fetch'
  | 'git:operations';

/**
 * Available tools that agents can use
 */
export type AgentTool =
  | 'file-read'
  | 'file-write'
  | 'file-edit'
  | 'bash'
  | 'web-fetch'
  | 'grep'
  | 'glob';

/**
 * Evaluation rule for validating agent outputs
 */
export interface EvaluationRule {
  id: string;
  name: string;
  description: string;
  threshold: number;
}

/**
 * Performance metrics for an agent
 */
export interface AgentMetrics {
  averageLatency: number;
  successRate: number;
  costPerExecution: number;
  totalExecutions: number;
}

/**
 * Defines an AI agent configuration with its capabilities and requirements
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  version: string;
  model: string;
  tools: AgentTool[];
  contextPacks: string[];
  permissions: Permission[];
  evaluationCriteria: EvaluationRule[];
  metrics?: AgentMetrics;
  author: string;
  license: string;
  tags: string[];
}

/**
 * Categories for organizing agents
 */
export type AgentCategory =
  | 'code-generation'
  | 'code-review'
  | 'testing'
  | 'documentation'
  | 'refactoring'
  | 'analysis';
