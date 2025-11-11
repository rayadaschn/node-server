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
      // 打印日志
      app.logger.info('获取项目列表', projectList)
      // 返回结果
      this.success(ctx, projectList)
    }

    async getModelList(ctx) {
      // 进入 service 层
      const { project: ProjectService } = app.services
      const modelList = await ProjectService.getModelList()

      // 构造 model 数据
      const dtoModelList = modelList.reduce((preList, item) => {
        const { model, project } = item
        const { key, name, desc } = model
        const dtoModel = { key, name, desc }

        // 构造 project 数据
        const dtoProject = Object.keys(project).reduce((preProj, projKey) => {
          const { key, name, desc, homePage } = project[projKey]
          preProj[projKey] = { key, name, desc, homePage }
          return preProj
        }, {})

        preList.push({ model: dtoModel, project: dtoProject })
        return preList
      }, [])

      // 返回结果
      this.success(ctx, dtoModelList)
    }
  }
}
