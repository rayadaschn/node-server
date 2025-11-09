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
