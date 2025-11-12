<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row type="flex" align="middle" class="header-row">
        <el-row type="flex" align="middle" class="title-panel">
          <img
            src="./asserts/logo.png"
            alt="logo"
            style="height: 30px"
            class="logo"
          />
          <el-row>{{ title }}</el-row>
        </el-row>
        <!-- 插槽: 菜单区域 -->
        <slot name="menu-content"></slot>
        <!-- 右上方区域 -->
        <el-row type="flex" align="middle" class="right-panel">
          <slot name="right-content"></slot>
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link" style="user-select: none">
              {{ userName }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <!-- 外部拓展填充区间 -->
      <slot name="main-content"></slot>
    </el-main>
  </el-container>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '标题',
  },
  userName: {
    type: String,
    default: 'admin',
  },
})
</script>

<style scoped>
.header-container {
  height: 100vh;
  overflow: hidden;
}
.header {
  height: 60px;
  border-bottom: 1px solid #eee;
}

.header-row {
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}

.logo {
  margin-right: 10px;
}

.right-panel {
  display: flex;
  align-items: center;
}

.main-container {
  height: calc(100vh - 60px);
}

:deep(.el-header) {
  background-color: #409eff;
}
</style>
