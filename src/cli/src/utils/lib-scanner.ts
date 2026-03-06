import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

/**
 * Represents a skill found in the toolkit
 */
export interface Tool {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  type: 'skill';
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
 * by verifying it has a skills subdirectory
 * @param libPath - Path to check
 * @returns True if it contains a skills directory
 */
function isValidLibDirectory(libPath: string): boolean {
  if (!fs.existsSync(libPath)) {
    return false;
  }

  return fs.existsSync(path.join(libPath, 'skills'));
}

/**
 * Gets the default lib directory path by searching multiple locations.
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
 * Scans the lib/skills directory and returns all available skills
 * @param toolkitPath - The root path to the lib directory. Defaults to auto-detected lib directory
 * @returns Array of Tool objects found in the skills directory
 */
export function scanToolkit(toolkitPath?: string): Tool[] {
  const libPath = toolkitPath || getDefaultLibPath();
  const tools: Tool[] = [];
  const skillsPath = path.join(libPath, 'skills');

  if (!fs.existsSync(skillsPath)) {
    return tools;
  }

  scanDirectory(skillsPath, tools);

  return tools;
}

/**
 * Scans a directory for skills and adds them to the tools array
 * @param dirPath - The directory path to scan
 * @param tools - The array to accumulate found tools into (modified in place)
 */
function scanDirectory(dirPath: string, tools: Tool[]): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const skillFile = path.join(fullPath, 'skill.md');

    if (fs.existsSync(skillFile)) {
      const tool = parseSkillFile(fullPath, skillFile);
      if (tool) {
        tools.push(tool);
      }
    }
  }
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
 * Parses a skill.md file and creates a Tool object
 * @param toolDir - The directory containing the skill
 * @param skillFile - The full path to the skill.md file
 * @returns A Tool object if parsing succeeds, null otherwise
 */
function parseSkillFile(toolDir: string, skillFile: string): Tool | null {
  try {
    const content = fs.readFileSync(skillFile, 'utf-8');
    const parsed = parseFrontmatter(content);

    if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
      return null;
    }

    const config = parsed.data as {
      id?: string;
      name?: string;
      version?: string;
      description?: string;
      category?: string;
      metadata?: Tool['metadata'];
    };

    if (!config.version || (!config.id && !config.name)) {
      return null;
    }

    const toolId = config.id || config.name || '';
    const toolName = config.name || config.id || '';

    return {
      id: toolId,
      name: toolName,
      version: config.version,
      description: config.description || '',
      category: config.category || 'general',
      type: 'skill',
      path: toolDir,
      metadata: config.metadata,
    };
  } catch {
    return null;
  }
}

/**
 * Searches for skills matching a query string across multiple fields
 * @param query - Optional search query to filter by id, name, description, category, or tags. If omitted, returns all skills
 * @param toolkitPath - Optional path to the lib directory
 * @returns Array of Tool objects matching the query, or all skills if no query provided
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
 * Gets a specific skill by its unique identifier
 * @param toolId - The unique ID of the skill to retrieve
 * @param toolkitPath - Optional path to the lib directory
 * @returns The Tool object if found, null otherwise
 */
export function getTool(toolId: string, toolkitPath?: string): Tool | null {
  const allTools = scanToolkit(toolkitPath);
  return allTools.find((tool) => tool.id === toolId) || null;
}
