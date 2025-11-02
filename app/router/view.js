module.exports = (app, router) => {
  const { view: ViewController } = app.controllers;

  // 用户输入 /view/:page 渲染页面
  router.get("/view/:page", ViewController.renderPage.bind(ViewController));
};
