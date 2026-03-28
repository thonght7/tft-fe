<script setup lang="ts">
defineProps<{ name: string; title?: string; rating: number; text: string }>()

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
</script>

<template>
  <div class="card" style="padding: 16px">
    <div class="row" style="align-items: center; justify-content: space-between">
      <div class="row" style="align-items: center; gap: 10px; flex-wrap: nowrap">
        <div class="avatar">{{ initials(name) }}</div>
        <div>
          <div style="font-weight: 700">{{ name }}</div>
          <div v-if="title" class="help">{{ title }}</div>
        </div>
      </div>
      <UiStars :value="rating" />
    </div>

    <p class="help" style="margin: 10px 0 0; white-space: pre-line">{{ text }}</p>
  </div>
</template>
