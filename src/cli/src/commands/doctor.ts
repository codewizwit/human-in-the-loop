import {
  logInfo,
  logHeader,
  logSuccess,
  logNewLine,
  logError,
  logWarning,
} from '../utils/logger';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Gets the version of a command or returns null if not found
 */
function getCommandVersion(
  command: string,
  versionFlag = '--version'
): string | null {
  try {
    const output = execSync(`${command} ${versionFlag}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const versionMatch = output.match(/\d+\.\d+\.\d+/);
    return versionMatch ? versionMatch[0] : output.split('\n')[0];
  } catch {
    return null;
  }
}

/**
 * Checks if a directory exists
 */
function checkDirectory(path: string): boolean {
  return existsSync(path);
}

/**
 * Validates the local environment and diagnoses issues
 */
export async function doctorCommand(): Promise<void> {
  logInfo('🔍 Running diagnostic checks...');
  logNewLine();

  let hasErrors = false;
  let hasWarnings = false;

  logHeader('Environment:');
  const nodeVersion = getCommandVersion('node', '--version');
  if (nodeVersion) {
    console.log(chalk.green('  ✓ Node.js') + chalk.gray(` ${nodeVersion}`));
  } else {
    console.log(chalk.red('  ✗ Node.js') + chalk.gray(' not found'));
    hasErrors = true;
  }

  const pnpmVersion = getCommandVersion('pnpm', '--version');
  if (pnpmVersion) {
    console.log(chalk.green('  ✓ pnpm') + chalk.gray(` ${pnpmVersion}`));
  } else {
    console.log(chalk.yellow('  ⚠ pnpm') + chalk.gray(' not found (optional)'));
    hasWarnings = true;
  }

  const npmVersion = getCommandVersion('npm', '--version');
  if (npmVersion) {
    console.log(chalk.green('  ✓ npm') + chalk.gray(` ${npmVersion}`));
  } else {
    console.log(chalk.red('  ✗ npm') + chalk.gray(' not found'));
    hasErrors = true;
  }

  logNewLine();

  logHeader('Version Control:');
  const gitVersion = getCommandVersion('git', '--version');
  if (gitVersion) {
    console.log(chalk.green('  ✓ git') + chalk.gray(` ${gitVersion}`));
  } else {
    console.log(
      chalk.yellow('  ⚠ git') + chalk.gray(' not found (recommended)')
    );
    hasWarnings = true;
  }

  const ghVersion = getCommandVersion('gh', '--version');
  if (ghVersion) {
    console.log(
      chalk.green('  ✓ GitHub CLI') + chalk.gray(` ${ghVersion.split('\n')[0]}`)
    );
  } else {
    console.log(
      chalk.yellow('  ⚠ GitHub CLI') +
        chalk.gray(' not found (needed for contribute command)')
    );
    hasWarnings = true;
  }

  logNewLine();

  logHeader('Installation Paths:');
  const homeDir = homedir();
  const claudeDir = join(homeDir, '.claude');
  const toolsDir = join(claudeDir, 'tools');
  const registryPath = join(claudeDir, 'registry.json');

  if (checkDirectory(claudeDir)) {
    console.log(
      chalk.green('  ✓ .claude directory') + chalk.gray(` ${claudeDir}`)
    );

    if (checkDirectory(toolsDir)) {
      console.log(
        chalk.green('  ✓ tools directory') + chalk.gray(` ${toolsDir}`)
      );
    } else {
      console.log(
        chalk.yellow('  ⚠ tools directory') +
          chalk.gray(' not found (will be created on first install)')
      );
    }

    if (existsSync(registryPath)) {
      console.log(chalk.green('  ✓ registry.json') + chalk.gray(' found'));
    } else {
      console.log(
        chalk.yellow('  ⚠ registry.json') +
          chalk.gray(' not found (will be created on first install)')
      );
    }
  } else {
    console.log(
      chalk.yellow('  ⚠ .claude directory') +
        chalk.gray(' not found (will be created on first install)')
    );
  }

  logNewLine();

  if (hasErrors) {
    logError(
      'Some critical checks failed. Please install missing dependencies.'
    );
  } else if (hasWarnings) {
    logWarning(
      'All critical checks passed, but some optional tools are missing.'
    );
  } else {
    logSuccess('All checks passed! Your environment is ready.');
  }

  logNewLine();

  if (!ghVersion) {
    console.log(chalk.gray('  To install GitHub CLI: https://cli.github.com/'));
  }
}
