<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="colorClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  colorClass: string
}>()
</script>
