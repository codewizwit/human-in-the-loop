import {
  logInfo,
  logStep,
  logSuccess,
  logError,
  logNewLine,
} from '../utils/logger';
import { execSync } from 'child_process';

/**
 * Gets the current CLI version from package.json
 * @returns Current version string
 */
function getCurrentVersion(): string {
  try {
    // The package.json is in the same directory as the compiled JS
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const packageJson = require('../../package.json');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return packageJson.version;
  } catch {
    return 'unknown';
  }
}

/**
 * Gets the latest CLI version from npm registry
 * @returns Latest version string or null if unable to fetch
 */
function getLatestVersion(): string | null {
  try {
    const result = execSync('npm view @human-in-the-loop/cli version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Updates the CLI to the latest version from npm
 */
export async function updateCommand(): Promise<void> {
  logInfo('🔍 Checking for updates...');
  logNewLine();

  const currentVersion = getCurrentVersion();
  const latestVersion = getLatestVersion();

  if (!latestVersion) {
    logError(
      'Unable to check for updates. Please check your internet connection.'
    );
    return;
  }

  logStep(`Current version: v${currentVersion}`);
  logStep(`Latest version:  v${latestVersion}`);
  logNewLine();

  if (currentVersion === latestVersion) {
    logSuccess('You are already running the latest version!');
    return;
  }

  logInfo('⬆️  Updating CLI to latest version...');
  logNewLine();

  try {
    logStep('Running: npm install -g @human-in-the-loop/cli@latest');

    execSync('npm install -g @human-in-the-loop/cli@latest', {
      stdio: 'inherit',
    });

    logNewLine();
    logSuccess(
      `Successfully updated CLI from v${currentVersion} to v${latestVersion}`
    );
    logStep('All bundled tools (prompts, agents, skills) have been updated!');
  } catch {
    logNewLine();
    logError('Update failed. Please try manually:');
    logStep('  npm install -g @human-in-the-loop/cli@latest');
  }
}
