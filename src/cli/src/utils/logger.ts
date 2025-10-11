import chalk from 'chalk';

/**
 * Logs a success message with green checkmark
 */
export function logSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Logs an error message with red X
 */
export function logError(message: string): void {
  console.log(chalk.red(`✗ ${message}`));
}

/**
 * Logs an info message with blue icon
 */
export function logInfo(message: string): void {
  console.log(chalk.blue(message));
}

/**
 * Logs a warning message with yellow icon
 */
export function logWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

/**
 * Logs a step in a process with gray text
 */
export function logStep(message: string): void {
  console.log(chalk.gray(`  → ${message}`));
}

/**
 * Logs a tip or helpful hint
 */
export function logTip(message: string): void {
  console.log(chalk.blue('\n💡 Tip: ') + message);
}

/**
 * Logs a section header with white text
 */
export function logHeader(message: string): void {
  console.log(chalk.white(`\n${message}`));
}

/**
 * Logs a list item with green bullet
 */
export function logListItem(message: string, details?: string): void {
  console.log(chalk.green('  • ') + chalk.bold(message) + (details ? chalk.gray(` ${details}`) : ''));
}

/**
 * Logs a numbered item
 */
export function logNumberedItem(number: number, title: string, description: string): void {
  console.log(chalk.green(`${number}. `) + chalk.bold(title));
  console.log(chalk.gray(`   ${description}`));
  console.log(chalk.gray(`   Version: ${description}\n`));
}

/**
 * Logs plain text without styling
 */
export function log(message: string): void {
  console.log(message);
}

/**
 * Logs an empty line for spacing
 */
export function logNewLine(): void {
  console.log();
}
