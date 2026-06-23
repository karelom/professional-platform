<template>
  <div class="min-h-screen flex items-center justify-center bg-hana-cream">
    <div class="text-center space-y-3">
      <div class="text-4xl">🔄</div>
      <p class="text-sm text-hana-muted">登入中，請稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { fetchProfile } = useAuth()
const user = useSupabaseUser()
const router = useRouter()

watch(
  user,
  async (newUser) => {
    if (newUser) {
      await fetchProfile()
      router.replace('/')
    }
  },
  { immediate: true },
)
</script>
