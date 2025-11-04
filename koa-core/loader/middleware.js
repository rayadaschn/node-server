const path = require('path')
const { sep } = path // 路径分隔符
const glob = require('glob') //  glob 模式匹配

/**
 * middleware 加载器
 * @param {*} app Koa 实例
 * @description 加载中间件,可通过 app.middleware.${目录}.${文件} 访问
 */
module.exports = (app) => {
  // 读取中间件目录 app/middleware/**/*.js 下的所有文件
  const middlewareDir = path.resolve(app.businessPath, `.${sep}middleware`)
  const filterList = glob.sync(path.join(middlewareDir, '**/*.js'))

  // 遍历所有文件目录, 把内容加载到 app.middlewares 中
  const middlewares = {}

  // 加载中间件
  filterList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)
    // 截取路径 app/middleware/${目录}/${文件}.js => ${目录}.${文件}
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf('.'),
    )

    // 把 - 替换为驼峰
    name = name.replace(/[_-][a-z]/gi, (match) => match[1].toUpperCase())

    // 挂载到 app.middlewares 中
    let tempMiddleware = middlewares
    const names = name.split(sep)
    for (let i = 0; i < names.length; i++) {
      if (i === names.length - 1) {
        // 最后一个
        tempMiddleware[names[i]] = require(path.resolve(file))(app)
      } else {
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {}
        }
        // 继续挂载
        tempMiddleware = tempMiddleware[names[i]]
      }
    }
  })

  // 注册所有中间件, 使得可以通过 app.middleware.${目录}.${文件} 访问
  app.middlewares = middlewares
}
