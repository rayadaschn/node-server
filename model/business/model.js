module.exports = {
  model: 'business',
  name: 'Business Model',
  description: 'This model represents business entities and their attributes.',
  menu: [
    {
      key: 'project', // 唯一描述符
      name: '商品管理', // 菜单名称
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
    {
      key: 'order', // 唯一描述符
      name: '订单管理', // 菜单名称
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
    {
      key: 'client', // 唯一描述符
      name: '客户管理', // 菜单名称
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
  ],
}
