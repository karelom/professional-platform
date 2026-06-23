<template>
  <div class="space-y-6">
    <!-- Email mode: magic link（一步流程） -->
    <template v-if="authMode === 'email'">
      <div v-if="!emailSent" class="space-y-4">
        <div>
          <label class="form-label">Email</label>
          <input
            v-model="identifier"
            type="email"
            placeholder="your@email.com"
            class="form-input"
            @keydown.enter="handleSendMagicLink"
          />
        </div>
        <button
          class="btn-primary"
          :disabled="!canSendEmail || isSending"
          @click="handleSendMagicLink"
        >
          {{ isSending ? '發送中...' : '發送登入連結' }}
        </button>
      </div>
      <div v-else class="space-y-4 text-center">
        <div class="text-4xl">📧</div>
        <p class="text-sm font-medium text-hana-text">登入連結已發送！</p>
        <p class="text-sm text-hana-muted">
          請到 <span class="font-medium">{{ identifier }}</span> 信箱點擊連結完成登入
        </p>
        <button class="btn-secondary" @click="emailSent = false">重新輸入 Email</button>
      </div>
    </template>

    <!-- Phone mode: OTP（兩步流程） -->
    <template v-else>
      <div v-if="step === 'input'" class="space-y-4">
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
        <button class="btn-primary" :disabled="!canSendPhone || isSending" @click="handleSendOtp">
          {{ isSending ? '發送中...' : '取得驗證碼' }}
        </button>
      </div>
      <div v-else class="space-y-4">
        <p class="text-sm text-hana-muted text-center">
          驗證碼已發送至 {{ countryCode }} {{ identifier }}
        </p>
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
        <button class="btn-secondary" @click="step = 'input'">重新輸入手機號</button>
      </div>
    </template>

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
const emailSent = ref(false)
const countryCode = ref('+886')
const identifier = ref('')
const otpCode = ref('')
const isSending = ref(false)
const isVerifying = ref(false)
const errorMsg = ref('')

const canSendEmail = computed(() => identifier.value.includes('@'))
const canSendPhone = computed(() => identifier.value.length >= 9)
const canVerify = computed(() => otpCode.value.length === 6)

/** Email magic link */
async function handleSendMagicLink() {
  if (!canSendEmail.value || isSending.value) return
  errorMsg.value = ''
  isSending.value = true
  try {
    await sendOtp(identifier.value)
    emailSent.value = true
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '發送失敗，請稍後再試'
  } finally {
    isSending.value = false
  }
}

/** Phone OTP: 發送驗證碼 */
async function handleSendOtp() {
  if (!canSendPhone.value || isSending.value) return
  errorMsg.value = ''
  isSending.value = true
  try {
    await sendOtp(`${countryCode.value}${identifier.value}`)
    step.value = 'otp'
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '發送失敗，請稍後再試'
  } finally {
    isSending.value = false
  }
}

/** Phone OTP: 驗證碼登入 */
async function handleVerifyOtp() {
  if (!canVerify.value || isVerifying.value) return
  errorMsg.value = ''
  isVerifying.value = true
  try {
    await verifyOtp(`${countryCode.value}${identifier.value}`, otpCode.value)
    await fetchProfile()
    router.replace('/')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : '驗證失敗，請確認驗證碼'
  } finally {
    isVerifying.value = false
  }
}
</script>
