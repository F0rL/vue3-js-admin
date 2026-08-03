<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/vue-query'
import { fetchRoleList, deleteRole, roleKeys } from '@/api/role'
import { confirm, message, withLoading } from '@/utils/feedback'
import RoleForm from './components/RoleForm.vue'

const queryClient = useQueryClient()
const pageIndex = ref(1)
const pageSize = ref(10)

const {
  data: listRes,
  isPending: loading,
} = useQuery({
  queryKey: roleKeys.lists(),
  queryFn: () => fetchRoleList({ pageIndex: pageIndex.value, pageSize: pageSize.value }),
  placeholderData: keepPreviousData,
})

const tableData = computed(() => listRes.value?.items ?? [])
const total = computed(() => listRes.value?.total ?? 0)

const deleteMutation = useMutation({
  mutationFn: (ids: string[]) => deleteRole({ ids }),
  onSuccess: async () => {
    message.success('删除成功')
    await queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
  },
})

const roleFormRef = useTemplateRef('roleFormRef')

function isSystemRole(id: string): boolean {
  return id === '10086'
}

function handleAdd() {
  roleFormRef.value?.open()
}

function handleEdit(row: any) {
  roleFormRef.value?.open(row)
}

async function handleDelete(row: any) {
  const ok = await confirm(`确定删除角色「${row.name}」？`, '删除确认', {
    type: 'error',
    confirmButtonText: '删除',
  })
  if (!ok) return
  await withLoading(deleteMutation.mutateAsync([row.id]), '删除中...')
}

function handleSuccess() {
  queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded bg-white p-4 shadow-sm">
      <div class="flex items-center mb-4">
        <el-button type="primary" @click="handleAdd">
          <template #icon><IconEpPlus /></template>
          新增
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        stripe
        header-cell-class-name="text-gray-600 bg-gray-50!"
        empty-text="暂无数据"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="name" label="角色名称" min-width="160" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-tooltip v-if="isSystemRole(row.id)" content="系统内置，不可编辑" placement="top">
              <el-button type="primary" link disabled>编辑</el-button>
            </el-tooltip>
            <el-button v-else type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
            <el-tooltip v-if="isSystemRole(row.id)" content="系统内置，不可删除" placement="top">
              <el-button type="danger" link disabled>删除</el-button>
            </el-tooltip>
            <el-button v-else type="danger" link @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pageIndex"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
          @size-change="pageIndex = 1"
        />
      </div>
    </div>
    <RoleForm ref="roleFormRef" @success="handleSuccess" />
  </div>
</template>
