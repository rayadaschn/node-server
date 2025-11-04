const log4js = require('log4js')

/**
 * 日志工具
 * 外部调用 app.logger.info app.logger.error
 * @param {*} app Koa 应用实例
 */
module.exports = (app) => {
  let logger

  if (app.env.isLocal()) {
    // 打印在控制台
    logger = console
  } else {
    // 打印在文件
    log4js.configure({
      appenders: {
        console: { type: 'console' }, // 打印在控制台
        dateFile: {
          // 日期文件
          type: 'dateFile',
          filename: 'logs/app.log',
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
        },
      },
      // 日志分类
      categories: {
        default: {
          appenders: ['console', 'dateFile'], // 打印在控制台和文件
          level: 'trace', // 打印 trace 及以上级别的日志, trace > debug > info > warn > error
        },
      },
    })
    logger = log4js.getLogger()
  }

  return logger
}
