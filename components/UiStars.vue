<script setup lang="ts">
withDefaults(defineProps<{ value: number; outOf?: number }>(), { outOf: 5 })
</script>

<template>
  <span class="stars" aria-label="rating">
    <span v-for="i in outOf" :key="i" class="star" :class="{ on: i <= Math.round(value) }">★</span>
  </span>
</template>
