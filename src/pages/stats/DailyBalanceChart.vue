<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DailyTokenRange } from './dailyTokenRange'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

const props = defineProps<{
  points: DailyTokenRange[]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)

let chart: Chart<'line'> | null = null

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
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Minimum',
        data: props.points.map((point) => point.minBalance),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderWidth: 2,
        pointRadius: props.points.length > 45 ? 0 : 2,
        pointHoverRadius: 4,
        tension: 0.25,
      },
      {
        label: 'Maximum',
        data: props.points.map((point) => point.maxBalance),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
        borderWidth: 2,
        pointRadius: props.points.length > 45 ? 0 : 2,
        pointHoverRadius: 4,
        tension: 0.25,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
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
        },
      },
    },
  }

  if (chart) {
    chart.data = data
    chart.options = options
    chart.update()
    return
  }

  chart = new Chart(canvas.value, {
    type: 'line',
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
