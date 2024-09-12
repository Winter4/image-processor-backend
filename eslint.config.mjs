import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{files: ['**/*.{js,msj,ts}']},
	{languageOptions: {globals: globals.node}},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,

	{
		rules: {
			'indent': ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'no-trailing-spaces': 'error',
			'padded-blocks': ['error', 'never'],
			'eol-last': ['error', 'always'],
			'no-multiple-empty-lines': ['error', {'max': 2, 'maxEOF': 0}],
			'object-curly-spacing': ['error', 'never'],
			'object-shorthand': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'keyword-spacing': ['error', {
				'overrides': {
					'if': {'after': false},
					'for': {'after': false},
					'while': {'after': false},
					'static': {'after': false},
					'as': {'after': false}
				}
			}],
			'arrow-parens': ['error', 'as-needed'],
			'arrow-body-style': ['error', 'as-needed'],
			'no-console': 'error'
		}
	},
	{
		// https://eslint.org/docs/latest/use/configure/ignore
		ignores: [
			// only ignore node_modules in the same directory as the configuration file
			'node_modules',
			// so you have to add `**/` pattern to include nested directories (for example if you use pnpm workspace)
			'**/node_modules',
			'compiled'
		]
	}
];
