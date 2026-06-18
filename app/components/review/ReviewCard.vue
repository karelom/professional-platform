<template>
  <div
    class="card p-4 transition-all duration-300"
    :class="reviewStatusConfig[status].cardClass"
  >
    <div class="flex items-start justify-between">
      <div class="flex gap-3">
        <div class="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center text-2xl flex-shrink-0">
          {{ item.emoji }}
        </div>
        <div>
          <div class="text-sm font-bold text-hana-text">{{ item.productName }} · {{ item.artisanName }}</div>
          <div class="text-xs text-hana-muted mt-0.5">
            {{ status === 'pending' ? '上傳' : '審核' }}時間：{{ item.uploadTime }}
          </div>
        </div>
      </div>
      <UiStatusBadge :label="reviewStatusConfig[status].label" :color-class="reviewStatusConfig[status].class" />
    </div>

    <!-- Photo thumbnails -->
    <div class="flex gap-2 mt-3">
      <button
        v-for="n in item.imageCount"
        :key="n"
        class="w-16 h-16 rounded-lg bg-hana-cream border border-hana-border flex items-center justify-center overflow-hidden"
        @click="$emit('viewPhoto', n)"
      >
        <Icon name="lucide:image" class="w-6 h-6 text-hana-border" />
      </button>
    </div>

    <!-- Approval note -->
    <div v-if="status === 'approved' && item.approvalNote" class="mt-3 text-xs text-emerald-700">
      ✅ {{ item.approvalNote }}
    </div>

    <!-- Action buttons for pending items -->
    <div v-if="status === 'pending'" class="flex gap-2 mt-3">
      <button
        class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-hana-success/10 text-hana-success active:bg-hana-success/20 transition-colors"
        @click="$emit('approve')"
      >
        ✓ 通過
      </button>
      <button
        class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-hana-danger/10 text-hana-danger active:bg-hana-danger/20 transition-colors"
        @click="$emit('reject')"
      >
        × 退件
      </button>
      <button
        class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-hana-wine/10 text-hana-wine active:bg-hana-wine/20 transition-colors"
        @click="$emit('notify')"
      >
        📦 寄件通知
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReviewItem, ReviewStatus } from '~/data/reviews'
import { reviewStatusConfig } from '~/data/reviews'

defineProps<{
  item: ReviewItem
  status: ReviewStatus
}>()

defineEmits<{
  approve: []
  reject: []
  notify: []
  viewPhoto: [index: number]
}>()
</script>
