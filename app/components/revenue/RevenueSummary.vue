<template>
  <div
    class="rounded-2xl bg-gradient-to-br from-hana-header via-hana-header-light to-hana-header p-5 text-white text-center"
  >
    <p class="text-xs text-white/60">本月累積分潤</p>
    <p class="text-4xl font-bold mt-1">NT$ {{ revenueSummary.monthlyTotal.toLocaleString() }}</p>
    <p class="text-xs text-white/50 mt-1">
      預計 {{ revenueSummary.depositDate }} 入帳 · 上月 NT$
      {{ revenueSummary.lastMonth.toLocaleString() }}
    </p>

    <div class="flex justify-around mt-5 pt-4 border-t border-white/15">
      <div>
        <div class="text-xl font-bold text-hana-gold">{{ revenueSummary.passedCount }}件</div>
        <div class="text-[10px] text-white/50 mt-0.5">本月通過</div>
      </div>
      <div>
        <div class="text-xl font-bold text-hana-gold">NT${{ revenueSummary.avgPerItem }}</div>
        <div class="text-[10px] text-white/50 mt-0.5">平均單件</div>
      </div>
      <div>
        <div class="text-xl font-bold text-hana-gold">{{ revenueSummary.passRate }}%</div>
        <div class="text-[10px] text-white/50 mt-0.5">通過率</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { revenueSummary } from '~/data/revenue'
</script>
