<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import type { LoggedAction } from '../../entities/logged-action/loggedAction'
import { deleteLoggedAction } from '../../entities/logged-action/loggedAction'

const props = defineProps<{ entry: LoggedAction }>()

const isHolding = ref(false)
let holdTimer: ReturnType<typeof setTimeout> | null = null

function startHold() {
  isHolding.value = true
  holdTimer = setTimeout(async () => {
    if (props.entry.id != null) {
      await deleteLoggedAction(props.entry.id)
    }
  }, 3000)
}

function cancelHold() {
  isHolding.value = false
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
}

function formatDate(date: Date) {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}
</script>

<template>
  <li class="flex items-center gap-3 py-2.5">
    <div class="flex-1 min-w-0">
      <span class="font-medium">{{ entry.actionName }}</span>
      <span class="text-xs opacity-40 ml-2">{{ formatDate(entry.timestamp) }}</span>
    </div>
    <span
      class="badge badge-sm shrink-0"
      :class="entry.tokens >= 0 ? 'badge-success' : 'badge-error'"
    >
      {{ entry.tokens > 0 ? '+' : '' }}{{ entry.tokens }}
    </span>
    <button
      class="btn btn-ghost btn-sm btn-circle relative overflow-hidden shrink-0"
      :class="{ 'text-error': isHolding }"
      @mousedown="startHold"
      @mouseup="cancelHold"
      @mouseleave="cancelHold"
      @touchstart.prevent="startHold"
      @touchend="cancelHold"
    >
      <span
        class="hold-progress"
        :class="{ active: isHolding }"
      />
      <Trash2
        :size="16"
        class="relative"
      />
    </button>
  </li>
</template>

<style scoped>
.hold-progress {
  position: absolute;
  inset: 0;
  background: rgba(239, 68, 68, 0.2);
  transform: scaleX(0);
  transform-origin: left;
  border-radius: inherit;
}

.hold-progress.active {
  transform: scaleX(1);
  transition: transform 3s linear;
}
</style>
