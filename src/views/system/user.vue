<template>
  <div class="user-container page-container">
    <!-- Search -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Toolbar -->
    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="导出">
            <el-button :icon="Download" circle />
          </el-tooltip>
        </div>
      </div>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
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

    <!-- Add / Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="访客" value="guest" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Search from '~icons/ep/search'
import Refresh from '~icons/ep/refresh'
import Plus from '~icons/ep/plus'
import Delete from '~icons/ep/delete'
import Edit from '~icons/ep/edit'
import Download from '~icons/ep/download'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑用户' : '新增用户'))
const formRef = ref(null)
const selectedIds = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  username: '',
  status: undefined,
})

const form = reactive({
  id: undefined,
  username: '',
  realName: '',
  email: '',
  phone: '',
  role: '',
  status: 1,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }],
}

// Mock data
const tableData = ref([])

onMounted(() => {
  handleQuery()
})

function handleQuery() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      {
        id: 1,
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        role: '管理员',
        status: 1,
        createTime: '2024-01-15 10:00:00',
      },
      {
        id: 2,
        username: 'zhangsan',
        realName: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        role: '普通用户',
        status: 1,
        createTime: '2024-01-14 14:30:00',
      },
      {
        id: 3,
        username: 'lisi',
        realName: '李四',
        email: 'lisi@example.com',
        phone: '13800138002',
        role: '普通用户',
        status: 0,
        createTime: '2024-01-13 09:15:00',
      },
      {
        id: 4,
        username: 'wangwu',
        realName: '王五',
        email: 'wangwu@example.com',
        phone: '13800138003',
        role: '访客',
        status: 1,
        createTime: '2024-01-12 16:45:00',
      },
      {
        id: 5,
        username: 'zhaoliu',
        realName: '赵六',
        email: 'zhaoliu@example.com',
        phone: '13800138004',
        role: '普通用户',
        status: 1,
        createTime: '2024-01-11 11:20:00',
      },
    ]
    total.value = 52
    loading.value = false
  }, 300)
}

function resetQuery() {
  queryParams.username = ''
  queryParams.status = undefined
  queryParams.page = 1
  handleQuery()
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row) {
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
    .catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗？`, '提示', {
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('批量删除成功')
      handleQuery()
    })
    .catch(() => {})
}

function handleStatusChange(row) {
  ElMessage.success(`用户「${row.username}」已${row.status ? '启用' : '禁用'}`)
}

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return
    submitLoading.value = true
    setTimeout(() => {
      ElMessage.success(form.id ? '修改成功' : '新增成功')
      submitLoading.value = false
      dialogVisible.value = false
      handleQuery()
    }, 500)
  })
}

function resetForm() {
  form.id = undefined
  form.username = ''
  form.realName = ''
  form.email = ''
  form.phone = ''
  form.role = ''
  form.status = 1
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
}

.table-card {
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
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
