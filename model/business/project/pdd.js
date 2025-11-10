module.exports = {
  name: '淘宝',
  desc: '淘宝商品管理系统',
  icon: 'taobao',
  homePage: '/taobao/dashboard',
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
      name: '客户管理(拼多多)',
    },
    {
      key: 'data',
      name: '数据分析(拼多多)',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'report',
            name: '数据报告', // 菜单名称
            menuType: 'module',
            customConfig: {
              path: '/taobao/report',
            },
          },
        ],
      },
    },
  ],
}
