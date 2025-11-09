const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob')

// 入口批量配置
const entryEntries = {}
const htmlWebpackPluginEntries = []
// 获取 app/pages 目录下的所有 entry.*.js 文件
const entryFiles = glob.sync(
  path.resolve(process.cwd(), './app/pages/**/entry.*.js'),
)

entryFiles.forEach((entryFile) => {
  const entryName = path.basename(entryFile, '.js')
  entryEntries[entryName] = entryFile

  htmlWebpackPluginEntries.push(
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './app/view/entry.html'), // 模板文件路径
      filename: path.resolve(
        process.cwd(),
        './app/public/dist/',
        `${entryName}.html`,
      ), // 输出的文件名
      chunks: [entryName], // 要注入的代码块
    }),
  )
})

module.exports = {
  // 入口配置
  // entry: {
  //   'entry.page1': './app/pages/page1/entry.page1.js',
  //   'entry.page2': './app/pages/page2/entry.page2.js',
  // },
  entry: entryEntries,
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
    // 定义模块路径解析时的文件扩展名
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
    ...htmlWebpackPluginEntries,
  ],
  // 打包优化策略, 配置打包输出优化，如代码分割、压缩等
  optimization: {
    /**
     * 把 js 文件打包成 3 种文件:
     * 1. 入口文件: 不用页面 entry 里的业务代码, 会经常变化, 所以单独打包
     * 2. 公共文件: 多个页面都引用的代码, 改动不频繁, 所以单独打包
     * 3. vendor 文件: 第三方库, 因为第三方库不会经常变化, 所以单独打包
     */
    splitChunks: {
      chunks: 'all', // 对所有类型的 chunk 都进行代码分割
      maxAsyncRequests: 30, // 最大的异步请求数量
      maxInitialRequests: 30, // 入口节点的最大请求并发数量
      cacheGroups: {
        // 缓存组, 用于配置不同类型的 chunk 如何进行代码分割
        vendor: {
          // 第三方库缓存组
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 目录下的模块
          name: 'vendor', // 打包后的文件名
          priority: -10, // 优先级, 数字越大, 优先级越高
        },
        common: {
          // 公共文件缓存组
          name: 'common', // 打包后的文件名
          minSize: 0, // 最小打包体积, 0 表示不限制
          minChunks: 2, // 最小引用次数, 超过 2 次的模块才会被打包到 common 文件中
          priority: -20, // 优先级, 数字越大, 优先级越高
          reuseExistingChunk: true, // 复用已存在的 chunk, 避免重复打包
        },
      },
    },
  },
}
