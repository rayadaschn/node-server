// 封装统一的入口文件

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pinia from '@/store/index.js'
import { createRouter, createWebHistory } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default function createMyApp(
  AppComponent,
  { routes = [], libs = [] } = {},
) {
  const app = createApp(AppComponent)

  // 全局注册 ElementPlus 组件库
  app.use(ElementPlus)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  // 注册 Pinia 状态管理库
  app.use(pinia)

  // 注册其他第三方库
  for (const lib of libs) {
    app.use(lib)
  }

  // 引入页面路由
  if (routes.length > 0) {
    // 不用 createWebHashHistory, 因为会在 url 中添加 # 符号
    const router = createRouter({
      history: createWebHistory(),
      routes,
    })
    app.use(router)
    router.isReady().then(() => {
      // 路由准备就绪后，挂载到 #root 元素
      app.mount('#root')
    })
  } else {
    // 挂载到 #root 元素
    app.mount('#root')
  }

  return app
}
