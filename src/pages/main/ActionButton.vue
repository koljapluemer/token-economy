<script setup lang="ts">
import { ref } from 'vue'
import type { Action } from '../../entities/action/action'
import { logAction } from '../../entities/logged-action/loggedAction'

const props = defineProps<{ action: Action }>()

const floats = ref<{ id: number; text: string }[]>([])
let nextId = 0

async function handleClick() {
  await logAction(props.action.name, props.action.tokens)
  const id = nextId++
  const text = props.action.tokens > 0 ? `+${props.action.tokens}` : `${props.action.tokens}`
  floats.value.push({ id, text })
  setTimeout(() => {
    floats.value = floats.value.filter((f) => f.id !== id)
  }, 900)
}
</script>

<template>
  <button
    class="btn btn-lg relative flex-col h-auto py-3 gap-0.5 active:scale-95 transition-transform"
    :class="action.tokens >= 0 ? 'btn-success' : 'btn-error'"
    @click="handleClick"
  >
    <span class="font-semibold text-sm leading-tight max-w-full truncate">{{ action.name }}</span>
    <span class="text-xs opacity-70">{{ action.tokens > 0 ? '+' : '' }}{{ action.tokens }}</span>
    <span
      v-for="f in floats"
      :key="f.id"
      class="float-label"
    >{{ f.text }}</span>
  </button>
</template>

<style scoped>
.float-label {
  position: absolute;
  top: 0;
  left: 50%;
  font-weight: bold;
  font-size: 1.1rem;
  pointer-events: none;
  animation: float-up 0.9s ease-out forwards;
}

@keyframes float-up {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-52px);
  }
}
</style>
