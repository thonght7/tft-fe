<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <section class="section">
    <div v-if="title || subtitle" style="margin-bottom: 12px">
      <div v-if="subtitle" class="badge" style="margin-bottom: 10px">{{ subtitle }}</div>
      <h2 v-if="title" class="h2" style="margin: 0">{{ title }}</h2>
    </div>
    <slot />
  </section>
</template>
