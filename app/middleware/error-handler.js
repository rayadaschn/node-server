/**
 * 错误处理中间件
 * @param {object} app Koa 实例
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // 打印错误日志
      const { status, message, detail } = err
      app.logger.error(`[-- exception --][${status}] ${message} ${detail}`)

      // 重定向
      if (message && message.indexOf('template not found') !== -1) {
        // 页面重定向
        ctx.status = 302
        ctx.redirect(`${app.options?.homePage || '/'}`)
        return
      }

      // 返回错误响应
      ctx.status = status || 500
      ctx.body = {
        success: false,
        code: ctx.status,
        message,
        detail,
      }
    }
  }
}
