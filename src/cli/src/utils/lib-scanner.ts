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
 * Scans the lib directory and returns all available tools
 * @param toolkitPath - The root path to the lib directory containing prompts, agents, etc. Defaults to 'lib' in current working directory
 * @returns Array of Tool objects found in the lib directory and its subdirectories
 */
export function scanToolkit(
  toolkitPath: string = path.join(process.cwd(), 'lib')
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

    scanDirectory(typePath, type, tools);
  }

  return tools;
}

/**
 * Recursively scans a directory for tools and adds them to the tools array
 * @param dirPath - The directory path to scan
 * @param type - The type of tool to register (prompt, agent, evaluator, guardrail, context-pack)
 * @param tools - The array to accumulate found tools into (modified in place)
 */
function scanDirectory(
  dirPath: string,
  type: Tool['type'],
  tools: Tool[]
): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const configFile = findConfigFile(fullPath);

    if (configFile) {
      const tool = parseToolConfig(fullPath, configFile, type);
      if (tool) {
        tools.push(tool);
      }
    } else {
      scanDirectory(fullPath, type, tools);
    }
  }
}

/**
 * Finds the configuration file in a tool directory by checking for known config file names
 * @param toolDir - The directory path to search for configuration files
 * @returns The full path to the configuration file if found, null otherwise
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
 * Parses a tool configuration file and creates a Tool object
 * @param toolDir - The directory containing the tool
 * @param configFile - The full path to the configuration YAML file
 * @param type - The type of tool being parsed (prompt, agent, evaluator, guardrail, context-pack)
 * @returns A Tool object if parsing succeeds and required fields are present, null otherwise
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
 * Searches for tools matching a query string across multiple fields
 * @param query - Optional search query to filter tools by id, name, description, category, or tags. If omitted, returns all tools
 * @param toolkitPath - Optional path to the lib directory. Defaults to 'lib' in current working directory
 * @returns Array of Tool objects matching the query, or all tools if no query provided
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
 * Gets a specific tool by its unique identifier
 * @param toolId - The unique ID of the tool to retrieve (e.g., 'code-review-ts', 'api-design')
 * @param toolkitPath - Optional path to the lib directory. Defaults to 'lib' in current working directory
 * @returns The Tool object if found, null otherwise
 */
export function getTool(toolId: string, toolkitPath?: string): Tool | null {
  const allTools = scanToolkit(toolkitPath);
  return allTools.find((tool) => tool.id === toolId) || null;
}
