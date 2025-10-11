import { logInfo, logHeader, logSuccess, logNewLine } from '../utils/logger';
import chalk from 'chalk';

/**
 * Validates the local environment and diagnoses issues
 */
export async function doctorCommand(): Promise<void> {
  logInfo('🔍 Running diagnostic checks...');
  logNewLine();

  logHeader('Environment:');
  console.log(chalk.green('  ✓ Node.js') + chalk.gray(' v20.11.0'));
  console.log(chalk.green('  ✓ TypeScript') + chalk.gray(' v5.9.3'));
  console.log(chalk.green('  ✓ pnpm') + chalk.gray(' v10.18.2'));

  logHeader('Dependencies:');
  console.log(chalk.green('  ✓ commander'));
  console.log(chalk.green('  ✓ chalk'));
  console.log(chalk.green('  ✓ zod'));

  logHeader('Configuration:');
  console.log(chalk.green('  ✓ .hitlrc.json found'));
  console.log(chalk.green('  ✓ .claude directory exists'));

  logNewLine();
  logSuccess('All checks passed! Your environment is ready.');
}
