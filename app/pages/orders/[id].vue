<template>
  <div class="p-4 space-y-5">
    <!-- Back button -->
    <button class="flex items-center gap-1 text-sm text-hana-muted" @click="router.back()">
      <Icon name="lucide:arrow-left" class="w-4 h-4" />
      <span>返回</span>
      <span class="ml-2 text-hana-text">訂單 {{ order?.id ? `#${order.id}` : '' }}</span>
    </button>

    <template v-if="order">
      <OrderHeader :order="order" />

      <div class="card p-4">
        <OrderInstructionTabs :order="order" />
      </div>

      <OrderPhotoUpload />

      <div class="space-y-3 pb-6">
        <button class="btn-primary" @click="submitReview">
          📤 送出審核申請
        </button>
        <button class="btn-secondary" @click="saveDraft">
          暫存草稿
        </button>
      </div>
    </template>

    <div v-else class="text-center py-20 text-hana-muted">
      <p>找不到此訂單</p>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-hana-text text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { orders } from '~/data/orders'

const route = useRoute()
const router = useRouter()

const order = computed(() => orders[route.params.id as string])

const toastMessage = ref('')
function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => { toastMessage.value = '' }, 2000)
}

function submitReview() {
  showToast('✅ 已送出審核申請！')
}

function saveDraft() {
  showToast('📝 已暫存草稿')
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 1rem);
}
</style>
