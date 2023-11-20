const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  merge
} = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    process.env.BUNDLE_ANALYZE && new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          filter: (filepath) => !filepath.endsWith('.html'),
          noErrorOnMissing: true
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ].filter(Boolean),
  output: {
    filename: '[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        },
        common: {
          name: 'common',
          test: /[\\/]src[\\/]/,
          chunks: 'all',
          minSize: 0
        }
      }
    },
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
});
