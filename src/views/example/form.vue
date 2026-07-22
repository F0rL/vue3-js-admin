<template>
  <div class="form-page page-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">综合表单</span>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="max-width: 720px"
      >
        <!-- Basic Info -->
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
                <el-option label="线上活动" value="online" />
                <el-option label="线下活动" value="offline" />
                <el-option label="混合活动" value="hybrid" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动日期" prop="dateRange">
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="owner">
              <el-input v-model="form.owner" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Detail -->
        <el-divider content-position="left">活动详情</el-divider>
        <el-form-item label="活动描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入活动描述" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报名人数" prop="maxPeople">
              <el-input-number
                v-model="form.maxPeople"
                :min="1"
                :max="10000"
                placeholder="上限"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="draft">草稿</el-radio>
                <el-radio value="active">进行中</el-radio>
                <el-radio value="closed">已结束</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="选项" prop="options">
          <el-checkbox-group v-model="form.options">
            <el-checkbox value="email">邮件通知</el-checkbox>
            <el-checkbox value="sms">短信提醒</el-checkbox>
            <el-checkbox value="push">App推送</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="封面图" prop="cover">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1">
            <el-icon><IconEpPlus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="活动区域" prop="region">
          <el-cascader
            v-model="form.region"
            :options="regionOptions"
            placeholder="请选择区域"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="切换开关" prop="switch">
          <el-switch v-model="form.switch" active-text="开启" inactive-text="关闭" />
        </el-form-item>

        <el-form-item label="评分" prop="rate">
          <el-rate v-model="form.rate" />
        </el-form-item>

        <el-form-item label="滑块" prop="slider">
          <el-slider v-model="form.slider" show-input style="width: 60%" />
        </el-form-item>

        <!-- Submit -->
        <el-divider />
        <el-form-item>
          <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
          <el-button @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Display submitted data -->
    <el-card v-if="submittedData" shadow="never" class="result-card">
      <template #header>
        <span>提交数据预览</span>
      </template>
      <pre class="json-preview">{{ JSON.stringify(submittedData, null, 2) }}</pre>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from '@/utils/feedback'

const formRef = ref(null)
const submittedData = ref(null)

const form = reactive({
  name: '',
  type: '',
  dateRange: [],
  owner: '',
  desc: '',
  maxPeople: 100,
  status: 'draft',
  options: [],
  cover: [],
  region: [],
  switch: false,
  rate: 3,
  slider: 50,
})

const rules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
}

const regionOptions = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      { value: 'chaoyang', label: '朝阳区' },
      { value: 'haidian', label: '海淀区' },
    ],
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      { value: 'pudong', label: '浦东新区' },
      { value: 'jingan', label: '静安区' },
    ],
  },
]

function handleSubmit(formEl) {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      message.success('提交成功')
      submittedData.value = { ...form }
    } else {
      message.error('请完善表单信息')
    }
  })
}

function handleReset(formEl) {
  if (!formEl) return
  formEl.resetFields()
  submittedData.value = null
}
</script>

<style lang="scss" scoped>
.card-title {
  font-weight: 600;
}

.result-card {
  margin-top: 16px;
}

.json-preview {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}
</style>
