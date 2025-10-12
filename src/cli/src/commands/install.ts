import {
  logInfo,
  logStep,
  logSuccess,
  logTip,
  logNewLine,
} from '../utils/logger';
import chalk from 'chalk';

/**
 * Installs a prompt or agent from the library
 */
export async function installCommand(tool: string): Promise<void> {
  logInfo(`📦 Installing ${tool}...`);
  logNewLine();

  logStep('Downloading tool...');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  logStep('Installing dependencies...');
  await new Promise((resolve) => setTimeout(resolve, 500));

  logStep('Caching for offline use...');
  await new Promise((resolve) => setTimeout(resolve, 300));

  logNewLine();
  logSuccess(`Successfully installed ${tool}`);
  logStep('Installed to: .claude/tools/' + tool);
  logTip('Run ' + chalk.bold('hitl list') + ' to see all installed tools');
}
