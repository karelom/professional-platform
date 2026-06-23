<template>
  <div class="space-y-6">
    <!-- Step 1: 輸入 email 或手機號 -->
    <div v-if="step === 'input'" class="space-y-4">
      <div v-if="authMode === 'email'">
        <label class="form-label">Email</label>
        <input
          v-model="identifier"
          type="email"
          placeholder="your@email.com"
          class="form-input"
          @keydown.enter="handleSendOtp"
        />
      </div>
      <div v-else>
        <label class="form-label">手機號碼</label>
        <div class="flex gap-2">
          <select v-model="countryCode" class="form-select w-24 flex-shrink-0">
            <option value="+886">+886</option>
          </select>
          <input
            v-model="identifier"
            type="tel"
            placeholder="912345678"
            class="form-input flex-1"
            @keydown.enter="handleSendOtp"
          />
        </div>
      </div>
      <button class="btn-primary" :disabled="!canSendOtp || isSending" @click="handleSendOtp">
        {{ isSending ? '發送中...' : '取得驗證碼' }}
      </button>
    </div>

    <!-- Step 2: 輸入驗證碼 -->
    <div v-else class="space-y-4">
      <p class="text-sm text-hana-muted text-center">驗證碼已發送至 {{ displayIdentifier }}</p>
      <div>
        <label class="form-label">驗證碼</label>
        <input
          v-model="otpCode"
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="000000"
          class="form-input text-center text-lg tracking-widest"
          @keydown.enter="handleVerifyOtp"
        />
      </div>
      <button class="btn-primary" :disabled="!canVerify || isVerifying" @click="handleVerifyOtp">
        {{ isVerifying ? '驗證中...' : '登入' }}
      </button>
      <button class="btn-secondary" @click="step = 'input'">
        重新輸入{{ authMode === 'email' ? ' Email' : '手機號' }}
      </button>
    </div>

    <!-- Error message -->
    <Transition name="fade">
      <p v-if="errorMsg" class="text-sm text-hana-danger text-center">
        {{ errorMsg }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { sendOtp, verifyOtp, fetchProfile, authMode } = useAuth()
const router = useRouter()

const step = ref<'input' | 'otp'>('input')
const countryCode = ref('+886')
const identifier = ref('')
const otpCode = ref('')
const isSending = ref(false)
const isVerifying = ref(false)
const errorMsg = ref('')

const fullIdentifier = computed(() =>
  authMode === 'email' ? identifier.value : `${countryCode.value}${identifier.value}`,
)

const displayIdentifier = computed(() =>
  authMode === 'email' ? identifier.value : `${countryCode.value} ${identifier.value}`,
)

const canSendOtp = computed(() =>
  authMode === 'email' ? identifier.value.includes('@') : identifier.value.length >= 9,
)

const canVerify = computed(() => otpCode.value.length === 6)

async function handleSendOtp() {
  if (!canSendOtp.value || isSending.value) return
  errorMsg.value = ''
  isSending.value = true
  try {
    await sendOtp(fullIdentifier.value)
    step.value = 'otp'
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '發送失敗，請稍後再試'
  } finally {
    isSending.value = false
  }
}

async function handleVerifyOtp() {
  if (!canVerify.value || isVerifying.value) return
  errorMsg.value = ''
  isVerifying.value = true
  try {
    await verifyOtp(fullIdentifier.value, otpCode.value)
    await fetchProfile()
    router.replace('/')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '驗證失敗，請確認驗證碼'
  } finally {
    isVerifying.value = false
  }
}
</script>
