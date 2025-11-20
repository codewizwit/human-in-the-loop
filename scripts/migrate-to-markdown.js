#!/usr/bin/env node

/**
 * Migrates prompt.yaml files to prompt.md files with frontmatter
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Recursively find all prompt.yaml files
function findPromptFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findPromptFiles(fullPath, files);
    } else if (entry.name === 'prompt.yaml') {
      files.push(fullPath);
    }
  }

  return files;
}

const rootDir = path.join(__dirname, '..', 'lib', 'prompts');
const promptFiles = findPromptFiles(rootDir);

console.log(`Found ${promptFiles.length} prompt files to migrate\n`);

for (const yamlFilePath of promptFiles) {
  try {
    console.log(`Migrating: ${path.relative(process.cwd(), yamlFilePath)}`);

    // Read and parse YAML
    const yamlContent = fs.readFileSync(yamlFilePath, 'utf-8');
    const promptData = yaml.parse(yamlContent);

    // Extract template and metadata
    const { template, ...metadata } = promptData;

    if (!template) {
      console.log(`  ⚠️  No template found, skipping`);
      continue;
    }

    // Build markdown with frontmatter
    const frontmatter = yaml.stringify(metadata);
    const markdownContent = `---\n${frontmatter}---\n\n${template}`;

    // Write to prompt.md in the same directory
    const mdFilePath = yamlFilePath.replace('prompt.yaml', 'prompt.md');
    fs.writeFileSync(mdFilePath, markdownContent, 'utf-8');

    console.log(`  ✓ Created: ${path.basename(mdFilePath)}`);

    // Optionally delete the YAML file (commented out for safety)
    // fs.unlinkSync(yamlFilePath);
    // console.log(`  ✓ Deleted: ${path.basename(yamlFilePath)}`);
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
  }

  console.log('');
}

console.log('Migration complete!');
console.log('\nNext steps:');
console.log('1. Review the generated prompt.md files');
console.log('2. Update lib-scanner.ts to read .md files');
console.log('3. Delete prompt.yaml files when ready');
