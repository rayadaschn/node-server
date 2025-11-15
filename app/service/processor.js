/**
 * Processor service
 * 负责扫描 DB 中待处理的记录并发处理（并发数可配置）。
 * 依赖已有的 db service（app.services.db）提供的 CRUD 接口。
 */
module.exports = (app) => {
  const BasicService = require('./basic.js')(app)

  // 简单并发限制实现（无额外依赖）
  function mapLimit(list, limit, iterator) {
    return new Promise((resolve) => {
      const results = new Array(list.length)
      let i = 0
      let active = 0

      function next() {
        if (i >= list.length && active === 0) {
          return resolve(results)
        }
        while (active < limit && i < list.length) {
          const idx = i++
          active++
          Promise.resolve()
            .then(() => iterator(list[idx]))
            .then((res) => {
              results[idx] = res
            })
            .catch((err) => {
              results[idx] = { error: err }
            })
            .finally(() => {
              active--
              next()
            })
        }
      }

      next()
    })
  }

  return class ProcessorService extends BasicService {
    constructor() {
      super()
    }

    // 处理单条记录
    async processRecord(record) {
      // 幂等性：使用 record.id 或 record.idempotency_key
      // 这里以模拟第三方调用为例；在生产替换为真实请求（axios/fetch）
      try {
        console.log(`[processor] processing id=${record.id}`)

        // 把耗时/不稳定的外部调用逻辑交给 worker
        // 注意：并发限制由上层 mapLimit (processPending) 控制；
        // piscina 负责将单个任务移出主线程执行，且自身有 maxThreads 控制真实线程数。
        await this.app.piscina.run(record)

        // 成功：更新记录为 done
        // 为了支持在停止窗口时把 processing 状态回退为 pending（从而中断执行），
        // 这里仅在 processing_started_at 未被变更的情况下写入 done，避免正在执行的 worker
        // 在 stop 时被外部回退后仍改写数据库（导致状态不一致）。
        const startAt = record.processing_started_at
        await this.services.db.updateOne(
          'items',
          (it) =>
            it.id === record.id &&
            it.processing_started_at === startAt &&
            it.status !== 'done',
          {
            status: 'done',
            processed_at: new Date().toISOString(),
            last_error: null,
          },
        )
        return { id: record.id, ok: true }
      } catch (err) {
        // 失败：增加 attempts，写入 last_error
        const prevAttempts = record.attempts || 0
        const updates = {
          attempts: prevAttempts + 1,
          last_error: String(err.message || err),
          status: prevAttempts + 1 >= 3 ? 'failed' : 'pending',
        }
        // 失败时也要确保仅对当前 processing session 生效（processing_started_at 未被外部回退）
        const startAt = record.processing_started_at
        await this.services.db.updateOne(
          'items',
          (it) => it.id === record.id && it.processing_started_at === startAt,
          updates,
        )
        return { id: record.id, ok: false, error: updates.last_error }
      }
    }

    // 批量查询并行处理
    async processPending({ concurrency = 3, limit = 100 } = {}) {
      // 查询待处理项：约定 collection 为 'items', status==='pending' 且 next_run_at <= now
      const now = new Date()
      const candidates = await this.services.db.findMany('items', (it) => {
        if (!it) return false
        return !it.status || it.status === 'pending'
      })
      if (!candidates || candidates.length === 0) {
        console.log('[processor] no pending items')
        return { total: 0 }
      }

      const slice = candidates.slice(0, limit)

      // 先尝试把每条记录乐观改为 processing，防止重复并发（updateOne 会返回更新后的对象或 null）
      const reserved = []
      for (const it of slice) {
        try {
          const updated = await this.services.db.updateOne(
            'items',
            (row) =>
              row.id === it.id &&
              (row.status === undefined || row.status === 'pending'),
            {
              status: 'processing',
              processing_started_at: new Date().toISOString(),
            },
          )
          if (updated) reserved.push(updated)
        } catch (e) {
          console.warn('[processor] reserve failed', it.id, e.message)
        }
      }

      if (reserved.length === 0) {
        console.log('[processor] no items reserved for processing')
        return { total: 0 }
      }

      // 并发执行 processRecord
      const results = await mapLimit(reserved, concurrency, async (rec) => {
        return this.processRecord(rec)
      })

      console.log(`[processor] finished batch total=${reserved.length}`)
      return { total: reserved.length, results }
    }
  }
}
