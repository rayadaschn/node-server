const path = require("path");

/**
 * 注册全局中间件
 * @param {*} app Koa 应用实例
 */
module.exports = (app) => {
  // 模版渲染引擎
  const koaNunJucks = require("koa-nunjucks-2");
  app.use(
    koaNunJucks({
      ext: "html",
      path: path.join(process.cwd(), "./app/public"),
      nunjucksConfig: {
        autoescape: true,
        noCache: true,
        trimBlocks: true,
      },
    })
  );
};
