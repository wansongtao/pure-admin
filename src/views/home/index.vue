<script lang="ts" setup>
defineOptions({
  name: 'HomeView'
})

const sales = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' }
]
const totalSales = sales.reduce((prev, curr) => prev + curr.value, 0)
</script>

<template>
  <div class="container">
    <div class="container_header">
      <a-card style="flex: 1">
        <pie-chart
          style="height: 300px"
          :options="{ title: { text: '营销金额', subtext: '¥' + totalSales } }"
          :data="sales"
        />
      </a-card>
      <a-card style="flex: 1; margin-left: 20px">
        <line-chart
          style="height: 300px"
          default-unit="次"
          :data="{
            xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [
              { name: '点赞量', data: [120, 132, 101, 134, 90, 230, 210] },
              { name: '访问量', data: [220, 182, 191, 234, 290, 330, 310] }
            ]
          }"
        />
      </a-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 20px;

  .container_header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
