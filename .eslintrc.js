module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
	  'plugin:prettier/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 1,
    'no-undef': 1,
    'no-var': 'error',
    'no-trailing-spaces': 2, // 禁用行尾空白
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-irregular-whitespace': 2,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1,
      },
    ],
    'eol-last': ['error', 'always'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    // https://eslint.org/docs/rules/prefer-const
    'prefer-const': 2,
    camelcase: ['error', { properties: 'never' }],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        outerIIFEBody: 1,
        VariableDeclarator: 'first',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
      },
    ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/semi': ['error', 'always'],
    // vue
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/no-unused-components': 1,
    'vue/no-mutating-props': 0,
    'vue/script-setup-uses-vars': 'error',
    'vue/v-on-event-hyphenation': [
      'warn',
      'always',
      {
        autofix: true,
      },
    ],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/html-quotes': [
      'error',
      'double',
      {
        avoidEscape: false,
      },
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
      },
    ],
    'vue/max-len': [
      'warn',
      {
        code: 120,
        template: 300,
      },
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 6,
        },
        multiline: {
          max: 3,
        },
      },
    ],
  },
  // https://github.com/vuejs/eslint-plugin-vue/issues/1355
  overrides: [
    {
      files: ['*.html'],
      processor: 'vue/.vue',
    },
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
};
