<template>
  <div>
    <h1>项目2</h1>
    <input type="text" v-model="name" />
    <div>{{ name }}</div>
    <div>测试热更新: {{ content }}</div>
    <el-button type="primary" @click="handleClick">跳转到 page1</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { add } from '@/common/utils.js'

const name = ref('')
const content = ref('项目2的内容')

const router = useRouter()
const handleClick = () => {
  // 未注册, 路由直接跳转到 page1 页面
  router.push('/view/page1')
}

// 生命周期 - 创建完成（访问当前this实例）
onMounted(() => {
  console.log('项目2创建完成')
  console.log(add(1, 2))
})
</script>
<style scoped>
h1 {
  color: red;
}
</style>
