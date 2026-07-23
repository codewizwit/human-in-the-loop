import {
  logInfo,
  logStep,
  logSuccess,
  logWarning,
  logError,
  logNewLine,
  logHeader,
  logTip,
} from '../utils/logger';
import chalk from 'chalk';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  rmSync,
} from 'fs';
import { dirname, join } from 'path';
import {
  getInstalledTools,
  registerInstallation,
  InstalledTool,
} from '../utils/registry';
import { getTool, scanToolkit } from '../utils/lib-scanner';

/**
 * Extracts the version from a skill.md file's YAML frontmatter
 * @param filePath - Absolute path to a skill.md file
 * @returns The version string, or null if not found
 */
function extractSkillVersion(filePath: string): string | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return null;
    }

    const versionMatch = frontmatterMatch[1].match(/^version:\s*(.+)$/m);
    return versionMatch ? versionMatch[1].trim().replace(/['"]/g, '') : null;
  } catch {
    return null;
  }
}

/**
 * Copies a skill file from the toolkit to the installed path
 * @param sourcePath - Path to the source skill.md
 * @param destinationPath - Path to the installed location
 */
function copySkillFile(sourcePath: string, destinationPath: string): void {
  const destDir = dirname(destinationPath);

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const content = readFileSync(sourcePath, 'utf-8');
  writeFileSync(destinationPath, content, 'utf-8');
}

/**
 * Resolves the target file path for upgrading a skill. If the installed path
 * is a directory (old format), removes the directory and returns a file path
 * at the same level as `<id>.md`. This migrates old directory-based installs
 * to the unified single-file format.
 * @param installed - The installed tool registry entry
 * @returns The resolved file path where the new skill.md should be written
 */
function resolveUpgradePath(installed: InstalledTool): string {
  try {
    if (existsSync(installed.installedPath)) {
      const stat = statSync(installed.installedPath);

      if (stat.isDirectory()) {
        rmSync(installed.installedPath, { recursive: true });
        const parentDir = dirname(installed.installedPath);
        return join(parentDir, `${installed.id}.md`);
      }
    }
  } catch {
    /* fall through to default */
  }

  if (!installed.installedPath.endsWith('.md')) {
    return `${installed.installedPath}.md`;
  }

  return installed.installedPath;
}

/**
 * Represents the upgrade status for a single installed tool
 */
interface UpgradeResult {
  id: string;
  status: 'upgraded' | 'current' | 'not-found' | 'error';
  oldVersion: string;
  newVersion?: string;
  message?: string;
}

/**
 * Options for the upgrade command
 */
interface UpgradeOptions {
  skill?: string;
}

/**
 * Upgrades installed skills to the latest versions bundled with the CLI.
 * Scans the registry for installed tools, compares versions with the toolkit,
 * and re-copies updated skill files to their installed paths.
 * @param options - Optional configuration including specific skill to upgrade
 */
export async function upgradeCommand(options: UpgradeOptions): Promise<void> {
  logInfo('⬆️  Checking installed skills for updates...');
  logNewLine();

  const installedTools = getInstalledTools();

  if (installedTools.length === 0) {
    logWarning('No skills installed yet');
    logNewLine();
    logStep('Use ' + chalk.bold('hit search') + ' to find skills');
    logStep('Use ' + chalk.bold('hit install <id>') + ' to install a skill');
    return;
  }

  let toolsToUpgrade: InstalledTool[];

  if (options.skill) {
    const tool = installedTools.find((t) => t.id === options.skill);

    if (!tool) {
      logError(`Skill "${options.skill}" is not installed`);
      logStep('Use ' + chalk.bold('hit list') + ' to see installed skills');
      return;
    }

    toolsToUpgrade = [tool];
  } else {
    toolsToUpgrade = installedTools;
  }

  scanToolkit();

  const results: UpgradeResult[] = [];

  for (const installed of toolsToUpgrade) {
    const bundled = getTool(installed.id);

    if (!bundled) {
      results.push({
        id: installed.id,
        status: 'not-found',
        oldVersion: installed.version,
        message: 'No longer available in toolkit',
      });
      continue;
    }

    const skillMdPath = join(bundled.path, 'skill.md');

    if (!existsSync(skillMdPath)) {
      results.push({
        id: installed.id,
        status: 'not-found',
        oldVersion: installed.version,
        message: 'No skill.md found in toolkit',
      });
      continue;
    }

    const bundledVersion =
      extractSkillVersion(skillMdPath) || bundled.version || 'unknown';
    const installedVersion = installed.version;

    if (bundledVersion === installedVersion) {
      const isFile =
        existsSync(installed.installedPath) &&
        statSync(installed.installedPath).isFile();
      const installedFileVersion = isFile
        ? extractSkillVersion(installed.installedPath)
        : null;

      if (installedFileVersion === bundledVersion) {
        results.push({
          id: installed.id,
          status: 'current',
          oldVersion: installedVersion,
          newVersion: bundledVersion,
        });
        continue;
      }
    }

    try {
      const targetPath = resolveUpgradePath(installed);
      copySkillFile(skillMdPath, targetPath);

      registerInstallation({
        ...installed,
        version: bundledVersion,
        installedPath: targetPath,
        installedAt: new Date().toISOString(),
      });

      results.push({
        id: installed.id,
        status: 'upgraded',
        oldVersion: installedVersion,
        newVersion: bundledVersion,
      });
    } catch (error) {
      results.push({
        id: installed.id,
        status: 'error',
        oldVersion: installedVersion,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const upgraded = results.filter((r) => r.status === 'upgraded');
  const current = results.filter((r) => r.status === 'current');
  const notFound = results.filter((r) => r.status === 'not-found');
  const errors = results.filter((r) => r.status === 'error');

  if (upgraded.length > 0) {
    logHeader('Upgraded:');
    for (const r of upgraded) {
      logSuccess(
        `${r.id}: ${chalk.gray(r.oldVersion)} → ${chalk.green(r.newVersion)}`
      );
    }
  }

  if (current.length > 0) {
    logHeader('Already up to date:');
    for (const r of current) {
      logStep(`${r.id} (v${r.oldVersion})`);
    }
  }

  if (notFound.length > 0) {
    logHeader('Not found in toolkit:');
    for (const r of notFound) {
      logWarning(`${r.id} — ${r.message}`);
    }
  }

  if (errors.length > 0) {
    logHeader('Errors:');
    for (const r of errors) {
      logError(`${r.id} — ${r.message}`);
    }
  }

  logNewLine();

  if (upgraded.length > 0) {
    logSuccess(
      `Upgraded ${upgraded.length} skill${upgraded.length === 1 ? '' : 's'}`
    );
  } else {
    logInfo('All installed skills are up to date');
  }

  if (notFound.length > 0) {
    logNewLine();
    logTip(
      'Skills marked "not found" may have been renamed or removed. Use ' +
        chalk.bold('hit search') +
        ' to find replacements'
    );
  }
}
