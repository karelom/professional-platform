<template>
  <div class="card p-5 space-y-4">
    <h3 class="text-base font-bold text-hana-text">
      {{ isEditing ? '編輯商品模板' : '新增商品模板' }}
    </h3>

    <!-- 基本資訊 -->
    <div class="grid grid-cols-[60px_1fr] gap-3">
      <div>
        <label class="form-label">Emoji</label>
        <input v-model="form.emoji" type="text" placeholder="🌸" class="form-input text-center" />
      </div>
      <div>
        <label class="form-label">商品名稱</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="如：台灣藍鵲押花書籤"
          class="form-input"
        />
      </div>
    </div>

    <!-- 標籤 -->
    <div>
      <label class="form-label">標籤（以逗號分隔）</label>
      <input v-model="tagsInput" type="text" placeholder="押花工藝, 代表台灣" class="form-input" />
    </div>

    <!-- 製作步驟 -->
    <InstructionEditor v-model="form.steps" label="製作步驟" placeholder="輸入步驟說明" />

    <!-- 注意事項 -->
    <InstructionEditor v-model="form.notes" label="注意事項" placeholder="輸入注意事項" />

    <!-- 品質標準 -->
    <InstructionEditor v-model="form.quality" label="品質標準" placeholder="輸入品質標準" />

    <!-- 操作按鈕 -->
    <div class="flex gap-2">
      <button
        class="btn-primary flex-1"
        :disabled="!canSubmit || isSubmitting"
        @click="handleSubmit"
      >
        {{ isSubmitting ? '儲存中...' : isEditing ? '更新模板' : '建立模板' }}
      </button>
      <button v-if="isEditing" class="btn-secondary" @click="handleCancel">取消</button>
    </div>

    <Transition name="fade">
      <p v-if="errorMsg" class="text-sm text-hana-danger">{{ errorMsg }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product, InstructionItem } from '~/types'

const props = defineProps<{
  product?: Product
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const isEditing = computed(() => !!props.product)

const form = reactive({
  name: '',
  emoji: '',
  steps: [] as InstructionItem[],
  notes: [] as InstructionItem[],
  quality: [] as InstructionItem[],
})

const tagsInput = ref('')
const isSubmitting = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() => form.name.trim().length > 0)

const { createProduct, updateProduct } = useProducts()

function loadProduct(product: Product) {
  form.name = product.name
  form.emoji = product.emoji ?? ''
  form.steps = product.steps?.map((s) => ({ ...s })) ?? []
  form.notes = product.notes?.map((n) => ({ ...n })) ?? []
  form.quality = product.quality?.map((q) => ({ ...q })) ?? []
  tagsInput.value = product.tags?.join(', ') ?? ''
}

watch(
  () => props.product,
  (p) => {
    if (p) loadProduct(p)
  },
  { immediate: true },
)

function parseTags(): string[] {
  return tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return
  errorMsg.value = ''
  isSubmitting.value = true

  try {
    const payload = {
      name: form.name.trim(),
      emoji: form.emoji.trim() || undefined,
      tags: parseTags(),
      steps: form.steps.filter((s) => s.title.trim()),
      notes: form.notes.filter((n) => n.title.trim()),
      quality: form.quality.filter((q) => q.title.trim()),
    }

    if (isEditing.value && props.product) {
      await updateProduct(props.product.id, payload)
    } else {
      await createProduct(payload)
    }

    resetForm()
    emit('saved')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '儲存失敗'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.name = ''
  form.emoji = ''
  form.steps = []
  form.notes = []
  form.quality = []
  tagsInput.value = ''
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>
