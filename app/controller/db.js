/**
 * 数据库操作示例 Controller
 * 展示如何进行 CRUD 操作
 */
module.exports = (app) => {
  const BaseController = require('./basic.js')(app)

  return class DbController extends BaseController {
    /**
     * 获取所有用户
     */
    async getAllUsers(ctx) {
      try {
        const { db: DbService } = app.services
        const users = await DbService.findAll('users')
        app.logger.info('获取所有用户', users)
        this.success(ctx, users)
      } catch (error) {
        app.logger.error('获取所有用户失败', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 根据 ID 获取用户
     */
    async getUserById(ctx) {
      try {
        // 获取请求 query 参数
        const { keyword } = ctx.query
        const { db: DbService } = app.services
        const user = await DbService.findOne('users', { name: keyword })

        if (!user) {
          ctx.status = 404
          return this.fail(ctx, '用户不存在')
        }

        app.logger.info('获取用户成功', user)
        this.success(ctx, user)
      } catch (error) {
        app.logger.error('获取用户失败', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 创建用户
     */
    async createUser(ctx) {
      try {
        const { name, email, age } = ctx.request.body
        const { db: DbService } = app.services

        if (!name || !email) {
          ctx.status = 400
          return this.fail(ctx, '用户名和邮箱不能为空')
        }

        // 生成 ID（简单实现）
        const users = await DbService.findAll('users')
        const newId =
          users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

        const newUser = {
          id: newId,
          name,
          email,
          age: age || 0,
          createdAt: new Date().toISOString(),
        }

        await DbService.create('users', newUser)
        app.logger.info('创建用户成功', newUser)
        ctx.status = 201
        this.success(ctx, newUser)
      } catch (error) {
        app.logger.error('创建用户失败', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 更新用户
     */
    async updateUser(ctx) {
      try {
        const { id } = ctx.params
        const updates = ctx.request.body
        const { db: DbService } = app.services

        const updatedUser = await DbService.updateOne(
          'users',
          { id: parseInt(id) },
          {
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        )

        if (!updatedUser) {
          ctx.status = 404
          return this.fail(ctx, '用户不存在')
        }

        app.logger.info('更新用户成功', updatedUser)
        this.success(ctx, updatedUser)
      } catch (error) {
        app.logger.error('更新用户失败', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 删除用户
     */
    async deleteUser(ctx) {
      try {
        const { id } = ctx.params
        const { db: DbService } = app.services

        const deleted = await DbService.deleteOne('users', { id: parseInt(id) })

        if (!deleted) {
          ctx.status = 404
          return this.fail(ctx, '用户不存在')
        }

        app.logger.info('删除用户成功')
        this.success(ctx, { message: '用户已删除' })
      } catch (error) {
        app.logger.error('删除用户失败', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 搜索用户（根据名称）
     */
    async searchUsers(ctx) {
      try {
        const { keyword } = ctx.query
        const { db: DbService } = app.services

        if (!keyword) {
          ctx.status = 400
          return this.fail(ctx, '搜索关键词不能为空')
        }

        const results = await DbService.findMany(
          'users',
          (user) => user.name.includes(keyword) || user.email.includes(keyword),
        )

        app.logger.info('搜索用户成功', results)
        this.success(ctx, results)
      } catch (error) {
        app.logger.error('搜索用户失败', error)
        this.fail(ctx, error.message)
      }
    } /**
     * 获取用户总数
     */
    async getUserCount(ctx) {
      try {
        const { db: DbService } = app.services
        const count = await DbService.count('users')

        app.logger.info('获取用户总数', count)
        this.success(ctx, { count })
      } catch (error) {
        app.logger.error('获取用户总数失败', error)
        this.fail(ctx, error.message)
      }
    }
  }
}
