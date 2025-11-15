import createMyApp from '@/boot.js'
import App from './page2.vue'
import Page1 from '../page1/page1.vue'
import { h } from 'vue'
import { RouterView } from 'vue-router'

const Root = {
  render() {
    return h(RouterView)
  },
}

const routes = [
  { path: '/', component: App },
  { path: '/view/page2', component: App },
  { path: '/view/page1', component: Page1 },
]

/**
 * 原先是把 App.vue 当作根组件，但 它本身不是一个 <router-view> 容器。
 * 一旦它被挂载为根组件，它就变成一个“死页面”，导致 Vue Router 无法在里面渲染其它路由页面。
 * 现在: 创建了 Root → Root 就是 <router-view> → 路由能正常工作 → 页面能切换了
 */
const app = createMyApp(Root, { routes })
