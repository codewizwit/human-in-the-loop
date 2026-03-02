#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { searchCommand } from './commands/search';
import { installCommand } from './commands/install';
import { updateCommand } from './commands/update';
import { doctorCommand } from './commands/doctor';
import { contributeCommand } from './commands/contribute';
import { statsCommand } from './commands/stats';
import { listCommand } from './commands/list';

const program = new Command();

const packageJsonPath = join(__dirname, '../../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  version: string;
};

program
  .name('hit')
  .description('🌭 Human in the Loop - AI Productivity Toolkit')
  .version(packageJson.version);

program
  .command('search')
  .description('Search for prompts and agents')
  .argument('[query]', 'Search query')
  .action(searchCommand);

program
  .command('install')
  .description('Install a skill or prompt')
  .argument('[skill-id]', 'Skill identifier (e.g., code-review-ts)')
  .option('-p, --path <path>', 'Custom installation path')
  .option(
    '-d, --destination <dest>',
    'Destination: global-skill, project-skill, global-command, project-command'
  )
  .option(
    '--no-claude-command',
    'Skip creating Claude Code slash command (legacy)'
  )
  .action(installCommand);

program
  .command('list')
  .description('List all installed tools')
  .action(listCommand);

program
  .command('update')
  .description('Update CLI to latest version (includes all bundled tools)')
  .action(updateCommand);

program
  .command('doctor')
  .description('Validate local setup and diagnose issues')
  .action(doctorCommand);

program
  .command('contribute')
  .description('Submit a new tool for review')
  .argument('<type>', 'Tool type (prompt, agent, context)')
  .argument('<path>', 'Path to tool definition')
  .action(contributeCommand);

program
  .command('stats')
  .description('View usage analytics and metrics')
  .option('--tool <tool>', 'Show stats for specific tool')
  .action(statsCommand);

program.parse();
