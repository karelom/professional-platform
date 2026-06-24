<template>
  <div class="space-y-6">
    <!-- Step 1: 輸入 Email 或手機號 -->
    <div v-if="step === 'input'" class="space-y-4">
      <template v-if="authMode === 'email'">
        <div>
          <label class="form-label">Email</label>
          <input
            v-model="identifier"
            type="email"
            placeholder="your@email.com"
            class="form-input"
            @keydown.enter="handleSendOtp"
          />
        </div>
        <button class="btn-primary" :disabled="!canSend || isSending" @click="handleSendOtp">
          {{ isSending ? '發送中...' : '取得驗證碼' }}
        </button>
      </template>
      <template v-else>
        <div>
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
        <button class="btn-primary" :disabled="!canSend || isSending" @click="handleSendOtp">
          {{ isSending ? '發送中...' : '取得驗證碼' }}
        </button>
      </template>
    </div>

    <!-- Step 2: 輸入驗證碼 -->
    <div v-else class="space-y-4">
      <p class="text-sm text-hana-muted text-center">
        驗證碼已發送至
        <span class="font-medium text-hana-text">{{ displayIdentifier }}</span>
      </p>
      <div>
        <label class="form-label">驗證碼</label>
        <input
          v-model="otpCode"
          type="text"
          inputmode="numeric"
          maxlength="8"
          placeholder="00000000"
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

const { sendOtp, verifyOtp, authMode } = useAuth()
const router = useRouter()

const step = ref<'input' | 'otp'>('input')
const countryCode = ref('+886')
const identifier = ref('')
const otpCode = ref('')
const isSending = ref(false)
const isVerifying = ref(false)
const errorMsg = ref('')

const canSend = computed(() =>
  authMode === 'email' ? identifier.value.includes('@') : identifier.value.length >= 9,
)
const canVerify = computed(() => otpCode.value.length >= 6)

const fullIdentifier = computed(() =>
  authMode === 'email' ? identifier.value : `${countryCode.value}${identifier.value}`,
)

const displayIdentifier = computed(() =>
  authMode === 'email' ? identifier.value : `${countryCode.value} ${identifier.value}`,
)

async function handleSendOtp() {
  if (!canSend.value || isSending.value) return
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
    router.replace('/')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '驗證失敗，請確認驗證碼'
  } finally {
    isVerifying.value = false
  }
}
</script>
