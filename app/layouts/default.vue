<template>
  <div class="min-h-screen flex flex-col bg-hana-cream">
    <div class="sticky top-0 z-50">
      <LayoutAppHeader />
      <LayoutTabBar />
    </div>
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
