import js from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/', 'cypress/downloads/'],
  },
  js.configs.recommended,
  pluginCypress.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];
