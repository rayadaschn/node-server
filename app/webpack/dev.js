const express = require('express')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

// 从 webpack 配置文件中引入开发环境配置
const {
  webpackDevConfig,
  DEV_SERVER_CONFIG,
} = require('./config/webpack.dev.js')

const app = express()

const compiler = webpack(webpackDevConfig)

// 指定静态文件目录
app.use(express.static(path.join(process.cwd(), './app/public/dist/')))

// 引用 divMiddleware 中间件(监听文件改动)
app.use(
  devMiddleware(compiler, {
    // 落地文件, 否则热更新会报错
    writeToDisk: true,
    publicPath: webpackDevConfig.output.publicPath,
    // header 配置
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    stats: {
      colors: true,
    },
  }),
)

// 引用 hotMiddleware 中间件(实现热更新)
app.use(
  hotMiddleware(compiler, {
    log: false,
    // 心跳时间, 否则热更新会报错
    heartbeat: 2000,
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
  }),
)

console.log('等待 webpack 初次编译完成...')

const port = DEV_SERVER_CONFIG.PORT

app.listen(port, () => {
  console.log(`Server is running on http://${DEV_SERVER_CONFIG.HOST}:${port}`)
})
