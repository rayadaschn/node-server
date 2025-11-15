const Piscina = require('piscina')
const path = require('path')

/**
 * 应用扩展: 挂载 Piscina 线程池到 app.piscina
 * @param {*} app Koa 实例
 */
module.exports = (app) => {
  const workerFile = path.resolve(
    app.baseDir,
    './app/scheduler/processor-task.js',
  )
  const pool = new Piscina({
    filename: workerFile,
    maxThreads: Number(process.env.PISCINA_MAX_THREADS) || 3,
  })

  // 返回实例，extend loader 会把返回值赋给 app.piscina
  return pool
}
