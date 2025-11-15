/**
 * worker 文件要导出一个可被调用的函数 自测模拟
 * @param {*} param0.record 要处理的记录
 * @returns {Promise<{ ok: boolean, result?: any, error?: string }>} 处理结果
 */
// Piscina worker task: receives a record object directly
module.exports = async function processorTask(record) {
  // 这里执行“外部调用/CPU 逻辑”，不要直接操作 lowdb 文件（可能存在线程安全问题）
  // 模拟延迟与失败
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 800))
  const ok = Math.random() > 0.15
  if (!ok) throw new Error('simulated external failure')
  return { ok: true, result: { id: record.id } }
}
