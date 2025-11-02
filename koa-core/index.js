const Koa = require('koa')
const path = require('path')
const { sep } = path // 路径分隔符

// 环境变量
const env = require('./env')

// 引入 loader
const configLoader = require('./loader/config')
const controllerLoader = require('./loader/controller')
const extendLoader = require('./loader/extend')
const middlewareLoader = require('./loader/middleware')
const routerSchemaLoader = require('./loader/router-schema')
const routerLoader = require('./loader/router')
const serviceLoader = require('./loader/service')

module.exports = {
  start(options = {}) {
    const app = new Koa()

    // 应用配置
    app.options = {
      ...app.options,
      ...options,
    }

    // 基础路径
    app.baseDir = app.options.baseDir || process.cwd()

    // 业务路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`)
    console.log('🚀 ~ start ~ app.businessPath :', app.businessPath)
    // 环境变量
    app.env = env(app)
    console.log('🚀 ~ start ~ app.env:', app.env.getEnv())

    // 加载配置
    configLoader(app)

    // 加载控制器
    controllerLoader(app)

    // 加载扩展
    extendLoader(app)

    // 加载中间件
    middlewareLoader(app)

    // 加载路由模式
    routerSchemaLoader(app)

    // 加载服务
    serviceLoader(app)

    // 注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app)
    } catch (error) {
      console.error('[exception] there is no global middleware to load')
    }

    // 加载路由, 注册路由需要在服务加载后,即最后一步
    routerLoader(app)

    console.log('🚀 ~ loader 加载完成')

    // 启动服务
    try {
      const port = process.env.PORT || 8080
      const host = process.env.HOST || 'localhost'
      app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`)
      })
    } catch (error) {
      console.error('Error starting server:', error)
    }
  },
}
