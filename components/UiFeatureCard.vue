<script setup lang="ts">
defineProps<{ title: string; desc: string; icon?: string }>()
</script>

<template>
  <div class="card">
    <div class="row" style="align-items: center; gap: 10px; flex-wrap: nowrap">
      <div v-if="icon" class="badge" style="padding: 6px 10px; color: var(--text)">{{ icon }}</div>
      <div>
        <h3 style="margin: 0 0 6px">{{ title }}</h3>
        <p class="help" style="margin: 0">{{ desc }}</p>
      </div>
    </div>
  </div>
</template>
