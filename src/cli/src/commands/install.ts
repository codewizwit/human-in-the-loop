import {
  logInfo,
  logStep,
  logSuccess,
  logTip,
  logWarning,
  logNewLine,
  logError,
} from '../utils/logger';
import chalk from 'chalk';
import { getTool, scanToolkit, Tool } from '../utils/lib-scanner';
import { resolvePath } from '../utils/file-operations';
import {
  registerInstallation,
  isToolInstalled,
  getInstalledTool,
} from '../utils/registry';
import {
  createClaudeCommand,
  isClaudeAvailable,
  installSkillFile,
} from '../utils/claude-integration';
import inquirer from 'inquirer';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Destination types for skill installation
 */
type DestinationType =
  | 'global-skill'
  | 'project-skill'
  | 'global-command'
  | 'project-command'
  | 'custom';

/**
 * Options for the install command
 */
interface InstallOptions {
  path?: string;
  claudeCommand?: boolean;
  destination?: string;
}

/**
 * Resolves the installation path for a given destination type and skill ID
 * @param destination - The destination type (global-skill, project-skill, etc.)
 * @param skillId - The skill identifier
 * @param customPath - Optional custom path when destination is 'custom'
 * @returns The resolved installation file path
 */
function resolveDestinationPath(
  destination: DestinationType,
  skillId: string,
  customPath?: string
): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '~';

  switch (destination) {
    case 'global-skill':
      return resolvePath(join(homeDir, '.claude', 'skills', `${skillId}.md`));
    case 'project-skill':
      return join(process.cwd(), '.claude', 'skills', `${skillId}.md`);
    case 'global-command':
      return resolvePath(join(homeDir, '.claude', 'commands', `${skillId}.md`));
    case 'project-command':
      return join(process.cwd(), '.claude', 'commands', `${skillId}.md`);
    case 'custom':
      return join(resolvePath(customPath || '.'), `${skillId}.md`);
  }
}

/**
 * Groups tools by category for the interactive browser
 * @param tools - Array of tools to group
 * @returns Object mapping category names to arrays of tools
 */
function groupByCategory(tools: Tool[]): Record<string, Tool[]> {
  const groups: Record<string, Tool[]> = {};

  for (const tool of tools) {
    const category = tool.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tool);
  }

  return groups;
}

/**
 * Runs the interactive skill browser when no skill ID is provided
 * @returns The selected Tool, or null if the user cancels
 */
async function interactiveBrowser(): Promise<Tool | null> {
  const allTools = scanToolkit();

  if (allTools.length === 0) {
    logError('No tools found in the toolkit');
    return null;
  }

  const grouped = groupByCategory(allTools);
  const categories = Object.keys(grouped).sort();

  const { selectedCategory } = await inquirer.prompt<{
    selectedCategory: string;
  }>([
    {
      type: 'list',
      name: 'selectedCategory',
      message: 'Select a category:',
      choices: categories.map((cat) => ({
        name: `${cat} (${grouped[cat].length} items)`,
        value: cat,
      })),
    },
  ]);

  const toolsInCategory = grouped[selectedCategory];

  const { selectedToolId } = await inquirer.prompt<{
    selectedToolId: string;
  }>([
    {
      type: 'list',
      name: 'selectedToolId',
      message: 'Select a skill to install:',
      choices: toolsInCategory.map((tool) => ({
        name: `${tool.id} - ${tool.description.substring(0, 60)}${
          tool.description.length > 60 ? '...' : ''
        }`,
        value: tool.id,
      })),
    },
  ]);

  return toolsInCategory.find((t) => t.id === selectedToolId) || null;
}

/**
 * Prompts the user to select a destination for the skill installation
 * @returns The selected destination type
 */
async function promptDestination(): Promise<DestinationType> {
  const { destination } = await inquirer.prompt<{
    destination: DestinationType;
  }>([
    {
      type: 'list',
      name: 'destination',
      message: 'Where would you like to install this skill?',
      choices: [
        {
          name: 'Global skills    (~/.claude/skills/)',
          value: 'global-skill',
        },
        {
          name: 'Project skills   (.claude/skills/)',
          value: 'project-skill',
        },
        {
          name: 'Global commands  (~/.claude/commands/)',
          value: 'global-command',
        },
        {
          name: 'Project commands (.claude/commands/)',
          value: 'project-command',
        },
        { name: 'Custom path', value: 'custom' },
      ],
    },
  ]);

  return destination;
}

/**
 * Checks if a tool directory contains a unified skill.md file
 * @param toolPath - Path to the tool directory
 * @returns True if skill.md exists in the directory
 */
function hasUnifiedSkillFile(toolPath: string): boolean {
  try {
    return existsSync(join(toolPath, 'skill.md'));
  } catch {
    return false;
  }
}

/**
 * Installs a skill or prompt from the library to the specified destination.
 * Supports both the new bare skill-id format (e.g., 'code-review-ts') and
 * the legacy type/id format (e.g., 'prompt/code-review-ts') with a deprecation warning.
 * When no identifier is provided, launches an interactive browser.
 * @param skillIdentifier - Optional skill identifier (bare id or legacy type/id format)
 * @param options - Optional configuration including path, destination, and Claude Code integration
 */
export async function installCommand(
  skillIdentifier?: string,
  options?: InstallOptions
): Promise<void> {
  try {
    let tool: Tool | null = null;

    if (!skillIdentifier) {
      logInfo('No skill specified. Launching interactive browser...');
      logNewLine();
      tool = await interactiveBrowser();

      if (!tool) {
        logInfo('Installation cancelled');
        return;
      }
    } else {
      let toolId = skillIdentifier;

      if (skillIdentifier.includes('/')) {
        const parts = skillIdentifier.split('/');
        if (parts.length === 2) {
          logWarning(
            `The type/id format "${skillIdentifier}" is deprecated. Use just the id: ${chalk.bold(
              `hit install ${parts[1]}`
            )}`
          );
          toolId = parts[1];
        } else {
          logError('Invalid tool identifier format');
          logTip('Example: ' + chalk.bold('hit install code-review-ts'));
          return;
        }
      }

      logInfo(`Looking up "${toolId}"...`);
      tool = getTool(toolId);

      if (!tool) {
        logError(`Skill "${toolId}" not found in toolkit`);
        logTip('Use ' + chalk.bold('hit search') + ' to see available skills');
        return;
      }
    }

    logNewLine();
    logInfo(`Found: ${chalk.bold(tool.name)} v${tool.version} (${tool.type})`);

    if (isToolInstalled(tool.id)) {
      const installed = getInstalledTool(tool.id);
      logWarning(
        `"${tool.id}" is already installed at: ${installed?.installedPath}`
      );

      const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to reinstall?',
          default: false,
        },
      ]);

      if (!proceed) {
        logInfo('Installation cancelled');
        return;
      }
    }

    let destination: DestinationType;
    let customPath: string | undefined;

    if (options?.destination) {
      destination = options.destination as DestinationType;
    } else if (options?.path) {
      destination = 'custom';
      customPath = options.path;
    } else {
      destination = await promptDestination();
    }

    if (destination === 'custom' && !customPath) {
      const { userPath } = await inquirer.prompt<{ userPath: string }>([
        {
          type: 'input',
          name: 'userPath',
          message: 'Enter custom installation path:',
          default: '.',
        },
      ]);
      customPath = userPath;
    }

    const installPath = resolveDestinationPath(
      destination,
      tool.id,
      customPath
    );

    logNewLine();
    logStep('Installing skill...');

    const isUnified = hasUnifiedSkillFile(tool.path);

    if (isUnified) {
      const skillMdPath = join(tool.path, 'skill.md');
      installSkillFile(skillMdPath, installPath);
    } else if (
      destination === 'global-command' ||
      destination === 'project-command'
    ) {
      if (!isClaudeAvailable()) {
        logWarning('Claude Code integration not available');
        return;
      }

      const fs = await import('fs');
      const promptMdPath = join(tool.path, 'prompt.md');
      const promptYamlPath = join(tool.path, 'prompt.yaml');
      const promptPath = fs.existsSync(promptMdPath)
        ? promptMdPath
        : promptYamlPath;

      createClaudeCommand(promptPath, tool.id);
    } else {
      const { copyDirectory } = await import('../utils/file-operations');
      const destDir = installPath.replace(`/${tool.id}.md`, '');
      await copyDirectory(tool.path, destDir);
    }

    logStep('Registering installation...');
    registerInstallation({
      id: tool.id,
      name: tool.name,
      version: tool.version,
      type: tool.type,
      installedPath: installPath,
      installedAt: new Date().toISOString(),
    });

    logNewLine();
    logSuccess(`Successfully installed ${tool.name} (v${tool.version})`);
    logStep('Installed to: ' + chalk.cyan(installPath));

    logNewLine();
    if (destination === 'global-skill' || destination === 'project-skill') {
      logTip(
        `This skill will auto-activate in Claude Code when relevant patterns are detected`
      );
    } else if (
      destination === 'global-command' ||
      destination === 'project-command'
    ) {
      logTip(
        `Use ${chalk.bold(`/${tool.id}`)} in Claude Code to activate this skill`
      );
    }

    logTip('Use ' + chalk.bold('hit list') + ' to see all installed tools');
  } catch (error) {
    logError(
      'Installation failed: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
