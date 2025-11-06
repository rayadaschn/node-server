<template>
  <div>
    <h1>项目2</h1>
    <input type="text" v-model="name" />
    <div>{{ name }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')

// 生命周期 - 创建完成（访问当前this实例）
onMounted(() => {
  console.log('项目2创建完成')
})
</script>
<style scoped>
/* @import url(); 引入css类 */
h1 {
  color: red;
}
</style>
