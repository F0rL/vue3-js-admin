<script setup lang="ts">
import { ref, reactive, computed, useTemplateRef } from 'vue'
import { useRequest } from 'alova/client'
import type { FormRules } from 'element-plus'
import SelectIcon from '@/components/SelectIcon/index.vue'
import { getParentMenuAll, getMenuEntity, createMenu, updateMenu } from '@/api/sysMenu'
import type { MenuPayload } from '@/api/sysMenu'
import { message, withLoading } from '@/utils/feedback'

const emit = defineEmits<{
  success: []
}>()

const visible = ref(false)
const editingRow = ref<any | null>(null)
const formRef = useTemplateRef('formRef')
const submitting = ref(false)
const loading = ref(false)
const parentList = ref<{ id: string; title: string }[]>([])

const isEdit = computed(() => !!editingRow.value)

const model = reactive<MenuPayload>({
  title: '',
  path: '',
  icon: 'ep:menu',
  order: 99,
  isMenuShow: true,
  status: 1,
  parentId: null,
})

const rules: FormRules = {
  parentId: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
  title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
  order: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
}

const { send: fetchEntity } = useRequest((id: string) => getMenuEntity({ id }), {
  immediate: false,
  force: true,
})

function resetForm() {
  model.title = ''
  model.path = ''
  model.icon = 'Menu'
  model.order = 99
  model.isMenuShow = true
  model.status = 1
  model.parentId = null
  formRef.value?.resetFields()
}

async function loadParents() {
  try {
    const { msg } = await getParentMenuAll().send()
    let list: { id: string; title: string }[] = msg

    if (isEdit.value && editingRow.value?.id) {
      list = list.filter(item => item.id !== editingRow.value.id)
    }
    parentList.value = list
  } catch {
    parentList.value = []
  }
}

async function loadEntity() {
  if (!editingRow.value?.id) return
  try {
    const { msg } = await fetchEntity(editingRow.value.id)
    if (!msg) return
    model.title = msg.title || ''
    model.path = msg.path || ''
    model.icon = msg.icon || 'Menu'
    model.order = msg.order ?? 99
    model.isMenuShow = msg.isMenuShow ?? true
    if (typeof msg.status === 'object' && msg.status !== null) {
      model.status = msg.status.value
    } else {
      model.status = (msg.status as number) ?? 1
    }
    model.parentId = msg.parent?.id ?? '-1'
  } catch {
    visible.value = false
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (model.parentId !== '-1' && !model.path) {
    message.error('非顶级菜单请输入路由路径')
    return
  }

  const payload = { ...model }
  if (payload.parentId === '-1') {
    payload.parentId = null
  }

  try {
    submitting.value = true
    const fn = isEdit.value ? updateMenu : createMenu
    if (isEdit.value) {
      payload.id = editingRow.value.id
    }
    await withLoading(fn(payload).send(), '保存中...')
    message.success('保存成功')
    visible.value = false
    emit('success')
  } catch {
    /* error handled by http layer */
  } finally {
    submitting.value = false
  }
}

async function open(row?: any) {
  editingRow.value = row ?? null
  visible.value = true
  loading.value = true
  await loadParents()
  if (isEdit.value) {
    await loadEntity()
  } else {
    resetForm()
  }
  loading.value = false
}

defineExpose({ open })
</script>
<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑菜单' : '新增菜单'"
    direction="rtl"
    size="480px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="model"
      :rules="rules"
      label-width="120px"
      :disabled="submitting"
    >
      <el-form-item label="父级菜单" prop="parentId">
        <el-select v-model="model.parentId" class="w-full">
          <el-option value="-1" label="无（顶级菜单）" />
          <el-option
            v-for="item in parentList"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="model.title" placeholder="请输入菜单标题" />
      </el-form-item>

      <el-form-item label="路由路径" prop="path">
        <el-input v-model="model.path" placeholder="请输入路由路径" />
      </el-form-item>

      <el-form-item label="侧边栏展示">
        <el-switch v-model="model.isMenuShow" active-text="展示" inactive-text="隐藏" />
      </el-form-item>

      <el-form-item label="图标">
        <SelectIcon v-model="model.icon" placeholder="请选择图标" />
      </el-form-item>

      <el-form-item label="排序号" prop="order">
        <el-input-number
          v-model="model.order"
          :min="1"
          :max="1000000000"
          placeholder="请输入排序号"
        />
      </el-form-item>

      <el-form-item label="移动端状态">
        <el-switch
          v-model="model.status"
          :active-value="1"
          :inactive-value="-1"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSave">保存</el-button>
    </template>
  </el-drawer>
</template>
