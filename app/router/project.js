module.exports = (app, router) => {
  const { project: ProjectController } = app.controllers

  // 接口 /project/list 获取项目列表
  router.post(
    '/api/project/list',
    ProjectController.getList.bind(ProjectController),
  )

  router.get(
    '/api/model/list',
    ProjectController.getModelList.bind(ProjectController),
  )
}
