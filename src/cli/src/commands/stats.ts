import {
  logInfo,
  logHeader,
  logStep,
  logNewLine,
  logWarning,
} from '../utils/logger';
import chalk from 'chalk';
import { getInstalledTools } from '../utils/registry';

/**
 * Displays usage analytics and metrics for installed tools
 */
export async function statsCommand(options: { tool?: string }): Promise<void> {
  const installedTools = getInstalledTools();

  if (options.tool) {
    const tool = installedTools.find((t) => t.id === options.tool);

    if (!tool) {
      logWarning(`Tool "${options.tool}" not found in installed tools`);
      logStep('Use ' + chalk.bold('hit list') + ' to see installed tools');
      return;
    }

    logInfo(`📊 Stats for ${tool.name}:`);
    logNewLine();
    logHeader('Installation Info:');
    logStep(`ID: ${tool.id}`);
    logStep(`Type: ${tool.type}`);
    logStep(`Version: ${tool.version}`);
    logStep(`Installed: ${new Date(tool.installedAt).toLocaleDateString()}`);
    logStep(`Path: ${tool.installedPath}`);
    logNewLine();
    logInfo(
      chalk.gray(
        'Note: Usage tracking is not yet implemented. This shows installation data only.'
      )
    );
  } else {
    logInfo('📊 Overall Stats:');
    logNewLine();

    if (installedTools.length === 0) {
      logWarning('No tools installed yet');
      logNewLine();
      logStep('Use ' + chalk.bold('hit search') + ' to find tools');
      logStep(
        'Use ' + chalk.bold('hit install <type>/<id>') + ' to install a tool'
      );
      return;
    }

    console.log(
      chalk.white('Tools Installed: ') +
        chalk.green(installedTools.length.toString())
    );

    const toolsByType = installedTools.reduce((acc, tool) => {
      if (!acc[tool.type]) {
        acc[tool.type] = 0;
      }
      acc[tool.type]++;
      return acc;
    }, {} as Record<string, number>);

    logHeader('By Type:');
    Object.entries(toolsByType).forEach(([type, count]) => {
      console.log(chalk.gray(`  ${type}: `) + chalk.green(count.toString()));
    });

    const recentlyInstalled = [...installedTools].sort(
      (a, b) =>
        new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime()
    );

    if (recentlyInstalled.length > 0) {
      logNewLine();
      logHeader('Recently Installed:');
      recentlyInstalled.slice(0, 3).forEach((tool, index) => {
        const daysAgo = Math.floor(
          (Date.now() - new Date(tool.installedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const timeStr =
          daysAgo === 0
            ? 'today'
            : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
        console.log(
          chalk.green(`  ${index + 1}. `) +
            chalk.bold(tool.id) +
            chalk.gray(` (${timeStr})`)
        );
      });
    }

    logNewLine();
    logInfo(
      chalk.gray(
        'Note: Usage tracking (time saved, uses, etc.) is not yet implemented.'
      )
    );
    logInfo(
      chalk.gray(
        'Currently showing installation data only. Use --tool=<id> for details.'
      )
    );
  }
}
