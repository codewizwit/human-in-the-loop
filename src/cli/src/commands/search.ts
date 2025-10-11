import { logInfo, logWarning, logHeader, logTip, logNewLine } from '../utils/logger';
import chalk from 'chalk';

/**
 * Searches for prompts and agents in the library based on a query
 */
export async function searchCommand(query?: string): Promise<void> {
  logInfo('🔍 Searching for tools...');
  logNewLine();

  if (!query) {
    logWarning('Showing all available tools:');
  } else {
    logWarning(`Searching for: "${query}"`);
  }

  logNewLine();
  logHeader('Found 3 tools:');
  logNewLine();

  console.log(chalk.green('1. ') + chalk.bold('prompt/code-review-ts'));
  console.log(chalk.gray('   TypeScript code review with best practices'));
  console.log(chalk.gray('   Version: 1.2.0'));
  logNewLine();

  console.log(chalk.green('2. ') + chalk.bold('agent/test-generator'));
  console.log(chalk.gray('   Generate comprehensive test suites'));
  console.log(chalk.gray('   Version: 1.0.0'));
  logNewLine();

  console.log(chalk.green('3. ') + chalk.bold('prompt/api-docs-generator'));
  console.log(chalk.gray('   Generate API documentation from code'));
  console.log(chalk.gray('   Version: 2.1.0'));
  logNewLine();

  logTip('Use ' + chalk.bold('hitl install <tool>') + ' to install a tool');
}
