module.exports = {
    'env': {
        'node': true,
        'mocha': true,
        'es6': true
    },
    'parser': 'babel-eslint',
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 6
    },
    'rules': {
        'indent': [2, 4],
        'space-before-function-paren': [1, {
            'anonymous': 'always',
            'named': 'always',
            'asyncArrow': 'always'
        }],
        'keyword-spacing': [1, {
            'before': true,
            'after': true
        }],
        'no-multi-spaces': 2,
        'space-before-blocks': 'error',
        'no-multiple-empty-lines': 1,
        'no-console': 1,
        'no-unused-vars': 1,
        'linebreak-style': [2,'unix'],
        'quotes': [2, 'single'],
        'semi': [2, 'always']
    }
};
