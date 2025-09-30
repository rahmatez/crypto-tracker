import eslintConfigNext from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...eslintConfigNext,
  {
    ignores: ['node_modules', '.next', 'playwright-report', 'coverage']
  },
  {
    rules: {
      ...prettier.rules
    }
  }
];

export default config;
