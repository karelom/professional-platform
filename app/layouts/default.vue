<template>
  <div class="min-h-screen flex flex-col bg-hana-cream">
    <div class="sticky top-0 z-50">
      <LayoutAppHeader />
      <!-- 桌面版：TabBar 在 Header 下方 -->
      <LayoutTabBar class="hidden md:block" />
    </div>
    <main class="flex-1 overflow-y-auto pb-16 md:pb-0">
      <slot />
    </main>
    <!-- 手機版：TabBar 置底 -->
    <LayoutTabBar class="fixed bottom-0 left-0 right-0 z-50 md:hidden" />
  </div>
</template>
