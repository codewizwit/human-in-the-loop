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
import { getTool } from '../utils/lib-scanner';
import { copyDirectory, resolvePath } from '../utils/file-operations';
import {
  registerInstallation,
  isToolInstalled,
  getInstalledTool,
} from '../utils/registry';
import inquirer from 'inquirer';

/**
 * Installs a prompt or agent from the library to the specified location
 * @param toolIdentifier - The tool identifier in format type/id (e.g., prompt/code-review-ts)
 * @param options - Optional configuration including installation path
 */
export async function installCommand(
  toolIdentifier: string,
  options?: { path?: string }
): Promise<void> {
  logInfo(`📦 Installing ${toolIdentifier}...`);
  logNewLine();

  try {
    const parts = toolIdentifier.split('/');
    if (parts.length !== 2) {
      logError('Invalid tool identifier. Use format: <type>/<id>');
      logTip('Example: ' + chalk.bold('hit install prompt/code-review-ts'));
      return;
    }

    const [, toolId] = parts;

    logStep('Looking up tool...');
    const tool = getTool(toolId);

    if (!tool) {
      logError(`Tool "${toolIdentifier}" not found in toolkit`);
      logTip('Use ' + chalk.bold('hit search') + ' to see available tools');
      return;
    }

    if (isToolInstalled(tool.id)) {
      const installed = getInstalledTool(tool.id);
      logWarning(
        `Tool "${tool.id}" is already installed at: ${installed?.installedPath}`
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

    let installPath: string;

    if (options?.path) {
      installPath = resolvePath(options.path);
    } else {
      const { userPath } = await inquirer.prompt<{ userPath: string }>([
        {
          type: 'input',
          name: 'userPath',
          message: 'Where would you like to install this tool?',
          default: `~/.claude/tools/${tool.type}/${tool.id}`,
        },
      ]);

      installPath = resolvePath(userPath);
    }

    logStep('Copying tool files...');
    await copyDirectory(tool.path, installPath);

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
    logTip('Use ' + chalk.bold('hit list') + ' to see all installed tools');
  } catch (error) {
    logError(
      'Installation failed: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
