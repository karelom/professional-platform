<template>
  <div>
    <h3 class="section-title">進行中的任務</h3>
    <p class="section-subtitle">本期共{{ tasks.length }}項製作任務</p>
    <div class="mt-3 card divide-y divide-hana-border">
      <NuxtLink
        v-for="task in tasks"
        :key="task.id"
        :to="`/orders/${task.id}`"
        class="flex items-center gap-3 px-4 py-3.5 active:bg-hana-cream/50 transition-colors"
      >
        <div class="text-2xl flex-shrink-0">{{ task.emoji }}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-hana-text truncate">
            {{ task.name }} × {{ task.qty }}件
          </div>
          <div class="text-xs text-hana-muted mt-0.5">
            截止：{{ task.deadline }} · 單件 NT${{ task.unitPrice }}
          </div>
        </div>
        <UiStatusBadge
          :label="statusConfig[task.status].label"
          :color-class="statusConfig[task.status].class"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tasks, statusConfig } from '~/data/dashboard'
</script>
