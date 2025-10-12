import {
  logInfo,
  logHeader,
  logListItem,
  logStep,
  logNewLine,
} from '../utils/logger';

/**
 * Lists all installed tools
 */
export async function listCommand(): Promise<void> {
  logInfo('📋 Installed tools:');
  logNewLine();

  logHeader('Prompts:');
  logListItem('code-review-ts', 'v1.2.0');
  logListItem('api-docs-generator', 'v2.1.0');

  logHeader('Agents:');
  logListItem('test-generator', 'v1.0.0');

  logHeader('Context Packs:');
  logListItem('angular', 'v3.0.0');
  logListItem('nestjs', 'v2.5.0');

  logNewLine();
  logStep('Total: 5 tools installed');
}
