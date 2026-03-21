<script setup lang="ts">
import { useLoggedActions } from '../../entities/logged-action/loggedAction'
import LogItem from './LogItem.vue'

const loggedActions = useLoggedActions()
</script>

<template>
  <main class="p-4">
    <h1 class="text-lg font-semibold mb-4">
      Log
    </h1>
    <div
      v-if="loggedActions.length === 0"
      class="text-center opacity-40 mt-8"
    >
      No actions logged yet.
    </div>
    <ul class="flex flex-col divide-y divide-base-200">
      <LogItem
        v-for="entry in loggedActions"
        :key="entry.id!"
        :entry="entry"
      />
    </ul>
  </main>
</template>
