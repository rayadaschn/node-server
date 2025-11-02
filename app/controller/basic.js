module.exports = (app) => {
  // 进入 controller 层
  return class BaseController {
    /**
     * 统一基类
     */
    constructor() {
      this.app = app
      this.config = app.config
      this.services = app.services
    }
    /**
     * API 处理成功时统一返回结构
     * @param {*} ctx Koa 上下文
     * @param {*} data 响应数据
     * @param {*} metadata 响应元数据
     */
    success(ctx, data, metadata = {}) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data,
        metadata,
      }
    }
    /**
     * API 处理失败时统一返回结构
     * @param {*} ctx Koa 上下文
     * @param {*} message 错误信息
     * @param {*} metadata 响应元数据
     */
    fail(ctx, message, metadata = {}) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message,
        metadata,
      }
    }
  }
}
