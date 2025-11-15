const path = require('path')
/**
 * Scheduler loader
 * 配置定时任务
 */
module.exports = function schedulerLoader(app) {
  const schedulerDir = path.join(app.businessPath, 'scheduler/index.js')
  const START_CRON = process.env.SCHEDULER_START_CRON || '0 0 21 * * *' // 秒 分 时 日 月 周 -> 每天 21:00:00
  const END_CRON = process.env.SCHEDULER_END_CRON || '0 0 9 * * *' // 每天 09:00:00
  const periodMs = Number(process.env.SCHEDULER_PERIOD_MS) || 30 * 60 * 1000

  const options = {
    START_CRON,
    END_CRON,
    periodMs,
    tz: process.env.SCHEDULER_TZ || 'Asia/Shanghai',
    immediate: process.env.SCHEDULER_IMMEDIATE === '1',
  }

  const scheduler = require(schedulerDir)
  // 初始化调度器
  scheduler(app, options)
}
