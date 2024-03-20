<script lang="ts" setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import type { EChartsOption, LineSeriesOption } from 'echarts'

defineOptions({
  name: 'LineChart'
})

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

const $props = defineProps<{
  defaultUnit?: string
  data?: {
    xAxisData: string[]
    series: LineSeriesOption[]
  }
  options?: EChartsOption
}>()

const option: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#fefeff' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#dbefff' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        },
        opacity: 0.6
      }
    },
    padding: 8,
    valueFormatter: (value) => {
      return value + ($props.defaultUnit ?? '')
    }
  },
  legend: {
    icon: 'circle',
    left: 'right',
    textStyle: {
      color: '#666666'
    }
  },
  grid: {
    top: 30,
    bottom: 20,
    left: '8%',
    right: 0
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f5f6f9',
        type: 'dashed'
      }
    },
    axisLine: {
      onZero: false,
      lineStyle: {
        color: '#f5f6f9'
      }
    },
    axisLabel: {
      color: '#999999'
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f5f6f9',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#999999',
      formatter: '{value} 次'
    }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      }
    },
    {
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      }
    }
  ]
}

const lineChartRef = ref<HTMLElement | null>(null)
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
      xAxis: {
        data: $props.data.xAxisData
      },
      series: $props.data.series
    })
  }
}

onMounted(() => {
  if (!lineChartRef.value) {
    return
  }

  myChart = echarts.init(lineChartRef.value)
  myChart.setOption(option)
  setChartOption()

  const resizeObserver = new ResizeObserver(() => {
    myChart?.resize()
  })
  resizeObserver.observe(lineChartRef.value)
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
  <div ref="lineChartRef" class="chart"></div>
</template>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
