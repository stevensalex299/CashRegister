module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    semi: ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', '/uploads'],
  overrides: [
    {
      files: ['server/src/**/*.{ts,js,jsx,tsx}'],
      parserOptions: {
        project: './server/tsconfig.json',
      },
      extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // Server-side specific rules
        'no-console': 'warn',
        'consistent-return': 'off',
      },
    },
    {
      files: ['client/src/**/*.{ts,js,jsx,tsx}'],
      parserOptions: {
        project: './client/tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // Client-side specific rules
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off', // Required for React 17+ with JSX Transform
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
};
