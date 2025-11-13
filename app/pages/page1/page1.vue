<template>
  <div class="page1-container">
    <h1>📊 数据库 CRUD 测试</h1>

    <!-- 创建用户部分 -->
    <div class="section">
      <h2>➕ 创建用户</h2>
      <el-form :model="newUser" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.name" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUser.email" placeholder="输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="newUser.age" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createUser">创建</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询用户部分 -->
    <div class="section">
      <h2>🔍 查询用户</h2>
      <div class="query-controls">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索关键词 (名字或邮箱)"
          style="width: 300px"
        ></el-input>
        <el-button type="info" @click="searchUsers" style="margin-left: 10px">
          搜索
        </el-button>
        <el-button @click="getAllUsers" style="margin-left: 10px">
          显示全部
        </el-button>
        <el-button
          type="warning"
          @click="getUserCount"
          style="margin-left: 10px"
        >
          统计数量
        </el-button>
      </div>
      <div v-if="totalCount !== null" style="margin: 10px 0; color: #606266">
        📌 总数:
        <strong>{{ totalCount }}</strong>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="section">
      <h2>📋 用户列表</h2>
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" width="150"></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="200"
        ></el-table-column>
        <el-table-column prop="age" label="年龄" width="100"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="200">
          <template #default="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              @click="showEditDialog(scope.row)"
              type="primary"
              plain
            >
              编辑
            </el-button>
            <el-button
              size="small"
              @click="deleteUser(scope.row.id)"
              type="danger"
              plain
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" v-model="editDialogVisible" width="500px">
      <el-form :model="editingUser" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editingUser.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editingUser.email"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editingUser.age" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 操作日志 -->
    <div class="section">
      <h2>📝 操作日志</h2>
      <el-button
        type="info"
        plain
        @click="clearLogs"
        style="margin-bottom: 10px"
      >
        清除日志
      </el-button>
      <div class="logs">
        <div
          v-for="(log, index) in logs"
          :key="index"
          :class="['log-item', log.type]"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import curl from '@/common/curl.js'
import md5 from 'md5'

export default {
  data() {
    return {
      newUser: {
        name: '',
        email: '',
        age: 0,
      },
      editingUser: {
        id: null,
        name: '',
        email: '',
        age: 0,
      },
      editDialogVisible: false,
      tableData: [],
      searchKeyword: '',
      totalCount: null,
      logs: [],
    }
  },
  created() {},
  mounted() {
    this.getAllUsers()
  },
  methods: {
    /**
     * 创建用户
     */
    async createUser() {
      if (!this.newUser.name || !this.newUser.email) {
        this.$message.error('请输入用户名和邮箱')
        return
      }

      try {
        const signKey = 'my-api-sign-key'
        const s_t = Date.now()
        const s_sign = md5(`${signKey}${s_t}`)
        const res = await curl({
          url: '/api/users',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', s_sign, s_t },
          data: this.newUser,
        })

        if (res.success) {
          this.$message.success('✅ 用户创建成功')
          this.addLog('success', `创建用户: ${this.newUser.name}`)
          this.resetForm()
          this.getAllUsers()
        } else {
          this.$message.error(res.message || '创建失败')
          this.addLog('error', `创建失败: ${res.message}`)
        }
      } catch (err) {
        this.$message.error('请求失败: ' + err.message)
        this.addLog('error', `请求异常: ${err.message}`)
      }
    },

    /**
     * 获取所有用户
     */
    async getAllUsers() {
      try {
        const signKey = 'my-api-sign-key'
        const s_t = Date.now()
        const s_sign = md5(`${signKey}${s_t}`)
        const res = await curl({
          url: '/api/users',
          method: 'GET',
          headers: { 'Content-Type': 'application/json', s_sign, s_t },
        })

        if (res.success) {
          this.tableData = res.data || []
          this.addLog('info', `获取全部用户, 共 ${this.tableData.length} 条`)
        } else {
          this.$message.error(res.message)
          this.addLog('error', `获取用户失败: ${res.message}`)
        }
      } catch (err) {
        this.$message.error('请求失败')
        this.addLog('error', `请求异常: ${err.message}`)
      }
    },

    /**
     * 搜索用户
     */
    async searchUsers() {
      if (!this.searchKeyword) {
        this.$message.warning('请输入搜索关键词')
        return
      }

      try {
        const signKey = 'my-api-sign-key'
        const s_t = Date.now()
        const s_sign = md5(`${signKey}${s_t}`)
        const res = await curl({
          url: `/api/users/search?keyword=${this.searchKeyword}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (res.success) {
          this.tableData = res.data || []
          this.addLog(
            'info',
            `搜索关键词: "${this.searchKeyword}", 找到 ${this.tableData.length} 条记录`,
          )
        } else {
          this.$message.error(res.message)
          this.addLog('error', `搜索失败: ${res.message}`)
        }
      } catch (err) {
        this.$message.error('请求失败')
        this.addLog('error', `请求异常: ${err.message}`)
      }
    },

    /**
     * 获取用户数量
     */
    async getUserCount() {
      try {
        const signKey = 'my-api-sign-key'
        const s_t = Date.now()
        const s_sign = md5(`${signKey}${s_t}`)
        const res = await curl({
          url: '/api/users/count',
          method: 'GET',
          headers: { 'Content-Type': 'application/json', s_sign, s_t },
        })

        if (res.success) {
          this.totalCount = res.data.count
          this.$message.success(`用户总数: ${this.totalCount}`)
          this.addLog('info', `获取用户统计, 总数: ${this.totalCount}`)
        } else {
          this.$message.error(res.message)
          this.addLog('error', `统计失败: ${res.message}`)
        }
      } catch (err) {
        this.$message.error('请求失败')
        this.addLog('error', `请求异常: ${err.message}`)
      }
    },

    /**
     * 显示编辑对话框
     */
    showEditDialog(user) {
      this.editingUser = { ...user }
      this.editDialogVisible = true
    },

    /**
     * 更新用户
     */
    async updateUser() {
      try {
        const signKey = 'my-api-sign-key'
        const s_t = Date.now()
        const s_sign = md5(`${signKey}${s_t}`)
        const res = await curl({
          url: `/api/users/${this.editingUser.id}`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', s_sign, s_t },
          data: {
            name: this.editingUser.name,
            email: this.editingUser.email,
            age: this.editingUser.age,
          },
        })

        if (res.success) {
          this.$message.success('✅ 用户更新成功')
          this.addLog('success', `更新用户: ${this.editingUser.name}`)
          this.editDialogVisible = false
          this.getAllUsers()
        } else {
          this.$message.error(res.message || '更新失败')
          this.addLog('error', `更新失败: ${res.message}`)
        }
      } catch (err) {
        this.$message.error('请求失败')
        this.addLog('error', `请求异常: ${err.message}`)
      }
    },

    /**
     * 删除用户
     */
    async deleteUser(userId) {
      this.$confirm('确定删除此用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            const signKey = 'my-api-sign-key'
            const s_t = Date.now()
            const s_sign = md5(`${signKey}${s_t}`)
            const res = await curl({
              url: `/api/users/${userId}`,
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json', s_sign, s_t },
            })

            if (res.success) {
              this.$message.success('✅ 用户删除成功')
              this.addLog('success', `删除用户 ID: ${userId}`)
              this.getAllUsers()
            } else {
              this.$message.error(res.message || '删除失败')
              this.addLog('error', `删除失败: ${res.message}`)
            }
          } catch (err) {
            this.$message.error('请求失败')
            this.addLog('error', `请求异常: ${err.message}`)
          }
        })
        .catch(() => {
          this.addLog('info', '取消删除操作')
        })
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.newUser = {
        name: '',
        email: '',
        age: 0,
      }
    },

    /**
     * 格式化时间
     */
    formatTime(timeStr) {
      if (!timeStr) return '-'
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN')
    },

    /**
     * 添加日志
     */
    addLog(type, message) {
      const time = new Date().toLocaleTimeString('zh-CN')
      this.logs.unshift({
        type,
        message,
        time,
      })
      // 最多保留 20 条日志
      if (this.logs.length > 20) {
        this.logs.pop()
      }
    },

    /**
     * 清除日志
     */
    clearLogs() {
      this.logs = []
      this.$message.success('日志已清除')
    },
  },
}
</script>

<style scoped>
.page1-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

h1 {
  color: #303133;
  margin-bottom: 30px;
  font-size: 28px;
  border-bottom: 3px solid #409eff;
  padding-bottom: 10px;
}

h2 {
  color: #606266;
  font-size: 18px;
  margin: 20px 0 15px;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.section {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.query-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.el-table {
  font-size: 14px;
}

.logs {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
}

.log-item {
  padding: 8px;
  margin: 5px 0;
  border-radius: 3px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  display: flex;
  gap: 10px;
}

.log-item.success {
  background-color: #f0f9ff;
  color: #67c23a;
  border-left: 3px solid #67c23a;
}

.log-item.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border-left: 3px solid #f56c6c;
}

.log-item.info {
  background-color: #f4f4f5;
  color: #606266;
  border-left: 3px solid #409eff;
}

.log-time {
  color: #909399;
  flex-shrink: 0;
  font-weight: bold;
}

.log-message {
  flex: 1;
  word-break: break-all;
}
</style>
<style scoped>
h1 {
  color: blue;
}
</style>
