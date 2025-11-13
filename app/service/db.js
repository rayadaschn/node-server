/**
 * 数据库服务基类
 * 提供通用的 CRUD 操作
 */
module.exports = (app) => {
  const BasicService = require('./basic.js')(app)

  return class DbService extends BasicService {
    /**
     * 获取集合中的所有数据
     * @param {string} collection 集合名称
     * @returns {Array} 数据数组
     */
    async findAll(collection) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }
      return app.db.data[collection]
    }

    /**
     * 根据条件查找单条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件（函数或对象）
     * @returns {Object|null} 查找结果
     */
    async findOne(collection, predicate) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      if (typeof predicate === 'function') {
        return app.db.data[collection].find(predicate)
      } else {
        return app.db.data[collection].find((item) =>
          Object.keys(predicate).every((key) => item[key] === predicate[key]),
        )
      }
    }

    /**
     * 根据条件查找多条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件（函数或对象）
     * @returns {Array} 查找结果数组
     */
    async findMany(collection, predicate) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      if (typeof predicate === 'function') {
        return app.db.data[collection].filter(predicate)
      } else {
        return app.db.data[collection].filter((item) =>
          Object.keys(predicate).every((key) => item[key] === predicate[key]),
        )
      }
    }

    /**
     * 新增数据
     * @param {string} collection 集合名称
     * @param {Object|Array} data 新增的数据
     * @returns {Object|Array} 新增后的数据
     */
    async create(collection, data) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      if (Array.isArray(data)) {
        app.db.data[collection].push(...data)
      } else {
        app.db.data[collection].push(data)
      }

      await app.db.write()
      return data
    }

    /**
     * 更新单条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件
     * @param {Object} updates 更新的字段
     * @returns {Object|null} 更新后的数据
     */
    async updateOne(collection, predicate, updates) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      let updated = null

      if (typeof predicate === 'function') {
        app.db.data[collection] = app.db.data[collection].map((item) => {
          if (predicate(item) && !updated) {
            updated = { ...item, ...updates }
            return updated
          }
          return item
        })
      } else {
        app.db.data[collection] = app.db.data[collection].map((item) => {
          const isMatch = Object.keys(predicate).every(
            (key) => item[key] === predicate[key],
          )
          if (isMatch && !updated) {
            updated = { ...item, ...updates }
            return updated
          }
          return item
        })
      }

      if (updated) {
        await app.db.write()
      }

      return updated
    }

    /**
     * 更新多条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件
     * @param {Object} updates 更新的字段
     * @returns {Array} 更新后的数据数组
     */
    async updateMany(collection, predicate, updates) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      const updated = []

      if (typeof predicate === 'function') {
        app.db.data[collection] = app.db.data[collection].map((item) => {
          if (predicate(item)) {
            const updatedItem = { ...item, ...updates }
            updated.push(updatedItem)
            return updatedItem
          }
          return item
        })
      } else {
        app.db.data[collection] = app.db.data[collection].map((item) => {
          const isMatch = Object.keys(predicate).every(
            (key) => item[key] === predicate[key],
          )
          if (isMatch) {
            const updatedItem = { ...item, ...updates }
            updated.push(updatedItem)
            return updatedItem
          }
          return item
        })
      }

      if (updated.length > 0) {
        await app.db.write()
      }

      return updated
    }

    /**
     * 删除单条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件
     * @returns {boolean} 是否删除成功
     */
    async deleteOne(collection, predicate) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      const originalLength = app.db.data[collection].length

      if (typeof predicate === 'function') {
        app.db.data[collection] = app.db.data[collection].filter(
          (item) => !predicate(item),
        )
      } else {
        app.db.data[collection] = app.db.data[collection].filter(
          (item) =>
            !Object.keys(predicate).every(
              (key) => item[key] === predicate[key],
            ),
        )
      }

      const deleted = originalLength > app.db.data[collection].length

      if (deleted) {
        await app.db.write()
      }

      return deleted
    }

    /**
     * 删除多条数据
     * @param {string} collection 集合名称
     * @param {Function|Object} predicate 查找条件
     * @returns {number} 删除的数据条数
     */
    async deleteMany(collection, predicate) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }

      const originalLength = app.db.data[collection].length

      if (typeof predicate === 'function') {
        app.db.data[collection] = app.db.data[collection].filter(
          (item) => !predicate(item),
        )
      } else {
        app.db.data[collection] = app.db.data[collection].filter(
          (item) =>
            !Object.keys(predicate).every(
              (key) => item[key] === predicate[key],
            ),
        )
      }

      const deleteCount = originalLength - app.db.data[collection].length

      if (deleteCount > 0) {
        await app.db.write()
      }

      return deleteCount
    }

    /**
     * 获取集合中的数据数量
     * @param {string} collection 集合名称
     * @returns {number} 数据数量
     */
    async count(collection) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }
      return app.db.data[collection].length
    }

    /**
     * 清空集合中的所有数据
     * @param {string} collection 集合名称
     * @returns {boolean} 是否清空成功
     */
    async clear(collection) {
      if (!app.db.data[collection]) {
        throw new Error(`集合 ${collection} 不存在`)
      }
      app.db.data[collection] = []
      await app.db.write()
      return true
    }

    /**
     * 添加新的集合
     * @param {string} collection 集合名称
     * @returns {boolean} 是否添加成功
     */
    async createCollection(collection) {
      if (app.db.data[collection]) {
        throw new Error(`集合 ${collection} 已存在`)
      }
      app.db.data[collection] = []
      await app.db.write()
      return true
    }
  }
}
