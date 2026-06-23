<template>
  <div class="p-4">
    <h2 class="section-title">掃描訂單 QR Code</h2>
    <p class="section-subtitle">對準作品包裝上的 QR Code，自動載入製作講義</p>

    <div class="mt-6 flex justify-center">
      <div
        class="relative w-64 h-64 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden"
      >
        <!-- Corner brackets -->
        <div
          class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl"
        />
        <div
          class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr"
        />
        <div
          class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl"
        />
        <div
          class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br"
        />

        <!-- Scan line animation -->
        <div
          v-if="isScanning"
          class="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-scan"
        />

        <!-- Camera icon -->
        <Icon name="lucide:camera" class="w-12 h-12 text-white/30" />
      </div>
    </div>

    <div class="text-center mt-4 space-y-1">
      <p class="text-sm text-hana-muted">將相機對準訂單袋上的 QR Code</p>
      <p class="text-sm text-hana-muted">系統將自動讀取製作資訊與講義</p>
    </div>

    <div class="mt-8 space-y-3">
      <button class="btn-primary" :disabled="isScanning" @click="simulateScan">
        {{ isScanning ? '掃描中...' : '模擬掃描（示範）' }}
      </button>

      <button v-if="!showManualInput" class="btn-secondary" @click="showManualInput = true">
        手動輸入訂單編號
      </button>

      <div v-else class="card p-4 space-y-3">
        <input
          v-model="manualOrderId"
          type="text"
          placeholder="輸入訂單編號"
          class="w-full px-4 py-2.5 rounded-lg border border-hana-border text-sm focus:outline-none focus:border-hana-warning"
        />
        <button class="btn-primary" @click="goToOrder">確認</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultOrderId } from '~/data/orders'

const router = useRouter()
const isScanning = ref(false)
const showManualInput = ref(false)
const manualOrderId = ref(defaultOrderId)

async function simulateScan() {
  isScanning.value = true
  await new Promise((r) => setTimeout(r, 1200))
  isScanning.value = false
  router.push(`/orders/${defaultOrderId}`)
}

function goToOrder() {
  router.push(`/orders/${defaultOrderId}`)
}
</script>

<style scoped>
@keyframes scan {
  0% {
    top: 1.5rem;
  }
  50% {
    top: calc(100% - 1.5rem);
  }
  100% {
    top: 1.5rem;
  }
}
.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
