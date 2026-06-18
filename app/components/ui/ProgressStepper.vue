<template>
  <div class="flex items-center w-full">
    <template v-for="(step, i) in steps" :key="step.key">
      <div class="flex flex-col items-center" :class="i === 0 || i === steps.length - 1 ? 'flex-shrink-0' : 'flex-shrink-0'">
        <div
          class="w-3.5 h-3.5 rounded-full border-2 transition-colors duration-300"
          :class="dotClass(i)"
        />
        <span
          class="text-[10px] mt-1 whitespace-nowrap transition-colors duration-300"
          :class="i <= activeIndex ? (i === activeIndex ? 'text-hana-warning font-medium' : 'text-hana-success') : 'text-hana-muted'"
        >
          {{ step.label }}
        </span>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="flex-1 h-0.5 mx-0.5 transition-colors duration-300"
        :class="i < activeIndex ? 'bg-hana-success' : 'bg-hana-border'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { stepLabels, type ProgressStep } from '~/data/revenue'

const props = defineProps<{
  currentStep: ProgressStep
}>()

const steps = stepLabels

const activeIndex = computed(() =>
  steps.findIndex((s) => s.key === props.currentStep),
)

function dotClass(index: number) {
  if (index < activeIndex.value) return 'bg-hana-success border-hana-success'
  if (index === activeIndex.value) return 'bg-hana-warning border-hana-warning'
  return 'bg-white border-hana-border'
}
</script>
