<template>
  <div class="role-container page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="角色名称">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userCount" label="用户数" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link :icon="Key" @click="handlePermission(row)"
              >权限</el-button
            >
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- Permission Dialog -->
    <el-dialog v-model="permDialogVisible" title="分配权限" width="480px" destroy-on-close>
      <el-tree
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="{ children: 'children', label: 'label' }"
      />
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Search from '~icons/ep/search'
import Refresh from '~icons/ep/refresh'
import Plus from '~icons/ep/plus'
import Edit from '~icons/ep/edit'
import Delete from '~icons/ep/delete'
import Key from '~icons/ep/key'

const loading = ref(false)
const permDialogVisible = ref(false)
const treeRef = ref(null)
const checkedKeys = ref([])

const queryParams = reactive({ page: 1, pageSize: 10, name: '' })
const total = ref(0)
const tableData = ref([])

const treeData = [
  {
    id: 1,
    label: '系统管理',
    children: [
      { id: 11, label: '用户管理' },
      { id: 12, label: '角色管理' },
      { id: 13, label: '菜单管理' },
    ],
  },
  {
    id: 2,
    label: '内容管理',
    children: [
      { id: 21, label: '文章管理' },
      { id: 22, label: '分类管理' },
    ],
  },
  {
    id: 3,
    label: '数据统计',
    children: [
      { id: 31, label: '访问统计' },
      { id: 32, label: '销售报表' },
    ],
  },
]

onMounted(() => handleQuery())

function handleQuery() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      {
        id: 1,
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有系统全部权限',
        userCount: 2,
        status: 1,
        createTime: '2024-01-01 00:00:00',
      },
      {
        id: 2,
        name: '管理员',
        code: 'admin',
        description: '管理后台日常操作',
        userCount: 5,
        status: 1,
        createTime: '2024-01-02 10:00:00',
      },
      {
        id: 3,
        name: '编辑',
        code: 'editor',
        description: '负责内容编辑与发布',
        userCount: 8,
        status: 1,
        createTime: '2024-01-03 14:00:00',
      },
      {
        id: 4,
        name: '访客',
        code: 'guest',
        description: '仅可查看基本内容',
        userCount: 20,
        status: 0,
        createTime: '2024-01-04 09:00:00',
      },
    ]
    total.value = 4
    loading.value = false
  }, 300)
}

function resetQuery() {
  queryParams.name = ''
  queryParams.page = 1
  handleQuery()
}

function handleAdd() {
  ElMessage.info('新增角色功能 — 开发中')
}

function handleEdit(row) {
  ElMessage.info(`编辑角色: ${row.name} — 开发中`)
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
    .catch(() => {})
}

function handlePermission(row) {
  checkedKeys.value = [11, 12]
  permDialogVisible.value = true
}

function handlePermSubmit() {
  const keys = treeRef.value.getCheckedKeys()
  ElMessage.success(`已分配 ${keys.length} 个权限`)
  permDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.table-card .toolbar {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
