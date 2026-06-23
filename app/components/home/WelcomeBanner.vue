<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-hana-header via-hana-header-light to-hana-header p-5 text-white">
    <div class="relative z-10">
      <h2 class="text-lg font-bold">歡迎回來，{{ profile.name }} 👋</h2>
      <p class="text-xs text-white/70 mt-0.5">
        你已是花寓認證職人 · 累計製作 {{ profile.totalWorks }} 件作品
      </p>
      <div class="flex gap-6 mt-4">
        <div class="text-center">
          <div class="text-2xl font-bold">{{ stats.inProgress }}</div>
          <div class="text-[10px] text-white/60">進行中</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">{{ stats.pendingReview }}</div>
          <div class="text-[10px] text-white/60">待審核</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-hana-gold">NT${{ stats.monthlyRevenue.toLocaleString() }}</div>
          <div class="text-[10px] text-white/60">本月分潤</div>
        </div>
      </div>
    </div>
    <!-- Decorative flower -->
    <div class="absolute -right-4 -bottom-4 text-6xl opacity-20 rotate-12">🌸</div>
  </div>
</template>

<script setup lang="ts">
import { profile, stats } from '~/data/dashboard'
</script>
