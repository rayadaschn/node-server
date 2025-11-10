module.exports = {
  name: '淘宝',
  desc: '淘宝商品管理系统',
  icon: 'taobao',
  homePage: '/taobao/dashboard',
  menu: [
    {
      key: 'order',
      moduleType: 'iframe',
      iframeConfig: {
        path: 'http://www.taobao.com',
      },
    },
    {
      key: 'operating', // 唯一描述符
      name: '运营管理', // 菜单名称
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'coupon',
            name: '优惠券', // 菜单名称
            menuType: 'module',
            customConfig: {
              path: '/taobao/coupon',
            },
          },
          {
            key: 'limited',
            name: '限时折扣', // 菜单名称
            menuType: 'module',
            customConfig: {
              path: '/taobao/limited',
            },
          },
          {
            key: 'festival',
            name: '节日折扣', // 菜单名称
            menuType: 'module',
            customConfig: {
              path: '/taobao/festival',
            },
          },
        ],
      },
    },
  ],
}
