<script lang="ts" setup>
import { createExcelFile, type IConfig } from '@/plugins/excel'
import { downloadFile } from '@/plugins/download'
import { exportUserInfo } from '@/api/user'
import dayjs from 'dayjs'

import type { IExportProfile } from '@/types/api/common'

const createConfig = (data: IExportProfile[]) => {
  const fields: (keyof IExportProfile)[] = [
    'userName',
    'nickName',
    'gender',
    'email',
    'phone',
    'birthday',
  ]
  const config: IConfig = {
    fields,
    data,
    attrs: [],
    headers: [
      ['用户信息表'],
      ['主要信息', '', '其他信息'],
      ['用户名', '用户昵称', '性别', '邮箱', '手机号', '生日']
    ],
    merges: [
      { row: 1, col: 1, rowspan: 0, colspan: fields.length - 1 }, // 显示标题 '用户信息表'
      { row: 2, col: 1, rowspan: 0, colspan: 1 }, // 显示表头 '主页信息'
      { row: 2, col: 3, rowspan: 0, colspan: 3 } // 显示表头 '其他信息'
    ],
    sheetName: '用户信息表',
    columnsWidth: Array.from({ length: fields.length }, () => 20)
  }

  config?.fields?.forEach((item, index) => {
    if (item === 'birthday') {
      // 设置日期格式
      config?.attrs?.push({
        rowStart: 4,
        rowEnd: config.data.length + 3,
        colStart: index + 1,
        colEnd: index + 1,
        attr: {
          numFmt: 'yyyy"年"mm"月"dd"日"'
        }
      })
      return
    }
  })

  // 设置单元格样式
  config?.attrs?.push({
    rowStart: 1,
    rowEnd: config.data.length + 3,
    colStart: 1,
    colEnd: config?.fields?.length,
    attr: {
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  // 设置表头标题样式
  config?.attrs?.push({
    rowStart: 1,
    rowEnd: 1,
    colStart: 1,
    colEnd: config?.fields?.length,
    attr: {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e2efda' }
      },
      font: {
        size: 20,
        bold: true
      }
    }
  })

  // 设置表头填充颜色，字体加粗
  config?.attrs?.push({
    rowStart: 2,
    rowEnd: 3,
    colStart: 1,
    colEnd: config?.fields?.length,
    attr: {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' }
      },
      font: {
        bold: true
      }
    }
  })

  return config
}

const loading = ref(false)
const handleExport = async () => {
  loading.value = true
  const [, result] = await exportUserInfo()
  if (!result) {
    loading.value = false
    return
  }

  const data = result.data.map((item) => {
    return {
      ...item,
      birthday: item.birthday ? dayjs(item.birthday).format('YYYY-MM-DD') : ''
    }
  })
  const config = createConfig(data)
  createExcelFile(config).then((buffer) => {
    loading.value = false
    if (!buffer) {
      return
    }
    downloadFile(buffer, '用户信息表.xlsx')
  })
}
</script>

<template>
  <a-button type="primary" :loading="loading" @click="handleExport">导出</a-button>
</template>

<style lang="scss" scoped></style>
