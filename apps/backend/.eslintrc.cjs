module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  extends: [
    'shared',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    'node': true
  },
  ignorePatterns: ['node_modules/', 'dist/']
}
