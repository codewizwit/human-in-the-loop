import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';
import { XMLParser } from 'fast-xml-parser';
import { resolvePath } from './file-operations';

/**
 * Interface for prompt YAML structure
 */
interface PromptYaml {
  id: string;
  name: string;
  description: string;
  template: string;
  variables?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

/**
 * Interface for XML prompt metadata structure
 */
interface PromptMetadata {
  id: string;
  name: string;
  description: string;
  version?: string;
  category?: string;
  variables?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

/**
 * Extracts frontmatter and content from markdown
 * @param content - Markdown content with frontmatter
 * @returns Object with frontmatter data and content body
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
    const data = parseYaml(match[1]) as unknown;
    const body = match[2];
    return { data, content: body };
  } catch {
    return null;
  }
}

/**
 * Interface for parsed XML prompt structure
 */
interface ParsedXmlPrompt {
  prompt?: {
    metadata?: {
      id?: string;
      name?: string;
      description?: string;
      version?: string;
      category?: string;
      variables?:
        | {
            variable?:
              | {
                  name?: string;
                  description?: string;
                  required?: boolean | string;
                }
              | Array<{
                  name?: string;
                  description?: string;
                  required?: boolean | string;
                }>;
          }
        | Array<{
            name?: string;
            description?: string;
            required?: boolean | string;
          }>;
    };
    context?: string;
    instructions?: string;
    constraints?: string;
    output_format?: string;
  };
}

/**
 * Parses pure XML prompt format and extracts metadata and content
 * @param xmlContent - XML prompt content
 * @returns Object with metadata and prompt content (without metadata/examples)
 */
function parsePromptXml(xmlContent: string): {
  metadata: PromptMetadata;
  content: string;
} | null {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: false,
      trimValues: true,
    });

    const parsed = parser.parse(xmlContent) as ParsedXmlPrompt;

    if (!parsed.prompt) {
      return null;
    }

    const prompt = parsed.prompt;

    const metadata: PromptMetadata = {
      id: prompt.metadata?.id ?? 'unknown',
      name: prompt.metadata?.name ?? 'Unknown Prompt',
      description: prompt.metadata?.description ?? '',
      version: prompt.metadata?.version,
      category: prompt.metadata?.category,
    };

    if (prompt.metadata?.variables) {
      let varsArray: Array<{
        name?: string;
        description?: string;
        required?: boolean | string;
      }> = [];

      if (Array.isArray(prompt.metadata.variables)) {
        varsArray = prompt.metadata.variables;
      } else if (
        typeof prompt.metadata.variables === 'object' &&
        'variable' in prompt.metadata.variables
      ) {
        const varData = prompt.metadata.variables.variable;
        if (varData) {
          varsArray = Array.isArray(varData) ? varData : [varData];
        }
      }

      metadata.variables = varsArray.map((v) => {
        return {
          name: v.name ?? '',
          description: v.description ?? '',
          required:
            typeof v.required === 'boolean'
              ? v.required
              : v.required === 'true',
        };
      });
    }

    const contentParts: string[] = [];

    if (prompt.context) {
      contentParts.push('<context>');
      contentParts.push(prompt.context);
      contentParts.push('</context>');
      contentParts.push('');
    }

    if (prompt.instructions) {
      contentParts.push('<instructions>');
      contentParts.push(prompt.instructions);
      contentParts.push('</instructions>');
      contentParts.push('');
    }

    if (prompt.constraints) {
      contentParts.push('<constraints>');
      contentParts.push(prompt.constraints);
      contentParts.push('</constraints>');
      contentParts.push('');
    }

    if (prompt.output_format) {
      contentParts.push('<output_format>');
      contentParts.push(prompt.output_format);
      contentParts.push('</output_format>');
    }

    const content = contentParts.join('\n').trim();

    return { metadata, content };
  } catch {
    return null;
  }
}

/**
 * Creates a Claude Code slash command from a prompt template
 * @param promptPath - Path to the prompt.yaml, prompt.md, or prompt.xml file
 * @param commandName - Name for the slash command (defaults to prompt id)
 * @returns Path to the created command file
 */
export function createClaudeCommand(
  promptPath: string,
  commandName?: string
): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
  const claudeDir = resolvePath(join(homeDir, '.claude'));
  const commandsDir = join(claudeDir, 'commands');

  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }
  if (!existsSync(commandsDir)) {
    mkdirSync(commandsDir, { recursive: true });
  }

  let commandContent: string;
  let cmdName: string;

  const content = readFileSync(promptPath, 'utf-8');

  if (content.trim().startsWith('<prompt>')) {
    const parsed = parsePromptXml(content);

    if (!parsed) {
      throw new Error('Invalid XML prompt format');
    }

    cmdName = commandName || parsed.metadata.id;
    commandContent = generateXmlCommandContent(parsed.metadata, parsed.content);
  } else if (promptPath.endsWith('.md')) {
    const parsed = parseFrontmatter(content);

    if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
      throw new Error('Invalid markdown frontmatter');
    }

    const frontmatter = parsed.data as {
      id?: string;
      name?: string;
      description?: string;
      variables?: Array<{
        name: string;
        description?: string;
        required?: boolean;
      }>;
    };
    cmdName = commandName || frontmatter.id || 'unknown';

    commandContent = generateMarkdownCommandContent(
      frontmatter,
      parsed.content
    );
  } else {
    const prompt = parseYaml(content) as PromptYaml;

    cmdName = commandName || prompt.id;
    commandContent = generateCommandContent(prompt);
  }

  const commandFilePath = join(commandsDir, `${cmdName}.md`);
  writeFileSync(commandFilePath, commandContent, 'utf-8');

  return commandFilePath;
}

/**
 * Generates the markdown content for a Claude Code command from markdown frontmatter
 * @param frontmatter - The parsed frontmatter data
 * @param content - The prompt template content
 * @returns Markdown content for the command file
 */
function generateMarkdownCommandContent(
  frontmatter: {
    name?: string;
    description?: string;
    variables?: Array<{
      name: string;
      description?: string;
      required?: boolean;
    }>;
  },
  content: string
): string {
  const lines: string[] = [];

  if (frontmatter.name) {
    lines.push(`# ${frontmatter.name}\n`);
  }
  if (frontmatter.description) {
    lines.push(`# ${frontmatter.description}\n`);
  }
  lines.push(`# Generated by Human in the Loop CLI\n`);

  if (frontmatter.variables && frontmatter.variables.length > 0) {
    lines.push(`# Variables:`);
    for (const variable of frontmatter.variables) {
      const required = variable.required ? '(required)' : '(optional)';
      const desc = variable.description || '';
      lines.push(`#   {{${variable.name}}} ${required} - ${desc}`);
    }
    lines.push('');
  }

  lines.push(content);

  return lines.join('\n');
}

/**
 * Generates the markdown content for a Claude Code command from XML metadata
 * @param metadata - The parsed XML metadata
 * @param content - The prompt content (without metadata/examples)
 * @returns Markdown content for the command file
 */
function generateXmlCommandContent(
  metadata: PromptMetadata,
  content: string
): string {
  const lines: string[] = [];

  if (metadata.name) {
    lines.push(`# ${metadata.name}\n`);
  }
  if (metadata.description) {
    lines.push(`# ${metadata.description}\n`);
  }
  lines.push(`# Generated by Human in the Loop CLI\n`);

  if (metadata.variables && metadata.variables.length > 0) {
    lines.push(`# Variables:`);
    for (const variable of metadata.variables) {
      const required = variable.required ? '(required)' : '(optional)';
      const desc = variable.description || '';
      lines.push(`#   {{${variable.name}}} ${required} - ${desc}`);
    }
    lines.push('');
  }

  lines.push(content);

  return lines.join('\n');
}

/**
 * Generates the markdown content for a Claude Code command from YAML
 * @param prompt - The parsed prompt YAML
 * @returns Markdown content for the command file
 */
function generateCommandContent(prompt: PromptYaml): string {
  const lines: string[] = [];

  lines.push(
    `# ${prompt.name}\n`,
    `# ${prompt.description}\n`,
    `# Generated by Human in the Loop CLI\n`
  );

  if (prompt.variables && prompt.variables.length > 0) {
    lines.push(`# Variables:`);
    for (const variable of prompt.variables) {
      const required = variable.required ? '(required)' : '(optional)';
      lines.push(
        `#   {{${variable.name}}} ${required} - ${variable.description}`
      );
    }
    lines.push('');
  }

  lines.push(prompt.template);

  return lines.join('\n');
}

/**
 * Checks if Claude Code integration is available
 * @returns true if .claude directory exists or can be created
 */
export function isClaudeAvailable(): boolean {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (!homeDir) {
      return false;
    }

    const claudeDir = join(homeDir, '.claude');

    if (existsSync(claudeDir)) {
      return true;
    }

    mkdirSync(claudeDir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}
