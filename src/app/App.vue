<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, List, ScrollText } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { to: '/', icon: Home, label: 'Tokens' },
  { to: '/list', icon: List, label: 'Actions' },
  { to: '/log', icon: ScrollText, label: 'Log' },
]
</script>

<template>
  <div class="pb-16">
    <RouterView />
    <footer class="text-xs text-base-content/40 p-4 flex flex-col gap-1">
      <p>
        Made by <a class="underline" href="https://koljasam.com/" target="_blank">Kolja Sam</a>.
        Your data stays on your device.
        I track page views with <a href="https://www.goatcounter.com/" class="underline" target="_blank">goatcounter</a>, nothing else.
      </p>
      <p>
        <a href="https://ko-fi.com/S6S81CWUVD" target="_blank" rel="noopener" class="underline">Buy me a coffee</a>
        ·
        <a href="https://github.com/koljapluemer/token-economy" class="underline" target="_blank">Source</a>
      </p>
    </footer>
  </div>
  <nav class="dock">
    <RouterLink
      v-for="{ to, icon: Icon, label } in tabs"
      :key="to"
      :to="to"
      :class="{ 'dock-active': route.path === to }"
    >
      <Component :is="Icon" :size="22" />
      <span class="dock-label">{{ label }}</span>
    </RouterLink>
  </nav>
</template>
