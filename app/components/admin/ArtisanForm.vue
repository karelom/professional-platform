<template>
  <div class="card p-5 space-y-4">
    <h3 class="text-base font-bold text-hana-text">新增職人</h3>
    <div>
      <label class="form-label">姓名</label>
      <input v-model="form.name" type="text" placeholder="如：秀美媽媽" class="form-input" />
    </div>
    <div>
      <label class="form-label">手機號碼（含國碼）</label>
      <input v-model="form.phone" type="tel" placeholder="+886912345678" class="form-input" />
    </div>
    <div>
      <label class="form-label">Email（選填，供 Email OTP 測試用）</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="artisan@example.com"
        class="form-input"
      />
    </div>
    <button class="btn-primary" :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
      {{ isSubmitting ? '建立中...' : '建立帳號' }}
    </button>
    <Transition name="fade">
      <p v-if="errorMsg" class="text-sm text-hana-danger">{{ errorMsg }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ created: [] }>()

const form = reactive({
  name: '',
  phone: '',
  email: '',
})

const isSubmitting = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() => form.name.trim() && form.phone.trim())

const { createArtisan } = useArtisans()

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return
  errorMsg.value = ''
  isSubmitting.value = true
  try {
    await createArtisan({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
    })
    form.name = ''
    form.phone = ''
    form.email = ''
    emit('created')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '建立失敗'
  } finally {
    isSubmitting.value = false
  }
}
</script>
