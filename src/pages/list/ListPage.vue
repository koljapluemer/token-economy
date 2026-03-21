<script setup lang="ts">
import { useActions } from '../../entities/action/action'
import ActionRow from './ActionRow.vue'

const actions = useActions()
</script>

<template>
  <main class="p-4">
    <h1 class="text-lg font-semibold mb-4">
      Actions
    </h1>
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tokens</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <ActionRow
            v-for="action in actions"
            :key="action.id!"
            :action="action"
          />
          <ActionRow :action="null" />
        </tbody>
      </table>
    </div>
  </main>
</template>
