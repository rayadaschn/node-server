const path = require("path");
const { sep } = path; // 路径分隔符
const glob = require("glob"); //  glob 模式匹配

/**
 * controller 加载器
 * @param {*} app Koa 实例
 * @description 加载控制器,可通过 app.controller.${目录}.${文件} 访问
 */
module.exports = (app) => {
  // 读取控制器目录 app/controller/**/*.js 下的所有文件
  const controllerDir = path.join(app.businessPath, `.${sep}controller`);
  const filterList = glob.sync(path.join(controllerDir, "**/*.js"));

  // 遍历所有文件目录, 把内容加载到 app.controller 中
  const controllers = {};

  // 加载控制器
  filterList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file);
    // 截取路径 app/controller/${目录}/${文件}.js => ${目录}.${文件}
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(".")
    );

    // 把 - 替换为驼峰
    name = name.replace(/[_-][a-z]/gi, (match) => match[1].toUpperCase());

    // 挂载到 app.controllers 中
    let tempController = controllers;
    const names = name.split(sep);
    for (let i = 0; i < names.length; i++) {
      if (i === names.length - 1) {
        // 最后一个
        const ControllerModule = require(path.resolve(file))(app);
        tempController[names[i]] = new ControllerModule();
      } else {
        if (!tempController[names[i]]) {
          tempController[names[i]] = {};
        }
        // 继续挂载
        tempController = tempController[names[i]];
      }
    }
  });

  // 注册所有控制器, 使得可以通过 app.controller.${目录}.${文件} 访问
  app.controllers = controllers;
};
