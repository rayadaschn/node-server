const _ = require('lodash')
const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * 合并 model 与 project 配置
 * project 有的 key, model 也有的话, 以 project 为准
 * project 没有的 key, 则使用 model 的配置
 * model 有, project 没有的 key, 则使用 model 的配置
 * @param {*} model
 * @param {*} project
 */
const projectExtendModel = (model, project) => {
  return _.mergeWith({}.model, project, (modelValue, projectValue) => {
    // 处理数组的合并问题
    if (Array.isArray(modelValue) && Array.isArray(projectValue)) {
      const result = []
      // 如果 project 有值, 则以 project 为准
      for (let i = 0; i < modelValue.length; i++) {
        const modelMenuItem = modelValue[i]
        const projectMenuItem = projectValue.find(
          (item) => item.key === modelMenuItem.key,
        )
        const curItem = projectMenuItem
          ? projectExtendModel(modelMenuItem, projectMenuItem)
          : modelMenuItem

        result.push(curItem)
      }

      // 处理新增
      for (let i = 0; i < projectValue.length; i++) {
        const projectMenuItem = projectValue[i]
        const modelMenuItem = modelValue.find(
          (item) => item.key === projectMenuItem.key,
        )
        if (!modelMenuItem) {
          result.push(projectMenuItem)
        }
      }

      return result
    }
  })
}

/**
 * 解析 model, 并返回组织目录后的数据结构
 * [{
 *  modelKey: ${model},
 *  project: {
 *    project1Key: ${proj1}
 *    project2Key: ${proj2}
 *  }
 * }]
 */
module.exports = function loadModels(app) {
  const modelList = []

  // 遍历返回当前文件夹并挂载到 modelList 上
  const files = glob.sync(path.join(__dirname, `${sep}**${sep}*.js`))
  files.forEach((file) => {
    // 排除当前文件
    if (file.endsWith('index.js')) return

    // 区分配置类型(model / project)
    const type = file.indexOf(`${sep}project${sep}`) > -1 ? 'project' : 'model'
    if (type === 'model') {
      // 获取文件夹名称
      const modelKey = file.match(/\/model\/(.*?)\/model\.js/)?.[1] || ''
      let modelItem = modelList.find((item) => item.model?.key === modelKey)
      if (!modelItem) {
        modelItem = {}
        modelList.push(modelItem)
      }
      modelItem.model = require(path.resolve(file))
      modelItem.model.key = modelKey
    }

    if (type === 'project') {
      // 获取文件夹名称
      const matchKey = file.match(/\/model\/(.*?)\/project\/(.*?)\.js/)
      const modelKey = matchKey?.[1] || ''
      const projectKey = matchKey?.[2] || ''
      let modelItem = modelList.find((item) => item.model?.key === modelKey)
      if (!modelItem) {
        modelItem = {}
        modelList.push(modelItem)
      }
      if (!modelItem.project) {
        modelItem.project = {}
      }
      modelItem.project[projectKey] = require(path.resolve(file))
    }
  })

  // 数据进一步处理, project 继承 model
  modelList.forEach((modelItem) => {
    const { model, project } = modelItem
    for (const key in project) {
      project[key] = projectExtendModel(model, project[key])
    }
  })

  return modelList
}
