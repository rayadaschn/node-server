const path = require('path')
const { sep } = path // 路径分隔符
const glob = require('glob') //  glob 模式匹配

/**
 * extend 加载器
 * @param {*} app Koa 实例
 * @description 加载扩展,可通过 app.extend.${文件} 访问
 */
module.exports = (app) => {
  // 读取扩展目录 app/extend/**/*.js 下的所有文件
  const extendDir = path.join(app.businessPath, `.${sep}extend`)
  const filterList = glob.sync(path.join(extendDir, '**/*.js'))

  // 遍历所有文件目录, 把内容加载到 app.extend 中

  // 加载扩展
  filterList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)
    // 截取路径 app/extend/${文件}.js => ${文件}
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf('.'),
    )

    // 把 - 替换为驼峰
    name = name.replace(/[_-][a-z]/gi, (match) => match[1].toUpperCase())

    // 过滤 app 中已存在的属性
    if (app[name]) {
      console.warn(`扩展 ${name} 已存在, 请检查是否重复`)
      return
    }

    // 挂载到 app.extend 中
    app[name] = require(path.resolve(file))(app)
  })
}
