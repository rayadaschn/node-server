/**
 * 数据库相关路由示例
 */
module.exports = (app, router) => {
  const dbController = app.controllers.db

  router.post('/api/users', dbController.createUser.bind(dbController)) // 创建用户
  router.get('/api/users', dbController.getAllUsers.bind(dbController)) // 获取所有用户
  router.get('/api/users/:id', dbController.getUserById.bind(dbController)) // 根据 ID 获取用户
  router.put('/api/users/:id', dbController.updateUser.bind(dbController)) // 更新用户
  router.delete('/api/users/:id', dbController.deleteUser.bind(dbController)) // 删除用户
  router.get('/api/users/search', dbController.searchUsers.bind(dbController)) // 搜索用户
  router.get('/api/users/count', dbController.getUserCount.bind(dbController)) // 获取用户总数
}
