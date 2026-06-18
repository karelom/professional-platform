<template>
  <div class="grid grid-cols-2 gap-3">
    <NuxtLink
      v-for="action in quickActions"
      :key="action.label"
      :to="action.to"
      class="card p-4 active:scale-[0.97] transition-transform relative"
    >
      <span
        v-if="action.isNew"
        class="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      >
        NEW
      </span>
      <Icon :name="action.icon" class="w-6 h-6 text-hana-muted mb-2" />
      <div class="text-sm font-bold text-hana-text">{{ action.label }}</div>
      <div class="text-xs text-hana-muted mt-0.5">{{ action.description }}</div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { quickActions } from '~/data/dashboard'
</script>
