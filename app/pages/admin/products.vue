<template>
  <div class="p-4 space-y-5">
    <h2 class="section-title">商品模板管理</h2>
    <p class="section-subtitle">管理講義模板，建立訂單時從此選取</p>

    <!-- Add / Edit form -->
    <AdminProductForm
      :product="editingProduct ?? undefined"
      @saved="handleSaved"
      @cancel="editingProduct = null"
    />

    <!-- Product list -->
    <div class="space-y-3">
      <h3 class="text-sm font-bold text-hana-text">模板列表（{{ products.length }} 項）</h3>
      <div v-if="products.length === 0" class="card p-8 text-center text-hana-muted text-sm">
        尚未新增任何商品模板
      </div>
      <div v-else class="space-y-3">
        <div v-for="product in products" :key="product.id" class="card p-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span v-if="product.emoji" class="text-xl">{{ product.emoji }}</span>
              <span class="text-sm font-medium text-hana-text">{{ product.name }}</span>
            </div>
            <div class="flex gap-1.5">
              <button
                class="text-xs px-3 py-1.5 rounded-lg bg-hana-wine/10 text-hana-wine active:bg-hana-wine/20 transition-colors"
                @click="handleEdit(product)"
              >
                編輯
              </button>
              <button
                class="text-xs px-3 py-1.5 rounded-lg bg-hana-danger/10 text-hana-danger active:bg-hana-danger/20 transition-colors"
                @click="handleDelete(product)"
              >
                刪除
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="text-xs bg-hana-cream text-hana-muted px-2 py-0.5 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Instruction summary -->
          <div class="text-xs text-hana-muted space-x-3">
            <span>{{ product.steps?.length ?? 0 }} 步驟</span>
            <span>{{ product.notes?.length ?? 0 }} 注意事項</span>
            <span>{{ product.quality?.length ?? 0 }} 品質標準</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toastMsg"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-hana-text text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  middleware: ['admin'],
})

const { fetchProducts, deleteProduct } = useProducts()

const products = ref<Product[]>([])
const editingProduct = ref<Product | null>(null)
const toastMsg = ref('')

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, 2000)
}

async function refresh() {
  products.value = await fetchProducts()
}

function handleEdit(product: Product) {
  editingProduct.value = product
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleDelete(product: Product) {
  if (!confirm(`確定要刪除「${product.name}」嗎？此操作無法還原。`)) return
  try {
    await deleteProduct(product.id)
    showToast(`已刪除「${product.name}」`)
    await refresh()
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : '刪除失敗')
  }
}

async function handleSaved() {
  editingProduct.value = null
  showToast('已儲存')
  await refresh()
}

onMounted(() => refresh())
</script>
