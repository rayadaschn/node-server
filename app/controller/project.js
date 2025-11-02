module.exports = (app) => {
  // 进入 controller 层
  const BaseController = require('./basic.js')(app)
  return class ProjectController extends BaseController {
    /**
     * 获取项目列表
     * @param {*} ctx 上下文对象
     */
    async getList(ctx) {
      // 进入 service 层
      const { project: ProjectService } = app.services
      const projectList = await ProjectService.getList()
      // 返回结果
      this.success(ctx, projectList)
    }
  }
}
