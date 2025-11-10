const glob = require('glob')
const path = require('path')
const { sep } = path

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
function loadModels() {
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
  console.log('🚀 ~ loadModels ~ modelList:', modelList)
}

loadModels()
