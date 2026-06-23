<template>
  <div class="card p-4">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-bold text-hana-text">{{ data.name }} × {{ data.qty }}</div>
        <div class="text-xs text-hana-muted mt-0.5">
          訂單 {{ data.orderId }} · {{ data.deadline }}
        </div>
      </div>
      <div class="text-right">
        <div class="text-base font-bold text-hana-gold">
          NT${{ data.totalPrice.toLocaleString() }}
        </div>
        <div class="text-[10px] text-hana-muted">{{ data.unitLabel }}</div>
      </div>
    </div>

    <div class="text-xs text-hana-muted mt-2">{{ data.progressLabel }}</div>

    <div class="mt-3">
      <UiProgressStepper :current-step="data.currentStep" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderProgressData } from '~/data/revenue'

defineProps<{
  data: OrderProgressData
}>()
</script>
