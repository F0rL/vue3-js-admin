import { init, use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { tryOnUnmounted, useResizeObserver } from '@vueuse/core'
import { isRef, nextTick, onActivated, onDeactivated, ref, watch } from 'vue'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
])

export function useECharts(domRef, options) {
  const loading = ref(true)
  let chartInstance = null

  function disposeChart() {
    chartInstance?.dispose()
    chartInstance = null
  }

  function createChart() {
    disposeChart()
    if (!domRef.value) return
    chartInstance = init(domRef.value)
    loading.value = false
    const opts = isRef(options) ? options.value : options
    chartInstance.setOption(opts)
  }

  if (isRef(options)) {
    watch(options, val => {
      chartInstance?.setOption(val)
    })
  }

  watch(domRef, el => {
    if (el) nextTick(createChart)
  })

  useResizeObserver(domRef, () => {
    chartInstance?.resize()
  })

  tryOnUnmounted(disposeChart)

  onActivated(() => {
    chartInstance?.resize()
  })

  onDeactivated(disposeChart)

  return { loading }
}