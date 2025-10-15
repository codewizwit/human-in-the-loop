import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

/**
 * Represents a tool found in the toolkit
 */
export interface Tool {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  type: 'prompt' | 'agent' | 'evaluator' | 'guardrail' | 'context-pack';
  path: string;
  metadata?: {
    author?: string;
    license?: string;
    tags?: string[];
    lastUpdated?: string;
  };
}

/**
 * Scans the toolkit directory and returns all available tools
 */
export function scanToolkit(
  toolkitPath: string = path.join(process.cwd(), 'toolkit')
): Tool[] {
  const tools: Tool[] = [];

  const toolTypes: Array<{
    type: Tool['type'];
    dir: string;
  }> = [
    { type: 'prompt', dir: 'prompts' },
    { type: 'agent', dir: 'agents' },
    { type: 'evaluator', dir: 'evaluators' },
    { type: 'guardrail', dir: 'guardrails' },
    { type: 'context-pack', dir: 'context-packs' },
  ];

  for (const { type, dir } of toolTypes) {
    const typePath = path.join(toolkitPath, dir);

    if (!fs.existsSync(typePath)) {
      continue;
    }

    const entries = fs.readdirSync(typePath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const toolDir = path.join(typePath, entry.name);
      const configFile = findConfigFile(toolDir);

      if (configFile) {
        const tool = parseToolConfig(toolDir, configFile, type);
        if (tool) {
          tools.push(tool);
        }
      }
    }
  }

  return tools;
}

/**
 * Finds the configuration file in a tool directory
 */
function findConfigFile(toolDir: string): string | null {
  const possibleFiles = [
    'prompt.yaml',
    'prompt.yml',
    'agent.yaml',
    'agent.yml',
    'config.yaml',
    'config.yml',
  ];

  for (const file of possibleFiles) {
    const filePath = path.join(toolDir, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

/**
 * Parses a tool configuration file
 */
function parseToolConfig(
  toolDir: string,
  configFile: string,
  type: Tool['type']
): Tool | null {
  try {
    const content = fs.readFileSync(configFile, 'utf-8');
    const config = parse(content) as unknown;

    if (
      !config ||
      typeof config !== 'object' ||
      !('id' in config) ||
      !('name' in config) ||
      !('version' in config)
    ) {
      return null;
    }

    const typedConfig = config as {
      id: string;
      name: string;
      version: string;
      description?: string;
      category?: string;
      metadata?: Tool['metadata'];
    };

    return {
      id: typedConfig.id,
      name: typedConfig.name,
      version: typedConfig.version,
      description: typedConfig.description || '',
      category: typedConfig.category || 'general',
      type,
      path: toolDir,
      metadata: typedConfig.metadata,
    };
  } catch {
    return null;
  }
}

/**
 * Searches for tools matching a query
 */
export function searchTools(query?: string, toolkitPath?: string): Tool[] {
  const allTools = scanToolkit(toolkitPath);

  if (!query) {
    return allTools;
  }

  const lowerQuery = query.toLowerCase();

  return allTools.filter(
    (tool) =>
      tool.id.toLowerCase().includes(lowerQuery) ||
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery) ||
      tool.metadata?.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Gets a specific tool by its ID
 */
export function getTool(toolId: string, toolkitPath?: string): Tool | null {
  const allTools = scanToolkit(toolkitPath);
  return allTools.find((tool) => tool.id === toolId) || null;
}
