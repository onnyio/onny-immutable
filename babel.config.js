/* eslint-disable no-var, no-template-curly-in-string */
module.exports = function babelConfig(api) {
  var presets = [
    '@babel/preset-env',
    [
      'minify',
      {
        mangle: {
          exclude: [
            'srcState',
            'loc',
            'locArray',
            'value',
            'values',
            'func',
            'Mutations',
            'MutationInstance',
            'fn',
            'indices',
            'funcWithMutations',
            'mutationState'
          ],
        }
      }
    ]
  ];

  var plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from'
  ];

  // https://babeljs.io/docs/en/next/config-files#apicache
  api.cache.never();
  return {
    presets,
    plugins,
    env: {
      test: {
        plugins: [
          'babel-plugin-istanbul'
        ]
      }
    }
  };
};
