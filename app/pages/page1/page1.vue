<template>
  <div>
    <h1>项目1</h1>
    <input type="text" v-model="name" />
    <div>{{ name }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
}
</script>
<style scoped>
/* @import url(); 引入css类 */
h1 {
  color: blue;
}
</style>
