import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      'prefer-arrow-callback': ['error'],
      'trailing-comma': ['error'],
    },
  }),
];

export default eslintConfig;
