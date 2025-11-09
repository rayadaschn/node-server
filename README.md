# my-koa-core

## 流程

![项目运行流程](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202511042341003.png)

## 数据处理流程

1. 路由接收请求
2. 控制器处理请求：
   控制器作为请求处理的入口，负责接收请求、调用服务、返回响应。控制器层不直接处理业务逻辑，而是委托给服务层。

   ```js
   async getList(ctx) {
     // 调用服务层
     const { project: ProjectService } = app.services
     const projectList = await ProjectService.getList()
     // 返回结果
     this.success(ctx, projectList)
   }
   ```

3. 服务层执行业务逻辑：
   服务层负责实际的数据处理工作，例如从数据库查询数据、调用其他服务等。

   ```js
   async getList() {
     return [
       { id: 1, name: '项目1' },
       { id: 2, name: '项目2' }
     ]
   }
   ```

## webpack

webpack 各个模块的作用:

- entry 入口模块: 打包的起点，指定了 webpack 从哪个文件开始打包。
- output 输出模块: 打包的出口，指定了 webpack 打包后的文件输出到哪个目录。
- loader 加载器模块: 负责处理非 JavaScript 文件，例如 CSS、图片等。
- resolve 解析模块: 用于解析模块的路径，例如导入语句中的路径。
- module 模块模块: 定义「Webpack 如何处理匹配到的文件」。
- plugin 插件模块: 用于执行范围更广的任务，例如打包优化、资源管理等。
- optimization 优化模块: 用于优化打包结果，例如代码压缩、资源合并等。

![webpack 构包流程](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202511052307795.png)

### 热更新（HMR — Hot Module Replacement）

HMR 不是浏览器自动刷新页面，而是让打包后的运行时代码在页面运行时“替换模块”（module）并执行补丁代码，尽量保持应用状态不丢失。

关键步骤：

1. 修改源文件（如 page1.vue）。
2. webpack watcher 发现变更并做增量编译（只重编译受影响的模块/chunk）。
3. Compiler 生成 hot-update 文件：
   - 一个 manifest（xxxx.json 或 hot-update.json）记录哪些 chunk 更新了；
   - 一个或多个 hot-update.js（模块工厂代码）包含新模块的实现。
4. hot-middleware 在服务器端收到 compilation 完成事件，向所有已连接的浏览器 client 发送一条“hash changed / update available”的消息（通过 EventSource）。
5. 浏览器端的 hot-client（已注入到 bundle）收到消息后：
   - 请求 manifest（GET hot-update.json）并判断有哪些模块需要更新；
   - 顺序下载对应的 hot-update.js chunk；
   - 下载成功后把新模块的工厂函数注入到 webpack 的 module registry，并开始“apply”流程。
6. apply 流程：
   - 对每个将被替换的模块，先运行它的 dispose handlers（module.hot.dispose），让模块可以保存状态或做清理；
   - 替换模块工厂，并执行已注册的 accept handlers（module.hot.accept）或者重新 require 某些模块；
   - 若模块及其依赖都标记为可接受（accepted），则替换完成，页面不刷新，组件更新并保持状态；
   - 若没有可接受的处理器（例如某个根模块没有注册 accept），则整个 bundle 被标记为不可处理，hot-client 根据配置会触发整页刷新（reload=true）或直接失效（默认很多实现会fallback到 location.reload）。
7. 页面显示更新（通常立即反映），日志会在控制台显示 hash/成功信息。
