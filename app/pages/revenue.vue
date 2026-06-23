<template>
  <div class="p-4 space-y-5">
    <RevenueSummary />

    <!-- Order progress section -->
    <div>
      <h3 class="section-title">訂單分潤進度</h3>
      <p class="section-subtitle">追蹤每筆訂單的製作 → 審核 → 入帳進度</p>
      <div class="mt-3 space-y-3">
        <RevenueOrderProgress v-for="item in orderProgressList" :key="item.id" :data="item" />
      </div>
    </div>

    <!-- Settlement history -->
    <div>
      <h3 class="section-title">分潤明細</h3>
      <p class="section-subtitle">最近交易記錄</p>
      <div class="mt-3 card divide-y divide-hana-border">
        <RevenueSettlementItem v-for="record in settlements" :key="record.id" :record="record" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderProgressList, settlements } from '~/data/revenue'
</script>
