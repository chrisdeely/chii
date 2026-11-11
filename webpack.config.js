const path = require('path');

const chobitsuEntry = require.resolve('chobitsu');
const chobitsuCommonJsEntry = path.join(
  path.dirname(chobitsuEntry),
  'cjs/index.js'
);

module.exports = (_env, argv) => {
  const config = {
    target: ['web', 'es5'],
    entry: {
      index: './src/index.ts',
      target: {
        import: './src/target.ts',
        library: {
          name: 'chii',
          type: 'umd',
        },
      },
    },
    devtool: 'inline-source-map',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public'),
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
        {
          test: /\.svg$/,
          loader: 'svg-url-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  };

  const noPolyfillConfig = {
    ...config,
    name: 'target-nopoly',
    entry: {
      'target-nopoly': {
        import: './src/target.ts',
        library: {
          name: 'chii',
          type: 'umd',
        },
      },
    },
    resolve: {
      ...config.resolve,
      alias: {
        // The default entry is a prebuilt bundle with core-js embedded. Use the
        // CommonJS build so webpack can remove chobitsu's global polyfill imports.
        'chobitsu$': chobitsuCommonJsEntry,
        'core-js/stable/object/assign$': false,
        'core-js/stable/promise$': false,
        'core-js/modules/es.map$': false,
      },
    },
  };

  if (argv.mode === 'production') {
    delete config.devtool;
    delete noPolyfillConfig.devtool;
  }

  return [config, noPolyfillConfig];
};
