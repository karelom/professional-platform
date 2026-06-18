<template>
  <div>
    <h3 class="section-title">上傳完成照片</h3>
    <p class="section-subtitle">請上傳清晰的正面照 × 背面照，審核通過即可寄件</p>

    <div class="mt-3">
      <!-- Upload area -->
      <label
        class="block border-2 border-dashed border-hana-border rounded-2xl p-8 text-center cursor-pointer
               hover:border-hana-warning hover:bg-amber-50/30 transition-colors"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="onFileSelect"
        >
        <Icon name="lucide:camera" class="w-10 h-10 text-hana-muted mx-auto" />
        <p class="text-sm font-medium text-hana-text mt-2">點擊拍照 / 選擇圖片</p>
        <p class="text-xs text-hana-muted mt-1">支援 JPG、PNG，建議自然光拍攝</p>
      </label>

      <!-- Preview thumbnails -->
      <div v-if="previews.length > 0" class="mt-3 flex gap-2 flex-wrap">
        <div
          v-for="(src, i) in previews"
          :key="i"
          class="relative w-20 h-20 rounded-lg overflow-hidden border border-hana-border"
        >
          <img :src="src" class="w-full h-full object-cover" alt="preview">
          <button
            class="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
            @click="removePreview(i)"
          >
            <Icon name="lucide:x" class="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      <p class="text-xs text-hana-muted mt-2">
        📷 建議拍攝：正面全景 × 細節特寫 × 側面厚度
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const previews = ref<string[]>([])

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  for (const file of input.files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        previews.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

function removePreview(index: number) {
  previews.value.splice(index, 1)
}
</script>
