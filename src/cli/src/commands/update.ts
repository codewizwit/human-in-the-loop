import {
  logInfo,
  logStep,
  logSuccess,
  logWarning,
  logError,
  logHeader,
  logNewLine,
} from '../utils/logger';
import chalk from 'chalk';
import { getTool } from '../utils/lib-scanner';
import { copyDirectory } from '../utils/file-operations';
import {
  getInstalledTools,
  registerInstallation,
  getInstalledTool,
} from '../utils/registry';
import inquirer from 'inquirer';
import { existsSync, renameSync } from 'fs';

/**
 * Compares two semantic version strings
 * @param current - Current version (e.g., "1.0.0")
 * @param latest - Latest version (e.g., "1.1.0")
 * @returns true if latest is newer than current
 */
function isNewerVersion(current: string, latest: string): boolean {
  const parseCurrent = current.split('.').map(Number);
  const parseLatest = latest.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parseLatest[i] > parseCurrent[i]) return true;
    if (parseLatest[i] < parseCurrent[i]) return false;
  }
  return false;
}

/**
 * Checks for available updates for installed tools
 * @param toolId - Optional specific tool ID to check
 * @returns Array of tools that have updates available
 */
export async function checkForUpdates(toolId?: string): Promise<
  Array<{
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    installedPath: string;
  }>
> {
  const installedTools = toolId
    ? [getInstalledTool(toolId)].filter(Boolean)
    : getInstalledTools();

  const updatesAvailable = [];

  for (const installed of installedTools) {
    if (!installed) continue;

    const latestTool = getTool(installed.id);

    if (!latestTool) {
      logWarning(
        `Tool "${installed.id}" not found in toolkit (may have been removed)`
      );
      continue;
    }

    if (isNewerVersion(installed.version, latestTool.version)) {
      updatesAvailable.push({
        id: installed.id,
        name: installed.name,
        currentVersion: installed.version,
        latestVersion: latestTool.version,
        installedPath: installed.installedPath,
      });
    }
  }

  return updatesAvailable;
}

/**
 * Updates a specific tool to its latest version
 * @param toolIdentifier - The tool identifier in format type/id (e.g., prompt/code-review-ts)
 * @param options - Optional configuration including force and no-backup flags
 */
export async function updateCommand(
  toolIdentifier?: string,
  options?: {
    all?: boolean;
    check?: boolean;
    force?: boolean;
    noBackup?: boolean;
  }
): Promise<void> {
  if (options?.check) {
    logInfo('🔍 Checking for updates...');
    logNewLine();

    const updates = await checkForUpdates(
      toolIdentifier ? toolIdentifier.split('/')[1] : undefined
    );

    if (updates.length === 0) {
      logSuccess('All installed tools are up to date!');
      return;
    }

    logHeader(
      `Found ${updates.length} update${updates.length === 1 ? '' : 's'}:`
    );
    logNewLine();

    updates.forEach((update) => {
      console.log(
        chalk.blue(`  ${update.name}`) + chalk.gray(` (${update.id})`)
      );
      console.log(
        chalk.gray(`    Current: ${update.currentVersion}`) +
          chalk.green(` → Latest: ${update.latestVersion}`)
      );
      logNewLine();
    });

    return;
  }

  if (options?.all) {
    logInfo('⬆️  Updating all installed tools...');
    logNewLine();

    const updates = await checkForUpdates();

    if (updates.length === 0) {
      logSuccess('All installed tools are up to date!');
      return;
    }

    logHeader(
      `Found ${updates.length} update${updates.length === 1 ? '' : 's'}`
    );
    updates.forEach((update) => {
      console.log(
        chalk.gray(`  • ${update.name} `) +
          chalk.gray(`${update.currentVersion}`) +
          chalk.green(` → ${update.latestVersion}`)
      );
    });
    logNewLine();

    const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Update ${updates.length} tool${
          updates.length === 1 ? '' : 's'
        }?`,
        default: true,
      },
    ]);

    if (!proceed) {
      logInfo('Update cancelled');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const update of updates) {
      try {
        await performUpdate(
          update.id,
          update.installedPath,
          options?.noBackup || false
        );
        successCount++;
        logSuccess(`Updated ${update.name} to v${update.latestVersion}`);
      } catch (error) {
        failureCount++;
        logError(
          `Failed to update ${update.name}: ${(error as Error).message}`
        );
      }
    }

    logNewLine();
    logHeader('Update Summary:');
    console.log(chalk.green(`  ✓ ${successCount} updated successfully`));
    if (failureCount > 0) {
      console.log(chalk.red(`  ✗ ${failureCount} failed`));
    }

    return;
  }

  if (!toolIdentifier) {
    logError('Please specify a tool to update or use --all');
    logStep('Example: ' + chalk.bold('hit update prompt/code-review-ts'));
    logStep('Or: ' + chalk.bold('hit update --all'));
    return;
  }

  logInfo(`⬆️  Updating ${toolIdentifier}...`);
  logNewLine();

  const parts = toolIdentifier.split('/');
  if (parts.length !== 2) {
    logError('Invalid tool identifier. Use format: <type>/<id>');
    logStep('Example: ' + chalk.bold('hit update prompt/code-review-ts'));
    return;
  }

  const [, toolId] = parts;

  const installed = getInstalledTool(toolId);
  if (!installed) {
    logError(`Tool "${toolIdentifier}" is not installed`);
    logStep('Use ' + chalk.bold('hit list') + ' to see installed tools');
    return;
  }

  const latestTool = getTool(toolId);
  if (!latestTool) {
    logError(`Tool "${toolIdentifier}" not found in toolkit`);
    return;
  }

  if (
    !options?.force &&
    !isNewerVersion(installed.version, latestTool.version)
  ) {
    logSuccess(
      `${installed.name} is already up to date (v${installed.version})`
    );
    return;
  }

  logStep(`Updating from v${installed.version} to v${latestTool.version}...`);

  try {
    await performUpdate(
      toolId,
      installed.installedPath,
      options?.noBackup || false
    );
    logNewLine();
    logSuccess(
      `Successfully updated ${installed.name} to v${latestTool.version}`
    );
  } catch (error) {
    logError(`Update failed: ${(error as Error).message}`);
  }
}

/**
 * Performs the actual update operation
 * @param toolId - The tool ID to update
 * @param installedPath - The current installation path
 * @param noBackup - Whether to skip backup
 */
async function performUpdate(
  toolId: string,
  installedPath: string,
  noBackup: boolean
): Promise<void> {
  const latestTool = getTool(toolId);
  if (!latestTool) {
    throw new Error(`Tool "${toolId}" not found in toolkit`);
  }

  if (!noBackup) {
    const backupPath = `${installedPath}.backup-${Date.now()}`;
    if (existsSync(installedPath)) {
      logStep('Creating backup...');
      renameSync(installedPath, backupPath);
      logStep(`Backup created at: ${backupPath}`);
    }
  }

  logStep('Copying updated files...');
  await copyDirectory(latestTool.path, installedPath);

  logStep('Updating registry...');
  registerInstallation({
    id: latestTool.id,
    name: latestTool.name,
    version: latestTool.version,
    type: latestTool.type,
    installedPath: installedPath,
    installedAt: new Date().toISOString(),
  });
}
