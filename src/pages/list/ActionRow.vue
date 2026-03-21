<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import type { Action } from '../../entities/action/action'
import { addAction, updateAction, deleteAction } from '../../entities/action/action'

const props = defineProps<{ action: Action | null }>()

const name = ref(props.action?.name ?? '')
const tokens = ref(props.action?.tokens ?? 0)

async function saveOnBlur() {
  const trimmedName = name.value.trim()
  if (props.action === null) {
    if (!trimmedName) return
    await addAction(trimmedName, Math.trunc(tokens.value))
    name.value = ''
    tokens.value = 0
  } else {
    if (!trimmedName) return
    await updateAction(props.action.id!, {
      name: trimmedName,
      tokens: Math.trunc(tokens.value),
    })
  }
}

async function handleDelete() {
  if (props.action?.id != null) {
    await deleteAction(props.action.id)
  }
}
</script>

<template>
  <tr>
    <td>
      <input
        v-model="name"
        type="text"
        class="input input-sm input-ghost w-full"
        placeholder="Action name"
        @blur="saveOnBlur"
      >
    </td>
    <td class="w-28">
      <input
        v-model.number="tokens"
        type="number"
        step="1"
        class="input input-sm input-ghost w-full"
        placeholder="0"
        @blur="saveOnBlur"
      >
    </td>
    <td class="w-10">
      <button
        v-if="action"
        class="btn btn-ghost btn-sm btn-circle"
        @click="handleDelete"
      >
        <Trash2 :size="16" />
      </button>
    </td>
  </tr>
</template>
