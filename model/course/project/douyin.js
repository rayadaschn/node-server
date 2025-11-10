module.exports = {
  name: '抖音',
  desc: '抖音商品管理系统',
  icon: 'douyin',
  homePage: '/douyin/dashboard',
  menu: [
    {
      key: 'product',
      name: '商品管理',
    },
    {
      key: 'order',
      name: '订单管理(拼多多)',
    },
    {
      key: 'client',
      name: '客户管理(抖音)',
    },
    {
      key: 'data',
      name: '数据分析(抖音)',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'report',
            name: '数据报告', // 菜单名称
            menuType: 'module',
            customConfig: {
              path: '/douyin/report',
            },
          },
        ],
      },
    },
  ],
}
