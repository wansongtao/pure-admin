<script lang="ts" setup>
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import type { EChartsOption, PieSeriesOption } from 'echarts'

defineOptions({
  name: 'PieChart'
})

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

const $props = defineProps<{
  options?: EChartsOption
  data?: PieSeriesOption['data']
}>()

const option: EChartsOption = {
  title: {
    text: '',
    subtext: '',
    left: 'center',
    top: '35%',
    textStyle: {
      color: '#666',
      fontSize: 12
    },
    subtextStyle: {
      color: '#333',
      fontSize: 18
    },
    textVerticalAlign: 'middle'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} ({d}%) <br/>￥{c}'
  },
  legend: {
    type: 'scroll',
    bottom: 0,
    left: 'center',
    icon: 'circle',
    textStyle: {
      color: '#666',
      fontSize: 12
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '67%'],
      center: ['50%', '43%'],
      percentPrecision: 0,
      bottom: 20,
      label: {
        formatter: '{b} ({d}%) \n￥{c}',
        color: '#666'
      }
    }
  ]
}

const pieChartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
const setChartOption = () => {
  if (!myChart) {
    return
  }

  if ($props.options) {
    myChart.setOption($props.options)
  }
  if ($props.data) {
    myChart.setOption({
      series: [
        {
          data: $props.data
        }
      ]
    })
  }
}

onMounted(() => {
  if (!pieChartRef.value) {
    return
  }

  myChart = echarts.init(pieChartRef.value)
  myChart.setOption(option)
  setChartOption()

  const resizeObserver = new ResizeObserver(() => {
    myChart?.resize()
  })
  resizeObserver.observe(pieChartRef.value)
})

watch(
  [() => $props.data, () => $props.options],
  ([data, options]) => {
    if (!myChart || (!data && !options)) {
      return
    }

    setChartOption()
  },
  {
    deep: true
  }
)
</script>

<template>
  <div ref="pieChartRef" class="chart"></div>
</template>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
