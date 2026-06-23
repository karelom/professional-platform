<template>
  <div class="min-h-screen flex flex-col bg-hana-cream">
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-hana-header">花寓</h1>
        <p class="text-sm text-hana-muted mt-1">YU Florist · 職人平台</p>
      </div>
      <div class="w-full max-w-sm">
        <slot />
      </div>
    </div>
  </div>
</template>
