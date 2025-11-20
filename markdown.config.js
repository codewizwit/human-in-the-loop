const { execSync } = require('child_process');

module.exports = {
  transforms: {
    TREE(content, options) {
      // Run pnpm tree and get output
      const tree = execSync('pnpm tree', { encoding: 'utf-8' });
      return tree.trim();
    }
  }
};
