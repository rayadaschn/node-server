const webpack = require('webpack')
const webBaseConfig = require('./config/webpack.prod.js')

console.log('\nbegin building...\n')

webpack(webBaseConfig, (err, stats) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    return
  }

  console.log(
    stats.toString({
      colors: true,
    }),
  )
  process.stdout.write(
    `${stats.toString({
      colors: true, // 开启颜色输出
      modules: false, // 不显示模块信息
      chunks: false, // 不显示每个代码块的信息
      children: false, // 不显示子模块信息
      chunkModules: true, // 显示每个代码块包含的模块信息
    })}`,
  )
})
