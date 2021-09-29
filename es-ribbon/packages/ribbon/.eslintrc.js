module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb-typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        semi: [
            'error',
            'never',
        ],
        'no-console': 'off',
        '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'import/prefer-default-export': 'off',
        '@typescript-eslint/semi': ['error', 'never'],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'react/prop-types': 0,
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-props-no-spreading': 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
}
