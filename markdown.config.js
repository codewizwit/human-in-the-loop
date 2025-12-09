const { execSync } = require('child_process');

module.exports = {
  matchWord: 'docs',
  files: ['README.md', 'docs/**/*.md'],
  transforms: {
    TREE(content, options) {
      // Run tree-node-cli directly to avoid pnpm header
      const tree = execSync(
        'npx tree-node-cli -L 3 --dirs-first -I "node_modules|dist|.git|.nx|tmp|coverage"',
        { encoding: 'utf-8' }
      );
      return '```\n' + tree.trim() + '\n```';
    },
  },
};
