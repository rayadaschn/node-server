const path = require('path')
const { sep } = path // 路径分隔符
const glob = require('glob') //  glob 模式匹配

/**
 * service 加载器
 * @param {*} app Koa 实例
 * @description 加载服务,可通过 app.service.${目录}.${文件} 访问
 */
module.exports = (app) => {
  // 读取服务目录 app/service/**/*.js 下的所有文件
  const serviceDir = path.join(app.businessPath, `.${sep}service`)
  const filterList = glob.sync(path.join(serviceDir, '**/*.js'))

  // 遍历所有文件目录, 把内容加载到 app.services 中
  const services = {}

  // 加载服务
  filterList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)
    // 截取路径 app/service/${目录}/${文件}.js => ${目录}.${文件}
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf('.'),
    )

    // 把 - 替换为驼峰
    name = name.replace(/[_-][a-z]/gi, (match) => match[1].toUpperCase())

    // 挂载到 app.services 中
    let tempService = services
    const names = name.split(sep)
    for (let i = 0; i < names.length; i++) {
      if (i === names.length - 1) {
        // 最后一个
        const ServiceModule = require(path.resolve(file))(app)
        tempService[names[i]] = new ServiceModule()
      } else {
        if (!tempService[names[i]]) {
          tempService[names[i]] = {}
        }
        // 继续挂载
        tempService = tempService[names[i]]
      }
    }
  })

  // 注册所有服务, 使得可以通过 app.service.${目录}.${文件} 访问
  app.services = services
}
