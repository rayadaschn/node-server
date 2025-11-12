<template>
  <div>
    <headerContainer>
      <template #main-content>
        <div>
          <h1>项目列表</h1>
          <el-table :data="tableData">
            <el-table-column prop="id" label="项目ID"></el-table-column>
            <el-table-column prop="name" label="项目名称"></el-table-column>
          </el-table>
        </div>
      </template>
    </headerContainer>
  </div>
</template>

<script setup>
import headerContainer from '@/widgets/header-container/header-container.vue'
</script>

<style scoped></style>
