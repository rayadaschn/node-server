const path = require('path')
const os = require('os')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.base.js')

const prodConfig = {
  mode: 'production',

  output: {
    path: path.resolve(process.cwd(), './app/public/dist/prod'),
    filename: 'js/[name].[chunkhash:8].bundle.js',
    publicPath: '/dist/prod/',
    crossOriginLoading: 'anonymous',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), './app/pages')],
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: { workers: os.cpus().length },
          },
          'babel-loader',
        ],
      },
    ],
  },

  performance: {
    hints: false,
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: { compress: { drop_console: true } },
      }),
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*'], // 清理 output.path 下所有文件
      cleanStaleWebpackAssets: true, // 清理未使用的 webpack 输出文件
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].bundle.css',
    }),
  ],
}

module.exports = merge(baseConfig, prodConfig)
