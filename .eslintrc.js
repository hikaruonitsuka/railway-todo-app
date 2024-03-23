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
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off', // import Reactの記述を強制にしない
  },
  settings: {
    react: {
      version: 'detect', // Reactのバージョンを明記（この場合自動検出する）
    },
  },
};
