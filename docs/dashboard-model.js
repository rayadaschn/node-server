{
   mode: 'dashboard',
   name: 'Dashboard Model',
   desc: '描述',
   icon: '',
   homePage: '',

  //  头部菜单
  menu: [{
    key: '', // 唯一描述符
    name: '', // 菜单名称
    menuType: '', // 枚举值: group / module

    // 当 menuType === group 时
    subMenu: [{
      // 可递归
    }],

    // 当 menuType === module 时
    moduleType: '', // 枚举值: sider/iframe/custom/schema

    // 当 moduleType === sider 时
    siderConfig: {
      menu: [{
        // 可递归
      }]
    },

    // 当 moduleType === iframe 时
    iframeConfig: {
      path: '' // iframe 地址
    },

    // 当 moduleType === custom 时
    customConfig: {
      component: '' // 自定义组件路径
    },

    // 当 moduleType === schema 时
    schemaConfig: {
      api: '', // 数据源 API
      schema: {
        type: 'object',
        properties: {
          // JSON Schema 结构
          key: {
            ...schema, // 标准 schema 配置
            type: '', // 字段类型
            label: '', // 字段标签
          }
        }
      },
      tableConfig: {}, // table 相关配置
      searchConfig: {}, // 搜索相关配置
      components: '' // 自定义模块组件
    },
  }]
}