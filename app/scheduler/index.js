/**
 * Scheduler
 */
module.exports = function scheduler(app, options = {}) {
  const cron = require('node-cron')
  const { START_CRON, END_CRON, periodMs, tz, immediate } = options
  // 活动窗口：每天 21:00 开始，次日 09:00 停止
  // 为了更灵活控制，我们使用一个每天在 21:00 触发的 "start" 任务和每天 09:00 触发的 "stop" 任务。

  async function runOnce() {
    console.log('🕘 [scheduler] trigger at', new Date().toISOString())
    try {
      if (
        !app.services ||
        !app.services.processor ||
        typeof app.services.processor.processPending !== 'function'
      ) {
        console.warn(
          '🕘 [scheduler] no processor service found (app.services.processor.processPending)',
        )
        return
      }
      // 计算并发：优先使用 SCHEDULER_CONCURRENCY，若未设置且存在 piscina，则使用 PISCINA_MAX_THREADS（或默认 3）
      const concurrency =
        Number(process.env.SCHEDULER_CONCURRENCY) ||
        (app.piscina ? Number(process.env.PISCINA_MAX_THREADS) || 3 : 3)
      if (app.piscina)
        console.log(
          `🕘 [scheduler] using piscina worker pool, concurrency=${concurrency}`,
        )
      await app.services.processor.processPending({ concurrency })
    } catch (err) {
      console.error('🕘 [scheduler] error during runOnce', err)
    }
  }

  // 在活动窗口中定时触发 runOnce（例如每分钟检查待执行任务），以便在 21:00-09:00 期间持续处理新任务。
  // 这里使用一个简单的 setInterval 来每分钟触发一次处理。

  try {
    // schedule start at 21:00
    const startTask = cron.schedule(
      START_CRON,
      async () => {
        console.log('🕘 [scheduler] start window at', new Date().toISOString())
        // 如果已有 interval，先清除
        if (app._schedulerInterval) clearInterval(app._schedulerInterval)

        // 立即触发一次
        runOnce().catch((e) => console.error(e))

        // 然后每半小时触发一次, 以防止期间间出现新任务
        app._schedulerInterval = setInterval(() => {
          runOnce().catch((e) => console.error(e))
        }, periodMs)
      },
      { scheduled: true, timezone: tz },
    )

    // schedule stop at 09:00
    const stopTask = cron.schedule(
      END_CRON,
      async () => {
        console.log('🕘 [scheduler] stop window at', new Date().toISOString())
        try {
          // 停止 interval
          if (app._schedulerInterval) {
            clearInterval(app._schedulerInterval)
            app._schedulerInterval = null
          }

          // 1) 对于处于 processing 状态的记录，将其回退为 pending（以便下次窗口重新执行）
          if (app.services && app.services.db) {
            // 仅回退 status === 'processing' 的记录
            const rolled = await app.services.db.updateMany(
              'items',
              (it) => it && it.status === 'processing',
              {
                status: 'pending',
                processing_started_at: null,
              },
            )
            console.log(
              `🕘 [scheduler] rolled back ${rolled.length} processing items to pending`,
            )
          }
        } catch (err) {
          console.error('🕘 [scheduler] error during stop handling', err)
        }
      },
      { scheduled: true, timezone: tz },
    )

    console.log(
      `🕘 [scheduler] scheduled start cron=${START_CRON} stop cron=0 0 9 * * * timezone=${tz}`,
    )
    app._schedulerStartTask = startTask
    app._schedulerStopTask = stopTask

    // 测试环境立即运行，可设置环境变量
    if (immediate) {
      runOnce().catch((e) => console.error(e))
      app._schedulerInterval = setInterval(() => {
        runOnce().catch((e) => console.error(e))
      }, periodMs)
    }
  } catch (err) {
    console.error('🕘 [scheduler] failed to schedule cron jobs', err)
  }
}
