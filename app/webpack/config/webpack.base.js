const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // 入口配置
  entry: {
    'entry.page1': './app/pages/page1/entry.page1.js',
    'entry.page2': './app/pages/page2/entry.page2.js',
  },
  // 输出配置
  output: {
    path: path.join(process.cwd(), './app/public/dist/prod'),
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    publicPath: '/dist/prod/',
    crossOriginLoading: 'anonymous',
  },
  // 定义「Webpack 如何处理匹配到的文件」
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        include: [path.resolve(process.cwd(), './app/pages')],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  // 定义「Webpack 如何解析模块路径」
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.less', '.css'],
    alias: {
      '@': path.resolve(process.cwd(), './app/pages'),
    },
  },
  // 插件
  plugins: [
    // 处理 Vue 单文件组件, 作用是将配置的规则分别应用到 Vue 单文件组件的不同部分
    // 如 <template>, <script>, <style> 等部分
    new VueLoaderPlugin(),
    // 把第三方库暴露到 window 上，方便在浏览器中直接访问
    new webpack.ProvidePlugin({
      Vue: 'vue',
    }),
    // 定义全局变量, 这里会直接替换代码中的变量. 写成字符串的形式是因为 vue 此前是读取 env 变量的, 而 env 变量只能是字符串
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true', // 开启 Vue 解析 options API
      __VUE_PROD_DEVTOOLS__: 'false', // 关闭 Vue 生产环境下的 devtools
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 关闭 Vue 生产环境下的 hydration 不匹配详情
    }),
    // 构建最终渲染的页面
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './app/view/entry.html'), // 模板文件路径
      filename: path.resolve(
        process.cwd(),
        './app/public/dist/',
        'entry.page1.html',
      ), // 输出的文件名
      chunks: ['entry.page1'], // 要注入的代码块
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './app/view/entry.html'), // 模板文件路径
      filename: path.resolve(
        process.cwd(),
        './app/public/dist/',
        'entry.page2.html',
      ), // 输出的文件名
      chunks: ['entry.page2'], // 要注入的代码块
    }),
  ],
  // 打包优化策略
  optimization: {},
}
