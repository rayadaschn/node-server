const path = require('path')

/**
 * 注册全局中间件
 * @param {*} app Koa 应用实例
 */
module.exports = (app) => {
  // 配置静态文件目录
  const koaStatic = require('koa-static')
  app.use(koaStatic(path.join(process.cwd(), './app/public')))

  // 模版渲染引擎
  const koaNunJucks = require('koa-nunjucks-2')
  app.use(
    koaNunJucks({
      ext: 'html',
      path: path.join(process.cwd(), './app/public'),
      nunjucksConfig: {
        autoescape: true,
        noCache: true,
        trimBlocks: true,
      },
    }),
  )

  // 解析请求体
  const koaBodyParser = require('koa-bodyparser')
  app.use(
    koaBodyParser({
      formLimit: '1mb',
      enableTypes: ['json', 'form'],
    }),
  )
}
