const path = require("path");
const { sep } = path; // 路径分隔符
const glob = require("glob"); //  glob 模式匹配

/**
 * router schema
 * @param {*} app  Koa 实例
 * @description 加载路由 schema, 通过'json-schema' 校验路由参数, 配合 api-params-verify 中间件使用
 *
 * 输出:
 * app.routerSchema = {
 *   ${路由路径}: {
 *     ${方法}: {
 *       ${参数名}: ${参数schema}
 *     }
 *   }
 * }
 *
 */
module.exports = (app) => {
  // 读取中间件目录 app/router-schema/**/*.js 下的所有文件
  const routerSchemaDir = path.join(app.businessPath, `.${sep}router-schema`);
  const filterList = glob.sync(
    path.join(routerSchemaDir, `${sep}**${sep}*.js`)
  );

  // 注册所有 routerSchema, 使得可以通过 app.routerSchema 访问
  let routerSchema = {};

  filterList.forEach((file) => {
    const routerSchemaItem = require(path.resolve(file));
    routerSchema = {
      ...routerSchema,
      ...routerSchemaItem,
    };
  });

  app.routerSchema = routerSchema;
};
