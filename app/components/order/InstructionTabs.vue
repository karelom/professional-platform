<template>
  <div>
    <!-- Tab headers -->
    <div class="flex rounded-lg bg-hana-border/50 p-0.5">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200"
        :class="
          activeTab === tab.key
            ? 'bg-hana-wine text-white shadow-sm'
            : 'text-hana-muted hover:text-hana-text'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content -->
    <div class="mt-4">
      <!-- 製作步驟 -->
      <div v-if="activeTab === 'steps'" class="space-y-4">
        <div v-for="(step, i) in order.steps" :key="i" class="flex gap-3">
          <div
            class="w-7 h-7 rounded-full bg-hana-wine text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            {{ i + 1 }}
          </div>
          <p class="text-sm text-hana-text leading-relaxed">{{ step.title }}</p>
        </div>
        <div v-if="order.stepsNote" class="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <p class="text-xs text-amber-700">💡 {{ order.stepsNote }}</p>
        </div>
      </div>

      <!-- 注意事項 -->
      <div v-if="activeTab === 'notes'" class="space-y-3">
        <div v-for="(note, i) in order.notes" :key="i" class="flex gap-2">
          <span class="text-amber-500 flex-shrink-0">⚠️</span>
          <p class="text-sm text-hana-text leading-relaxed">{{ note }}</p>
        </div>
      </div>

      <!-- 品質標準 -->
      <div v-if="activeTab === 'quality'" class="space-y-3">
        <div v-for="(std, i) in order.qualityStandards" :key="i" class="flex gap-2">
          <span class="text-emerald-500 flex-shrink-0">✅</span>
          <p class="text-sm text-hana-text leading-relaxed">{{ std }}</p>
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

const tabs = [
  { key: 'steps', label: '製作步驟' },
  { key: 'notes', label: '注意事項' },
  { key: 'quality', label: '品質標準' },
] as const

const activeTab = ref<'steps' | 'notes' | 'quality'>('steps')
</script>
