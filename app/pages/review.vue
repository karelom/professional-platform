<template>
  <div class="p-4">
    <h2 class="section-title">審核管理中心</h2>
    <p class="section-subtitle">本週 {{ reviewItems.length }} 件待審核</p>

    <!-- Filter tabs -->
    <div class="flex gap-2 mt-4">
      <button
        v-for="f in filters"
        :key="f.key"
        class="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
        :class="
          activeFilter === f.key
            ? 'bg-hana-text text-white'
            : 'bg-hana-card text-hana-muted border border-hana-border'
        "
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Review cards -->
    <div class="mt-4 space-y-3">
      <TransitionGroup name="card-list">
        <ReviewCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :status="statusOverrides[item.id] ?? item.status"
          @approve="setStatus(item.id, 'approved')"
          @reject="setStatus(item.id, 'rejected')"
          @notify="toast.show('📦 已通知職人寄件')"
          @view-photo="openLightbox"
        />
      </TransitionGroup>

      <div v-if="filteredItems.length === 0" class="text-center py-12 text-hana-muted text-sm">
        此分類目前沒有項目
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="showLightbox"
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
        @click="showLightbox = false"
      >
        <div class="bg-hana-cream rounded-2xl p-4 max-w-sm w-full text-center">
          <Icon name="lucide:image" class="w-24 h-24 text-hana-border mx-auto" />
          <p class="text-sm text-hana-muted mt-3">Demo 模式：實際照片將在正式版顯示</p>
          <button class="btn-secondary mt-4" @click.stop="showLightbox = false">關閉</button>
        </div>
      </div>
    </Transition>

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
import { reviews, type ReviewStatus } from '~/data/reviews'

const filters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待審核' },
  { key: 'done', label: '已完成' },
] as const

type FilterKey = (typeof filters)[number]['key']

const activeFilter = ref<FilterKey>('all')
const statusOverrides = ref<Record<string, ReviewStatus>>({})

const reviewItems = computed(() => reviews)

const filteredItems = computed(() => {
  return reviewItems.value.filter((item) => {
    const status = statusOverrides.value[item.id] ?? item.status
    if (activeFilter.value === 'all') return true
    if (activeFilter.value === 'pending') return status === 'pending'
    if (activeFilter.value === 'done') return status === 'approved' || status === 'rejected'
    return true
  })
})

function setStatus(id: string, status: ReviewStatus) {
  statusOverrides.value[id] = status
  toast.show(status === 'approved' ? '✅ 已通過審核' : '❌ 已退件')
}

const showLightbox = ref(false)
function openLightbox() {
  showLightbox.value = true
}

const toast = useToast()
</script>
