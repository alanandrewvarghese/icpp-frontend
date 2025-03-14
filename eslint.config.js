import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptEslintParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'], // Or '**/*.{js,jsx,ts,tsx}' if you have TypeScript files as well
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    extends: [
      js.configs.recommended,
      reactPlugin.configs.recommended,
      reactHooksPlugin.configs.recommended,
      typescriptEslintPlugin.configs.recommended,
      'prettier', // This might still work, but in flat config, consider using rule based prettier integration
      prettierPlugin.configs.recommended, // This is the explicit way to integrate prettier plugin
    ],
    rules: {
      indent: 'off', // Handled by Prettier
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
