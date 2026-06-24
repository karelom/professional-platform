<template>
  <div class="p-4 space-y-5">
    <div>
      <h2 class="section-title">管理中心</h2>
      <p class="section-subtitle">管理訂單、商品、職人與分潤</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="card p-4 active:scale-[0.97] transition-transform"
      >
        <Icon :name="item.icon" class="w-7 h-7 text-hana-wine mb-2" />
        <div class="text-sm font-bold text-hana-text">{{ item.label }}</div>
        <div class="text-xs text-hana-muted mt-0.5">{{ item.summary }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const { fetchArtisans } = useArtisans()
const { fetchProducts } = useProducts()

const artisanCount = ref(0)
const productCount = ref(0)

const menuItems = computed(() => [
  {
    icon: 'lucide:package',
    label: '訂單管理',
    summary: '建立、派工、追蹤訂單',
    to: '/admin/orders',
  },
  {
    icon: 'lucide:book-open',
    label: '商品模板',
    summary: `${productCount.value} 個模板`,
    to: '/admin/products',
  },
  {
    icon: 'lucide:users',
    label: '職人管理',
    summary: `${artisanCount.value} 位職人`,
    to: '/admin/artisans',
  },
  {
    icon: 'lucide:coins',
    label: '分潤管理',
    summary: '結算與匯出',
    to: '/admin/settlements',
  },
])

onMounted(async () => {
  try {
    const [artisans, products] = await Promise.all([fetchArtisans(), fetchProducts()])
    artisanCount.value = artisans.length
    productCount.value = products.length
  } catch (e) {
    console.error('[admin] 統計載入失敗', e)
  }
})
</script>
