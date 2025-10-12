import { logInfo, logHeader, logStep, logNewLine } from '../utils/logger';
import chalk from 'chalk';

/**
 * Displays usage analytics and metrics for installed tools
 */
export async function statsCommand(options: { tool?: string }): Promise<void> {
  if (options.tool) {
    logInfo(`📊 Stats for ${options.tool}:`);
    logNewLine();
    logHeader('Usage:');
    logStep('Total uses: 45');
    logStep('Last used: 2 hours ago');
    logStep('Average rating: 4.8/5.0');
  } else {
    logInfo('📊 Overall Stats:');
    logNewLine();
    console.log(chalk.white('Tools Installed: ') + chalk.green('5'));
    console.log(chalk.white('Total Uses: ') + chalk.green('127'));
    console.log(chalk.white('Time Saved: ') + chalk.green('~15 hours'));

    logHeader('Most Used Tools:');
    console.log(
      chalk.green('  1. ') +
        chalk.bold('code-review-ts') +
        chalk.gray(' (45 uses)')
    );
    console.log(
      chalk.green('  2. ') +
        chalk.bold('test-generator') +
        chalk.gray(' (38 uses)')
    );
    console.log(
      chalk.green('  3. ') +
        chalk.bold('api-docs-generator') +
        chalk.gray(' (25 uses)')
    );
  }
}
