<template>
  <div>
    <h1>项目2</h1>
    <input type="text" v-model="name" />
    <div>{{ name }}</div>
    <div>测试热更新: {{ content }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { add } from '@/common/utils.js'

const name = ref('')
const content = ref('项目2的内容')

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
