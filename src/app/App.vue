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
