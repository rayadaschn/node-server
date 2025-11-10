module.exports = {
  model: 'course',
  name: 'Course Model',
  description: 'This model represents course entities and their attributes.',
  menu: [
    {
      key: 'project', // 唯一描述符
      name: '课程管理', // 菜单名称
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
