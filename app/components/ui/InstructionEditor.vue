<template>
  <div class="space-y-2">
    <label class="form-label">{{ label }}</label>
    <div v-for="(item, idx) in modelValue" :key="idx" class="flex gap-2 items-start">
      <span class="text-xs text-hana-muted mt-2.5 w-5 shrink-0 text-right">{{ idx + 1 }}.</span>
      <input
        :value="item.title"
        type="text"
        :placeholder="placeholder"
        class="form-input flex-1"
        @input="updateItem(idx, ($event.target as HTMLInputElement).value)"
      />
      <button
        class="text-hana-muted hover:text-hana-danger mt-1.5 p-1 shrink-0 transition-colors"
        @click="removeItem(idx)"
      >
        <Icon name="lucide:x" size="16" />
      </button>
    </div>
    <button
      class="text-xs text-hana-wine flex items-center gap-1 active:opacity-70"
      @click="addItem"
    >
      <Icon name="lucide:plus" size="14" />
      新增{{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { InstructionItem } from '~/types'

defineProps<{
  label: string
  placeholder?: string
}>()

const modelValue = defineModel<InstructionItem[]>({ default: () => [] })

function addItem() {
  modelValue.value = [...modelValue.value, { title: '' }]
}

function removeItem(idx: number) {
  modelValue.value = modelValue.value.filter((_, i) => i !== idx)
}

function updateItem(idx: number, value: string) {
  modelValue.value = modelValue.value.map((item, i) => (i === idx ? { title: value } : item))
}
</script>
