<template>
  <div class="p-4 space-y-5">
    <h2 class="section-title">職人帳號管理</h2>
    <p class="section-subtitle">新增、編輯、停用職人帳號</p>

    <!-- Add form -->
    <AdminArtisanForm @created="refresh()" />

    <!-- Artisan list -->
    <div class="space-y-3">
      <h3 class="text-sm font-bold text-hana-text">職人列表（{{ artisans.length }} 人）</h3>
      <div v-if="artisans.length === 0" class="card p-8 text-center text-hana-muted text-sm">
        尚未新增任何職人
      </div>
      <div v-else class="card divide-y divide-hana-border">
        <div
          v-for="artisan in artisans"
          :key="artisan.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-hana-text">{{ artisan.name }}</span>
              <span class="badge" :class="artisan.isActive ? 'badge-approved' : 'badge-cancelled'">
                {{ artisan.isActive ? '啟用中' : '已停用' }}
              </span>
            </div>
            <div class="text-xs text-hana-muted mt-0.5">{{ artisan.phone }}</div>
            <div v-if="stats[artisan.id]" class="text-xs text-hana-muted mt-0.5">
              送審 {{ stats[artisan.id]?.totalSubmissions }} 次 · 通過率
              {{ stats[artisan.id]?.approvalRate }}% · 退件率
              {{ stats[artisan.id]?.rejectionRate }}%
            </div>
          </div>
          <button
            class="text-xs px-3 py-1.5 rounded-lg transition-colors"
            :class="
              artisan.isActive
                ? 'bg-hana-danger/10 text-hana-danger active:bg-hana-danger/20'
                : 'bg-hana-success/10 text-hana-success active:bg-hana-success/20'
            "
            @click="handleToggle(artisan)"
          >
            {{ artisan.isActive ? '停用' : '啟用' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.message"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-hana-text text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

definePageMeta({
  middleware: ['admin'],
})

const { fetchArtisans, refreshArtisans, toggleActive, fetchArtisanStats } = useArtisans()

const artisans = ref<Profile[]>([])
const stats = ref<
  Record<string, { totalSubmissions: number; approvalRate: number; rejectionRate: number }>
>({})
const toast = useToast()

async function loadStats(list: Profile[]) {
  const results = await Promise.all(list.map((a) => fetchArtisanStats(a.id)))
  list.forEach((a, i) => {
    stats.value[a.id] = results[i]!
  })
}

async function refresh() {
  artisans.value = await refreshArtisans()
  await loadStats(artisans.value)
  toast.show('已更新')
}

async function handleToggle(artisan: Profile) {
  const newState = !artisan.isActive
  await toggleActive(artisan.id, newState)
  toast.show(newState ? `已啟用 ${artisan.name}` : `已停用 ${artisan.name}`)
  await refresh()
}

onMounted(async () => {
  artisans.value = await fetchArtisans()
  await loadStats(artisans.value)
})
</script>
