<template>
  <div>
    <h1>项目1</h1>
    <input type="text" v-model="name" />
    <div>{{ name }}</div>
    <el-input v-model="name" placeholder="请输入内容"></el-input>
    <el-table :data="tableData">
      <el-table-column prop="id" label="项目ID"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { add } from '@/common/utils.js'
import curl from '@/common/curl.js'

export default {
  data() {
    return {
      name: '',
      tableData: [],
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    console.log(add(1, 2))
    curl({
      url: '/api/project/list',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: '获取项目列表',
      },
    })
      .then((res) => {
        console.log(res)
        this.tableData = res.data || []
      })
      .catch((err) => {
        console.error(err)
      })
  },
}
</script>
<style scoped>
h1 {
  color: blue;
}
</style>
