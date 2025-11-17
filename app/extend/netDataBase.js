module.exports = (app) => {
  const { db: netDataBase } = app.config
  if (!netDataBase) {
    return null
  }
  // 挂载数据库连接实例到 app.netDataBase
  console.log('🚀 ~ extend netDataBase is init')
  const knex = require('knex')(netDataBase)
  return knex
}
