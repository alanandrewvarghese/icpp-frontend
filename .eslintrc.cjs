module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Enable Node.js globals (if you use any in your frontend build scripts)
    jest: true, // If you plan to use Jest for testing
  },
  extends: [
    'eslint:recommended', // Recommended ESLint rules
    'plugin:react/recommended', // Recommended React rules
    'plugin:react-hooks/recommended', // Recommended React Hooks rules
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules (even for JS projects, helpful for parsing)
    'prettier', // Make Prettier take precedence
    'plugin:prettier/recommended', // Integrate Prettier as an ESLint plugin
  ],
  parser: '@typescript-eslint/parser', // Use TypeScript parser for better JS/TS support
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    // Add any custom ESLint rules here if needed
    indent: 'off', // Handled by Prettier
    quotes: ['error', 'single', { avoidEscape: true }], // Enforce single quotes
    semi: ['error', 'never'], // Enforce no semicolons
    'no-unused-vars': 'warn', // Warn about unused variables (you can change to 'error' for stricter enforcement)
    'no-console': 'warn', // Warn about console.log statements (you can change to 'error' for production)
    'react/prop-types': 'off', // We often use TypeScript or other methods for prop validation, can turn off if needed
    'react/react-in-jsx-scope': 'off', // Not needed with modern React versions
    'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies in useEffect/useCallback
    'prettier/prettier': 'error', // Treat Prettier formatting issues as errors
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
}
