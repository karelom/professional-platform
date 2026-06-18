<template>
  <div class="card p-4">
    <div class="flex gap-3">
      <div class="w-14 h-14 rounded-xl bg-pink-50 flex items-center justify-center text-3xl flex-shrink-0">
        {{ order.emoji }}
      </div>
      <div class="flex-1">
        <h3 class="text-base font-bold text-hana-text">{{ order.name }}</h3>
        <div class="text-xs text-hana-muted mt-1 space-x-2">
          <span>數量：{{ order.qty }} 件</span>
          <span>|</span>
          <span>單件分潤：NT${{ order.unitPrice }}</span>
        </div>
        <div class="text-xs text-hana-muted mt-0.5">
          截止日：{{ order.deadline }}
        </div>
        <div class="flex gap-2 mt-2">
          <span
            v-for="tag in order.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderDetail } from '~/data/orders'

defineProps<{
  order: OrderDetail
}>()
</script>
