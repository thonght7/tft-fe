<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()

const min = computed(() => props.min ?? 1)
const max = computed(() => props.max ?? 5)
const step = computed(() => props.step ?? 1)

function clamp(v: number) {
  return Math.min(max.value, Math.max(min.value, Math.round(v)))
}
</script>

<template>
  <div class="card">
    <div class="row" style="align-items: baseline; justify-content: space-between">
      <div style="display:flex; gap:10px; align-items: baseline">
        <div style="font-size: 42px; font-weight: 1000; letter-spacing:-.03em">{{ props.modelValue }}</div>
        <div>
          <div style="font-weight: 900">{{ props.label ?? 'Number of Games' }}</div>
          <div class="help">placements games (max {{ max }})</div>
        </div>
      </div>
      <div class="help">{{ min }}–{{ max }}</div>
    </div>

    <input
      class="range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="props.modelValue"
      @input="emit('update:modelValue', clamp(Number(($event.target as HTMLInputElement).value)))"
      style="margin-top: 14px"
    />
  </div>
</template>

<style scoped>
.range{width:100%; accent-color: var(--brand)}
</style>
