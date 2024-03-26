module.exports = {
  env: {
    node: true, // Node.jsのグローバル変数を利用できるようにする（processなど）
    browser: true,
    es2021: true,
    jest: true, // jestを利用できるようにする
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect', // Reactのバージョンを明記（この場合自動検出する）
    },
  },
  plugins: ['react', 'import', 'unused-imports'],
  rules: {
    'react/react-in-jsx-scope': 'off', // import Reactの記述を強制にしない
    'unused-imports/no-unused-imports': 'error', // 利用していないimportを削除する
    'import/order': [
      // importの順番を整列
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never', // 要素ごとに余白を設けない
        alphabetize: { order: 'asc' },
        pathGroupsExcludedImportTypes: ['react'],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: 'react*', group: 'builtin', position: 'before' },
          {
            pattern: '{.,..}/**/*.scss',
            group: 'index',
            position: 'after',
          },
        ],
        warnOnUnassignedImports: true, // scss importで順序が間違っている場合警告を出す
      },
    ],
  },
};
