<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { fetchProfile } = useAuth()
const user = useSupabaseUser()

watch(
  user,
  async (newUser) => {
    if (newUser) {
      await fetchProfile()
    }
  },
  { immediate: true },
)
</script>
