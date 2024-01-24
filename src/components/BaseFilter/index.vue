<script lang="ts" setup>
import { SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'

import dayjs, { type Dayjs } from 'dayjs'

import type { IBaseQuery } from '@/types/index'

defineOptions({
  name: 'baseFilter'
})
const $emits = defineEmits<{
  handleSearch: [query: IBaseQuery]
  handleReset: []
}>()
const $props = withDefaults(
  defineProps<{
    /**
     * 预设时间范围
     */
    rangePresets?: { label: string; value: [Dayjs, Dayjs] }[]
    /**
     * 不可选择的时间，默认当前时间之后的时间
     * @param current 
     */
    disabledDate?: (current: Dayjs) => boolean
    dateFormat?: string
    showTime?: boolean
    /**
     * 开始/结束时间是否允许为空，默认都可以
     */
    allowEmpty?: [boolean, boolean]
    /**
     * 每一项之间的间隔
     */
    gutter?: number
    /**
     * 每一项大小
     */
    span?: number
    /**
     * 自定义关键字输入框的提示语
     */
    placeholder?: string
    /**
     * 是否开启未输入值时禁用搜索按钮，默认 true
     */
    disabledEmptySearch?: boolean
    loading?: boolean
  }>(),
  {
    rangePresets: () => [
      { label: '今天', value: [dayjs().hour(0).minute(0).second(0), dayjs()] },
      {
        label: '昨天',
        value: [
          dayjs().add(-1, 'd').hour(0).minute(0).second(0),
          dayjs().add(-1, 'd').hour(23).minute(59).second(59)
        ]
      },
      { label: '最近3天', value: [dayjs().add(-3, 'd'), dayjs()] },
      { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
      { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
      { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
      { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] }
    ],
    disabledDate: (current: Dayjs) => {
      // Can not select days before today and today
      return current && current > dayjs().endOf('day')
    },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
    allowEmpty: () => [true, true],
    placeholder: '请输入关键字',
    gutter: 20,
    span: 12,
    disabledEmptySearch: true,
    loading: false
  }
)

const query = ref<{
  keyword: string
  dateRange: [string, string] | undefined
}>({
  keyword: '',
  dateRange: undefined
})

const isDisabledSearch = computed(() => {
  const { keyword, dateRange } = query.value
  return $props.disabledEmptySearch && !keyword && !dateRange
})

const type = ref<'search' | 'reset'>('search')
const handleSearch = () => {
  const { keyword, dateRange } = query.value
  const startTime = dateRange ? dateRange[0] : ''
  const endTime = dateRange ? dateRange[1] : ''

  type.value = 'search'
  $emits('handleSearch', { keyword, startTime, endTime })
}

const handleReset = () => {
  query.value = {
    keyword: '',
    dateRange: undefined
  }

  type.value = 'reset'
  $emits('handleReset')
}
</script>

<template>
  <div class="base_filter">
    <div class="base_filter_form">
      <a-row :gutter="gutter">
        <a-col :span="span">
          <a-input v-model:value="query.keyword" allow-clear :placeholder="placeholder" />
        </a-col>
        <a-col :span="span">
          <a-range-picker
            style="width: 100%"
            v-model:value="query.dateRange"
            :allow-empty="allowEmpty"
            :presets="rangePresets"
            :show-time="showTime"
            :disabled-date="disabledDate"
            :format="dateFormat"
            :value-format="dateFormat"
          />
        </a-col>
        <slot />
      </a-row>
    </div>
    <div class="base_filter_btn">
      <a-button
        type="primary"
        :disabled="isDisabledSearch"
        :loading="loading && type === 'search'"
        @click="handleSearch"
      >
        <template #icon>
          <SearchOutlined />
        </template>
        查询
      </a-button>
      <a-button
        style="margin-left: 12px"
        :disabled="loading && type !== 'reset'"
        :loading="loading && type === 'reset'"
        @click="handleReset"
      >
        <template #icon>
          <SyncOutlined />
        </template>
        重置
      </a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base_filter {
  display: flex;
  justify-content: space-between;

  .base_filter_form {
    flex: 1;
  }

  .base_filter_btn {
    flex-shrink: 0;
    margin-left: 24px;
    width: 176px;
  }
}
</style>
