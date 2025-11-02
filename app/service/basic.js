module.exports = (app) => {
  // 进入 service 层
  return class BasicService {
    constructor() {
      this.app = app
      this.config = app.config
      this.services = app.services
    }
  }
}
