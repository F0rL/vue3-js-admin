<template>
  <div class="table-page page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="请选择" clearable style="width: 140px">
            <el-option label="类型一" value="1" />
            <el-option label="类型二" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus">新增</el-button>
          <el-button :icon="Upload">导入</el-button>
          <el-button :icon="Download">导出</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新">
            <el-button :icon="Refresh" circle @click="handleQuery" />
          </el-tooltip>
          <el-tooltip content="密度">
            <el-dropdown trigger="click" @command="handleSizeChange">
              <el-button :icon="List" circle />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="large">宽松</el-dropdown-item>
                  <el-dropdown-item command="default">默认</el-dropdown-item>
                  <el-dropdown-item command="small">紧凑</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        :size="tableSize"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="categoryType(row.category)">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" sortable />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="发布时间" width="170" sortable />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View">查看</el-button>
            <el-button type="success" link :icon="Edit">编辑</el-button>
            <el-button type="danger" link :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Search from '~icons/ep/search'
import Refresh from '~icons/ep/refresh'
import Plus from '~icons/ep/plus'
import Upload from '~icons/ep/upload'
import Download from '~icons/ep/download'
import List from '~icons/ep/list'
import View from '~icons/ep/view'
import Edit from '~icons/ep/edit'
import Delete from '~icons/ep/delete'

const loading = ref(false)
const tableSize = ref('default')

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  type: '',
  dateRange: [],
})

const total = ref(0)
const tableData = ref([])

onMounted(() => handleQuery())

function handleQuery() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData()
    total.value = 86
    loading.value = false
  }, 300)
}

function resetQuery() {
  queryParams.keyword = ''
  queryParams.type = ''
  queryParams.dateRange = []
  queryParams.page = 1
  handleQuery()
}

function handleSizeChange(size) {
  tableSize.value = size
}

function categoryType(cat) {
  const map = { 科技: '', 设计: 'success', 运营: 'warning', 产品: 'info' }
  return map[cat] || ''
}

function statusType(status) {
  const map = { 已发布: 'success', 草稿: 'info', 审核中: 'warning' }
  return map[status] || 'info'
}

function generateData() {
  const data = []
  const titles = [
    'Vue3 组合式 API 最佳实践指南',
    'Element Plus 组件库深度解析',
    'Tailwind CSS 实用技巧合集',
    '前端性能优化实战经验分享',
    '微前端架构设计与落地',
    'TypeScript 高级类型体操',
    'Node.js 服务端开发入门',
    'Webpack 到 Vite 迁移指南',
    'Git 工作流程最佳实践',
    'Docker 容器化部署实战',
  ]
  const authors = ['张三', '李四', '王五', '赵六', '孙七']
  const categories = ['科技', '设计', '运营', '产品']
  const statuses = ['已发布', '草稿', '审核中']

  for (let i = 0; i < 10; i++) {
    data.push({
      id: i + 1 + (queryParams.page - 1) * 10,
      title: titles[i],
      author: authors[i % authors.length],
      category: categories[i % categories.length],
      views: Math.floor(Math.random() * 10000) + 500,
      status: statuses[i % statuses.length],
      date: `2024-01-${String(15 - i).padStart(2, '0')} 10:00:00`,
    })
  }
  return data
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
