# my-koa-core

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
