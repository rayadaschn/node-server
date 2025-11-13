<template>
  <div>
    <headerContainer title="项目列表">
      <template #main-content>
        <div v-loading="loading">
          <div v-for="item in modelList" :key="item.id">
            <div class="model-panel">
              <el-row>
                <div class="title">{{ item.model.name }}</div>
              </el-row>
              <div class="line">
                <!-- 分割线 -->
                <el-divider></el-divider>
              </div>
            </div>
            <el-row>
              <el-card
                v-for="projItem in item.project"
                :key="projItem.name"
                :title="projItem.name"
              >
                <template #header>
                  <div class="title">
                    <span>{{ projItem.name }}</span>
                  </div>
                </template>
                <div class="content">{{ projItem.desc }}</div>
                <template #footer>
                  <el-row>
                    <el-button
                      type="primary"
                      @click="handleDetailClick(projItem)"
                    >
                      查看详情
                    </el-button>
                  </el-row>
                </template>
              </el-card>
            </el-row>
          </div>
        </div>
      </template>
    </headerContainer>
  </div>
</template>

<script setup>
import headerContainer from '@/widgets/header-container/header-container.vue'
import curl from '@/common/curl.js'
import { template } from 'lodash'
const { ref, onMounted } = require('vue')
const loading = ref(false)
const modelList = ref([])

async function getModelList() {
  loading.value = true
  try {
    const res = await curl({
      url: '/api/model/list',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: '获取项目列表',
      },
    })
    modelList.value = res.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleDetailClick(projItem) {
  console.log('查看详情', projItem)
}

onMounted(() => {
  getModelList()
})
</script>

<style scoped></style>
