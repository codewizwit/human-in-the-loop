import {
  logInfo,
  logHeader,
  logListItem,
  logStep,
  logNewLine,
  logWarning,
} from '../utils/logger';
import { getInstalledTools } from '../utils/registry';
import chalk from 'chalk';

/**
 * Lists all installed tools
 */
export async function listCommand(): Promise<void> {
  logInfo('📋 Installed tools:');
  logNewLine();

  const installedTools = getInstalledTools();

  if (installedTools.length === 0) {
    logWarning('No tools installed yet');
    logNewLine();
    logStep('Use ' + chalk.bold('hit search') + ' to find tools');
    logStep(
      'Use ' + chalk.bold('hit install <type>/<id>') + ' to install a tool'
    );
    return;
  }

  const toolsByType = installedTools.reduce((acc, tool) => {
    if (!acc[tool.type]) {
      acc[tool.type] = [];
    }
    acc[tool.type].push(tool);
    return acc;
  }, {} as Record<string, typeof installedTools>);

  const typeLabels: Record<string, string> = {
    prompt: 'Prompts',
    agent: 'Agents',
    evaluator: 'Evaluators',
    guardrail: 'Guardrails',
    'context-pack': 'Context Packs',
  };

  for (const [type, tools] of Object.entries(toolsByType)) {
    const label = typeLabels[type] || type;
    logHeader(`${label}:`);
    tools.forEach((tool) => {
      logListItem(tool.id, `v${tool.version}`);
      console.log(chalk.gray(`   Installed at: ${tool.installedPath}`));
    });
    logNewLine();
  }

  logStep(
    `Total: ${installedTools.length} tool${
      installedTools.length === 1 ? '' : 's'
    } installed`
  );
}
