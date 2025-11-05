const md5 = require('md5')

/**
 * API 签名验证中间件
 * @param {*} app Koa 应用实例
 * @returns {Promise<void>}
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 API 请求进行签名验证
    if (!ctx.path.startsWith('/api')) {
      await next()
      return
    }

    const { path, method } = ctx
    const { headers } = ctx.request
    const { s_sign: sSign, s_t: st } = headers

    const signKey = 'my-api-sign-key'
    const signature = md5(`${signKey}${st}`)
    app.logger.info(
      `[-- api sign verify --] path: ${path}, method: ${method}, s_sign: ${sSign}, s_t: ${st}, signature: ${signature}`,
    )

    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > 600 * 1000
    ) {
      ctx.status = 200
      ctx.body = {
        success: false,
        code: 403,
        message: '签名验证失败',
      }
      return
    }

    await next()
  }
}
