module.exports = (app, router) => {
  // 进入 controller 层
  return class ViewController {
    /**
     * 渲染页面
     * @param {*} ctx 上下文对象
     */
    async renderPage(ctx) {
      await ctx.render(`output/entry.${ctx.params.page}`, {
        env: app.env.getEnv(),
        name: app.options?.name,
        options: JSON.stringify(app.options),
      })
    }
  }
}
