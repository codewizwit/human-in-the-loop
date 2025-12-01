import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import { XMLParser } from 'fast-xml-parser';

/**
 * Represents a tool found in the toolkit
 */
export interface Tool {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  type:
    | 'prompt'
    | 'agent'
    | 'evaluator'
    | 'guardrail'
    | 'context-pack'
    | 'skill';
  path: string;
  metadata?: {
    author?: string;
    license?: string;
    tags?: string[];
    lastUpdated?: string;
  };
}

/**
 * Checks if a directory is a valid Human-in-the-Loop lib directory
 * by verifying it has the expected subdirectories
 * @param libPath - Path to check
 * @returns True if it looks like a valid lib directory
 */
function isValidLibDirectory(libPath: string): boolean {
  if (!fs.existsSync(libPath)) {
    return false;
  }

  const expectedDirs = [
    'prompts',
    'agents',
    'evaluators',
    'guardrails',
    'context-packs',
    'skills',
  ];
  return expectedDirs.some((dir) => fs.existsSync(path.join(libPath, dir)));
}

/**
 * Gets the default lib directory path by searching multiple locations
 * First attempts to find lib in the current working directory (for local development).
 * If not found, searches the package installation directory (for global npm installs).
 * When installed globally via npm, the directory structure is:
 * - __dirname: .../cli/src/cli/src/utils
 * - lib location: .../cli/lib
 * Falls back to current working directory if neither location contains a valid lib.
 * @returns Path to the lib directory, or current working directory lib path as fallback
 */
function getDefaultLibPath(): string {
  const cwdLib = path.join(process.cwd(), 'lib');
  if (isValidLibDirectory(cwdLib)) {
    return cwdLib;
  }

  const packageLib = path.join(__dirname, '../../../../lib');
  if (isValidLibDirectory(packageLib)) {
    return packageLib;
  }

  return cwdLib;
}

/**
 * Scans the lib directory and returns all available tools
 * @param toolkitPath - The root path to the lib directory containing prompts, agents, etc. Defaults to auto-detected lib directory
 * @returns Array of Tool objects found in the lib directory and its subdirectories
 */
export function scanToolkit(toolkitPath?: string): Tool[] {
  const libPath = toolkitPath || getDefaultLibPath();
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
    { type: 'skill', dir: 'skills' },
  ];

  for (const { type, dir } of toolTypes) {
    const typePath = path.join(libPath, dir);

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
 * @param type - The type of tool to register (prompt, agent, evaluator, guardrail, context-pack, skill)
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
    'prompt.md',
    'prompt.yaml',
    'prompt.yml',
    'agent.yaml',
    'agent.yml',
    'config.yaml',
    'config.yml',
    'metadata.json',
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
 * Extracts frontmatter from markdown content
 * @param content - The markdown content
 * @returns Object containing frontmatter data and content body
 */
function parseFrontmatter(content: string): {
  data: unknown;
  content: string;
} | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  try {
    const data = parse(match[1]) as unknown;
    const body = match[2];
    return { data, content: body };
  } catch {
    return null;
  }
}

/**
 * Parses pure XML prompt format and extracts metadata
 * @param content - The XML content starting with <prompt>
 * @returns Object containing metadata if parsing succeeds, null otherwise
 */
function parseXmlPrompt(content: string): {
  id: string;
  name: string;
  version: string;
  description?: string;
  category?: string;
} | null {
  if (!content.trim().startsWith('<prompt>')) {
    return null;
  }

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: false,
      trimValues: true,
    });

    const parsed = parser.parse(content) as {
      prompt?: { metadata?: Record<string, unknown> };
    };

    if (!parsed.prompt?.metadata) {
      return null;
    }

    const metadata = parsed.prompt.metadata;

    if (!metadata.id || !metadata.name || !metadata.version) {
      return null;
    }

    return {
      id: typeof metadata.id === 'string' ? metadata.id : '',
      name: typeof metadata.name === 'string' ? metadata.name : '',
      version: typeof metadata.version === 'string' ? metadata.version : '',
      description:
        typeof metadata.description === 'string'
          ? metadata.description
          : undefined,
      category:
        typeof metadata.category === 'string' ? metadata.category : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Parses a tool configuration file and creates a Tool object
 * @param toolDir - The directory containing the tool
 * @param configFile - The full path to the configuration file (YAML, JSON, or Markdown with frontmatter)
 * @param type - The type of tool being parsed (prompt, agent, evaluator, guardrail, context-pack, skill)
 * @returns A Tool object if parsing succeeds and required fields are present, null otherwise
 */
function parseToolConfig(
  toolDir: string,
  configFile: string,
  type: Tool['type']
): Tool | null {
  try {
    const content = fs.readFileSync(configFile, 'utf-8');

    let config: unknown;

    if (configFile.endsWith('.json')) {
      config = JSON.parse(content);
    } else if (configFile.endsWith('.md')) {
      const frontmatterParsed = parseFrontmatter(content);
      if (frontmatterParsed) {
        config = frontmatterParsed.data;
      } else {
        const xmlParsed = parseXmlPrompt(content);
        if (xmlParsed) {
          config = xmlParsed;
        } else {
          return null;
        }
      }
    } else {
      config = parse(content);
    }

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
