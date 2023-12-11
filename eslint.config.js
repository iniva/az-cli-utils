import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tsEslintParser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)))

export default [
  tsEslintPlugin.configs.recommended,
  prettierPlugin.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      tsEslintPlugin,
    },
    rules: {
      'tsEslintPlugin/no-unused-vars': 'error',
      'tsEslintPlugin/no-explicit-any': 'off',
      'tsEslintPlugin/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }]
    },
  }
]
