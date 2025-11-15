module.exports = (app) => {
  // 进入 service 层
  return class BasicService {
    constructor() {
      // 保留对 app 的引用
      this.app = app

      // 使用 getter 保证在 service loader 完成挂载后也能读取到最新的 app.config / app.services
      Object.defineProperty(this, 'config', {
        enumerable: true,
        configurable: false,
        get() {
          return app.config
        },
      })

      Object.defineProperty(this, 'services', {
        enumerable: true,
        configurable: false,
        get() {
          return app.services
        },
      })
    }
  }
}
