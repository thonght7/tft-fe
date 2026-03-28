<script setup lang="ts">
export type FaqItem = { q: string; a: string }

defineProps<{ items: FaqItem[]; openFirst?: boolean }>()
</script>

<template>
  <div class="grid" style="gap: 10px">
    <details
      v-for="(it, idx) in items"
      :key="idx"
      class="card"
      style="padding: 12px 14px"
      :open="openFirst && idx === 0 ? true : undefined"
    >
      <summary class="faq-summary">
        <span>{{ it.q }}</span>
        <span class="faq-icon" aria-hidden="true">▾</span>
      </summary>
      <p class="help" style="margin: 10px 0 0; white-space: pre-line">{{ it.a }}</p>
    </details>
  </div>
</template>
