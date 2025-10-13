import {
  logInfo,
  logWarning,
  logHeader,
  logTip,
  logNewLine,
} from '../utils/logger';
import chalk from 'chalk';
import { searchTools } from '../utils/toolkit-scanner';

/**
 * Searches for prompts and agents in the library based on a query
 */
export function searchCommand(query?: string): void {
  logInfo('🔍 Searching for tools...');
  logNewLine();

  try {
    const tools = searchTools(query);

    if (tools.length === 0) {
      logWarning(
        query
          ? `No tools found matching "${query}"`
          : 'No tools found in toolkit'
      );
      return;
    }

    if (!query) {
      logWarning('Showing all available tools:');
    } else {
      logWarning(`Searching for: "${query}"`);
    }

    logNewLine();
    logHeader(`Found ${tools.length} tool${tools.length === 1 ? '' : 's'}:`);
    logNewLine();

    tools.forEach((tool, index) => {
      console.log(
        chalk.green(`${index + 1}. `) + chalk.bold(`${tool.type}/${tool.id}`)
      );
      console.log(chalk.gray(`   ${tool.description}`));
      console.log(chalk.gray(`   Version: ${tool.version}`));
      if (tool.metadata?.tags && tool.metadata.tags.length > 0) {
        console.log(chalk.gray(`   Tags: ${tool.metadata.tags.join(', ')}`));
      }
      logNewLine();
    });

    logTip(
      'Use ' + chalk.bold('hitl install <type>/<id>') + ' to install a tool'
    );
  } catch (error) {
    logWarning(
      'Error scanning toolkit: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
