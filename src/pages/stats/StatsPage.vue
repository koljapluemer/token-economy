<script setup lang="ts">
import { computed, ref } from 'vue'
import DailyBalanceChart from './DailyBalanceChart.vue'
import { useDailyTokenRanges } from './dailyTokenRange'

type RangeMode = '14-days' | 'all-time'

const dailyTokenRanges = useDailyTokenRanges()
const rangeMode = ref<RangeMode>('14-days')

const visibleRanges = computed(() => {
  if (rangeMode.value === 'all-time') {
    return dailyTokenRanges.value
  }

  return dailyTokenRanges.value.slice(-14)
})

const chartKey = computed(() => `${rangeMode.value}-${visibleRanges.value.length}`)
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-lg font-semibold">
          Stats
        </h1>
        <p class="text-sm opacity-60">
          Daily token balance range.
        </p>
      </div>

      <div class="join">
        <button
          class="btn btn-sm join-item"
          :class="rangeMode === '14-days' ? 'btn-primary' : 'btn-ghost'"
          type="button"
          @click="rangeMode = '14-days'"
        >
          14 days
        </button>
        <button
          class="btn btn-sm join-item"
          :class="rangeMode === 'all-time' ? 'btn-primary' : 'btn-ghost'"
          type="button"
          @click="rangeMode = 'all-time'"
        >
          All time
        </button>
      </div>
    </div>

    <div
      v-if="dailyTokenRanges.length === 0"
      class="text-center opacity-40 mt-8"
    >
      No logged actions yet.
    </div>
    <div
      v-else
      class="rounded-box border border-base-200 bg-base-100 p-4"
    >
      <div class="mb-3 text-sm opacity-60">
        Showing {{ visibleRanges.length }} calendar days.
      </div>
      <DailyBalanceChart
        :key="chartKey"
        :points="visibleRanges"
      />
    </div>
  </main>
</template>
