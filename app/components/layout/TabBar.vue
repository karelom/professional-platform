<template>
  <nav class="bg-gradient-to-r from-hana-header to-hana-header-light px-3 pt-1 pb-safe">
    <div class="flex gap-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="tab-item"
        :class="isActive(tab.to) ? 'tab-active' : 'tab-inactive'"
      >
        <Icon :name="tab.icon" class="w-4 h-4" />
        <span class="text-xs font-medium">{{ tab.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAdmin } = useAuth()

const tabs = computed(() => {
  const common = [
    { icon: 'lucide:home', label: '首頁', to: '/' },
    { icon: 'lucide:camera', label: '掃描接案', to: '/scan' },
  ]

  if (isAdmin.value) {
    return [
      ...common,
      { icon: 'lucide:check-square', label: '審核管理', to: '/review' },
      { icon: 'lucide:settings', label: '管理', to: '/admin' },
    ]
  }

  return [
    ...common,
    { icon: 'lucide:eye', label: '審核狀態', to: '/review' },
    { icon: 'lucide:coins', label: '我的分潤', to: '/revenue' },
  ]
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.tab-item {
  @apply flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all duration-200;
}
.tab-active {
  @apply bg-white text-hana-text shadow-sm;
}
.tab-inactive {
  @apply text-white/70 hover:text-white;
}
</style>
