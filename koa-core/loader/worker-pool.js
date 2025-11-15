const Piscina = require('piscina')
const path = require('path')

/**
 * 初始化 worker 线程池
 * @param {*} app
 */
module.exports = (app) => {
  const workerFile = path.resolve(app.baseDir, './app/worker/processor-task.js')
  app.piscina = new Piscina({
    filename: workerFile,
    maxThreads: Number(process.env.PISCINA_MAX_THREADS) || 3,
  })
}
