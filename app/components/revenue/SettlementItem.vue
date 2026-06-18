<template>
  <div class="flex items-center gap-3 px-4 py-3">
    <div class="text-xl">{{ record.icon }}</div>
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium text-hana-text">{{ record.name }}</div>
      <div class="text-xs text-hana-muted mt-0.5">{{ record.date }} · {{ record.detail }}</div>
    </div>
    <div
      class="text-sm font-bold flex-shrink-0"
      :class="record.amount >= 0 ? 'text-hana-success' : 'text-hana-danger'"
    >
      {{ record.amount >= 0 ? '+' : '' }}NT${{ Math.abs(record.amount).toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SettlementRecord } from '~/data/revenue'

defineProps<{
  record: SettlementRecord
}>()
</script>
