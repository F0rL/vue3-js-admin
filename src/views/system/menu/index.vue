<script setup lang="ts">
import { ref, computed, onUnmounted, useTemplateRef } from 'vue'
import { useWatcher } from 'alova/client'
import iconMap from '@/icons'
import { getMenuTree, getMenuEntity, updateMenu, deleteMenu } from '@/api/sysMenu'
import type { MenuTreeNode } from '@/api/sysMenu'
import { usePermissionStore } from '@/stores/modules/permission'
import { confirm, message, withLoading } from '@/utils/feedback'
import MenuForm from './components/MenuForm.vue'

const searchKey = ref('')
const switchingId = ref('')
const tableRef = useTemplateRef('tableRef')
const menuFormRef = useTemplateRef('menuFormRef')

const permissionStore = usePermissionStore()

const {
  data: treeRes,
  loading,
  send: fetchTree,
  abort,
} = useWatcher(() => getMenuTree({ searchKey: searchKey.value }), [searchKey], {
  immediate: true,
  abortLast: true,
  force: true,
  initialData: undefined,
})

const treeData = computed(() => {
  const res = treeRes.value as { msg?: MenuTreeNode[] } | undefined
  return res?.msg ?? []
})

onUnmounted(() => abort())

function resolveStatus(row: any): number {
  const s = row.status
  if (typeof s === 'object' && s !== null) return (s as { value: number }).value
  return (s as number) ?? 1
}

function handleSearch() {
  fetchTree()
}

function handleReset() {
  searchKey.value = ''
}

function toggleRows(rows: any[], expanded: boolean) {
  rows.forEach(row => {
    tableRef.value?.toggleRowExpansion(row, expanded)
    if (row.children?.length) {
      toggleRows(row.children, expanded)
    }
  })
}

function handleExpandAll() {
  toggleRows(treeData.value, true)
}

function handleCollapseAll() {
  toggleRows(treeData.value, false)
}

function openCreate() {
  menuFormRef.value?.open()
}

function openEdit(row: any) {
  menuFormRef.value?.open(row)
}

async function handleSuccess() {
  await permissionStore.refreshMenu()
  fetchTree()
}

async function handleToggleShow(row: any, val: boolean) {
  const previous = row.isMenuShow
  row.isMenuShow = val
  switchingId.value = row.id

  try {
    const { msg } = await getMenuEntity({ id: row.id }).send()
    if (!msg) throw new Error()

    await updateMenu({
      id: row.id,
      title: msg.title || '',
      path: msg.path || '',
      icon: msg.icon || '',
      order: msg.order ?? 99,
      isMenuShow: val,
      status: typeof msg.status === 'object' ? msg.status.value : ((msg.status as number) ?? 1),
      parentId: msg.parent?.id ?? null,
    }).send()

    await permissionStore.refreshMenu()
  } catch {
    row.isMenuShow = previous
    message.error('操作失败')
  } finally {
    switchingId.value = ''
  }
}

async function handleDelete(row: any) {
  const ok = await confirm(`确定删除菜单「${row.title}」？`, '删除确认', {
    type: 'error',
    confirmButtonText: '删除',
  })
  if (!ok) return
  await withLoading(deleteMenu({ ids: [row.id] }).send(), '删除中...')
  message.success('删除成功')
  await permissionStore.refreshMenu()
  fetchTree()
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded bg-white p-5 shadow-sm">
      <div class="flex items-center">
        <el-input
          class="w-60!"
          v-model="searchKey"
          placeholder="搜索菜单名称或路由"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button class="ml-3" type="primary" @click="handleSearch">
          <template #icon><IconEpSearch /></template>
          查询
        </el-button>
        <el-button @click="handleReset">
          <template #icon><IconEpRefresh /></template>
          重置
        </el-button>
      </div>
    </div>

    <div class="p-4 rounded bg-white shadow-sm">
      <div class="flex items-center mb-4">
        <el-button type="primary" @click="openCreate">
          <template #icon><IconEpPlus /></template>
          新增
        </el-button>
        <el-button @click="handleExpandAll">
          <template #icon><IconRiExpandVerticalLine /></template>
          展开全部
        </el-button>
        <el-button @click="handleCollapseAll">
          <template #icon><IconRiCollapseVerticalLine /></template>
          收起全部
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="treeData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        header-cell-class-name="text-gray-600 bg-gray-50!"
        stripe
        empty-text="暂无数据"
      >
        <el-table-column prop="title" label="菜单标题" min-width="160" />
        <el-table-column prop="path" label="路由路径" min-width="140" />
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon && iconMap[row.icon]" :size="18">
              <component :is="iconMap[row.icon]" />
            </el-icon>
            <span v-else class="text-xs text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="侧边栏展示" width="130" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.isMenuShow !== false"
              :loading="switchingId === row.id"
              @change="(val: boolean) => handleToggleShow(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序号" width="80" align="center" />
        <el-table-column label="移动端" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="resolveStatus(row) === 1 ? 'success' : 'danger'"
              size="small"
              disable-transitions
            >
              {{ resolveStatus(row) === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <MenuForm ref="menuFormRef" @success="handleSuccess" />
  </div>
</template>

<style lang="scss" scoped></style>
