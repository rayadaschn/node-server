const path = require('path')
const fs = require('fs')

/**
 * 初始化数据库
 * @param {*} app Koa 应用实例
 */
module.exports = async function initDb(app) {
  // 动态 import（支持 CommonJS）
  const { Low } = await import('lowdb')
  const { JSONFile } = await import('lowdb/node')

  const dbFile = path.resolve(app.baseDir, './db/data.json')
  const dbDir = path.dirname(dbFile)

  // 确保目录存在
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // 如果文件不存在，预先写入空对象 "{}"，防止 JSON.parse 报错
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '{}', 'utf-8')
  }

  const adapter = new JSONFile(dbFile)
  const defaultData = { users: [], projects: [], items: [] }
  const db = new Low(adapter, defaultData)

  try {
    await db.read()
    // 如果解析后没有数据（文件空或损坏），重置为默认值
    if (!db.data || Object.keys(db.data).length === 0) {
      db.data = defaultData
      await db.write()
    }
  } catch (err) {
    console.warn('⚠️ 数据库文件损坏，已重置为默认结构:', err.message)
    db.data = defaultData
    await db.write()
  }

  app.db = db
  console.log('✅ 数据库已初始化，文件路径:', dbFile)
}
