<script setup lang="ts">
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartConfigurationCustomTypesPerDataset,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DailyTokenRange } from './dailyTokenRange'

type BalanceChartType = 'bar' | 'line'

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const props = defineProps<{
  points: DailyTokenRange[]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)

let chart: Chart<BalanceChartType> | null = null

watch(
  () => props.points,
  () => {
    renderChart()
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  renderChart()
})

onBeforeUnmount(() => {
  chart?.destroy()
  chart = null
})

function renderChart() {
  if (!canvas.value) {
    return
  }

  const labels = props.points.map((point) => point.shortLabel)
  const data: ChartConfigurationCustomTypesPerDataset<BalanceChartType, (number | [number, number])[], string>['data'] = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Open to close',
        data: props.points.map((point) => [point.openBalance, point.closeBalance]),
        backgroundColor: props.points.map((point) => {
          if (point.closeBalance > point.openBalance) {
            return 'rgba(34, 197, 94, 0.35)'
          }

          if (point.closeBalance < point.openBalance) {
            return 'rgba(239, 68, 68, 0.35)'
          }

          return 'rgba(148, 163, 184, 0.28)'
        }),
        borderColor: props.points.map((point) => {
          if (point.closeBalance > point.openBalance) {
            return '#22c55e'
          }

          if (point.closeBalance < point.openBalance) {
            return '#ef4444'
          }

          return '#94a3b8'
        }),
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: 2,
        barPercentage: 0.72,
        categoryPercentage: 0.84,
        order: 1,
      },
      {
        type: 'line',
        label: 'Daily low',
        data: props.points.map((point) => point.minBalance),
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.14)',
        borderWidth: 2,
        pointRadius: props.points.length > 45 ? 0 : 2,
        pointHoverRadius: 4,
        tension: 0.25,
        order: 2,
      },
      {
        type: 'line',
        label: 'Daily high',
        data: props.points.map((point) => point.maxBalance),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.14)',
        borderWidth: 2,
        pointRadius: props.points.length > 45 ? 0 : 2,
        pointHoverRadius: 4,
        tension: 0.25,
        order: 3,
      },
    ],
  }

  const options: ChartOptions<BalanceChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          title(items) {
            const point = props.points[items[0].dataIndex]
            return point?.fullLabel ?? ''
          },
          label(item: TooltipItem<BalanceChartType>) {
            const point = props.points[item.dataIndex]
            if (!point) {
              return ''
            }

            if (item.dataset.label === 'Open to close') {
              return `Open ${point.openBalance}, close ${point.closeBalance}`
            }

            if (item.dataset.label === 'Daily low') {
              return `Low ${point.minBalance}`
            }

            if (item.dataset.label === 'Daily high') {
              return `High ${point.maxBalance}`
            }

            return `${item.dataset.label ?? 'Value'} ${item.formattedValue}`
          },
        },
      },
    },
  }

  chart?.destroy()

  chart = new Chart(canvas.value, {
    data,
    options,
  })
}
</script>

<template>
  <div class="h-80">
    <canvas ref="canvas" />
  </div>
</template>
