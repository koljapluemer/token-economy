<script setup lang="ts">
import { useActions } from '../../entities/action/action'
import { useTokenBalance } from '../../entities/logged-action/loggedAction'
import ActionButton from './ActionButton.vue'

const actions = useActions()
const balance = useTokenBalance()
</script>

<template>
  <main class="p-4 flex flex-col gap-6">
    <div class="text-center pt-8 pb-4">
      <div class="text-xs uppercase tracking-widest opacity-40 mb-1">
        Balance
      </div>
      <div
        class="text-8xl font-bold tabular-nums transition-colors duration-500"
        :class="balance >= 0 ? 'text-success' : 'text-error'"
      >
        {{ balance }}
      </div>
    </div>

    <div
      v-if="actions.length === 0"
      class="text-center opacity-40 mt-4"
    >
      No actions yet — add some in the Actions tab.
    </div>
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 gap-3"
    >
      <ActionButton
        v-for="action in actions"
        :key="action.id!"
        :action="action"
      />
    </div>
  </main>
</template>
