module.exports = (app) => {
  // 进入 service 层
  const BasicService = require('./basic.js')(app)
  return class ProjectService extends BasicService {
    /**
     * 获取项目列表
     * @returns 项目列表
     */
    async getList() {
      return [
        {
          id: 1,
          name: '项目1',
        },
        {
          id: 2,
          name: '项目2',
        },
      ]
    }
  }
}
