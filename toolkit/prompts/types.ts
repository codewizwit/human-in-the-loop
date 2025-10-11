/**
 * Represents a variable used in a prompt template
 */
export interface PromptVariable {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

/**
 * Example usage of a prompt with input and expected output
 */
export interface PromptExample {
  input: Record<string, string>;
  output: string;
  description?: string;
}

/**
 * Metadata for tracking prompt usage and quality
 */
export interface PromptMetadata {
  author: string;
  license: string;
  tags: string[];
  rating?: number;
  usageCount?: number;
  lastUpdated: string;
}

/**
 * Represents a versioned prompt with metadata and usage tracking
 */
export interface Prompt {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  template: string;
  variables: PromptVariable[];
  examples: PromptExample[];
  metadata: PromptMetadata;
}

/**
 * Categories for organizing prompts
 */
export type PromptCategory =
  | 'code-review'
  | 'documentation'
  | 'testing'
  | 'refactoring'
  | 'debugging'
  | 'api-design'
  | 'security'
  | 'performance';
