const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

// 基类配置
const baseConfig = require('./webpack.base.js')

// devServer 配置
const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '__webpack_hmr', // 热更新路径, 不要以 `/` 开头，避免重复斜杠导致 client 与 middleware 路径不匹配
  TIMEOUT: 20000, // 超时时间, 单位毫秒
}

// 开发阶段的 entry 配置需要加入热更新模块
Object.keys(baseConfig.entry).forEach((key) => {
  // 第三方包不作为热更新入口
  if (key !== 'vendor') {
    baseConfig.entry[key] = [
      // 入口文件
      baseConfig.entry[key],
      // hmr 更新入口, 官方指定 hmr 路径, 这个是传统开发中让浏览器与 dev server 保持通信的路径
      // `webpack-dev-server/client?http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}`,
      // 这个是浏览器端通过 EventSource (SSE) 与中间件通信
      // 把完整 HMR 地址放到 `path=` 参数中，确保 client 能正确解析并连接到指定 host:port
      `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}`,
    ]
  }
})

// 开发环境配置
const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(process.cwd(), './app/public/dist/dev'),
    compress: true,
    port: 3000,
    hot: true,
    open: true,
  },
  output: {
    path: path.resolve(process.cwd(), './app/public/dist/dev/'),
    filename: 'js/[name].[chunkhash:8].bundle.js',
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`,
    crossOriginLoading: 'anonymous',
    globalObject: 'this',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      multiStep: true, // 多步热更新, 官方推荐开启
    }),
  ],
}

// 开发环境配置
const webpackDevConfig = merge(baseConfig, devConfig)

module.exports = {
  webpackDevConfig,
  // devServer 配置
  DEV_SERVER_CONFIG,
}
