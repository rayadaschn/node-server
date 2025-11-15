const KoaRouter = require('@koa/router')
const path = require('path')
const glob = require('glob')

/**
 * 加载路由
 * @param {*} app Koa 应用实例
 *
 * @description 解析 app/router/ 下的所有文件, 加载路由到 app.router 中
 */
module.exports = (app) => {
  const routerDir = path.join(app.businessPath, 'router')
  const router = new KoaRouter()

  // 注册所有路由文件
  const fileList = glob.sync(path.join(routerDir, '**/*.js'))

  fileList.forEach((file) => {
    const routerFile = require(file)
    routerFile(app, router)
  })

  // 路由兜底
  router.all(/.*/, async (ctx) => {
    ctx.status = 302
    ctx.redirect(app?.options?.homePage ?? '/')
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
