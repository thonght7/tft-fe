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

const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 100)
const step = computed(() => props.step ?? 1)

function clamp(v: number) {
  return Math.min(max.value, Math.max(min.value, v))
}

function dec() {
  emit('update:modelValue', clamp(props.modelValue - step.value))
}

function inc() {
  emit('update:modelValue', clamp(props.modelValue + step.value))
}
</script>

<template>
  <div class="wrap">
    <div v-if="props.label" class="label" style="margin-bottom: 6px">{{ props.label }}</div>
    <div class="row2">
      <button class="btn icon" type="button" @click="dec">−</button>
      <input
        class="input num"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :value="props.modelValue"
        @input="emit('update:modelValue', clamp(Number(($event.target as HTMLInputElement).value)))"
      />
      <button class="btn icon" type="button" @click="inc">+</button>
    </div>
  </div>
</template>

<style scoped>
.row2{display:flex; gap:10px; align-items:center}
.icon{width: 44px; height: 44px; border-radius: 12px; display:flex; align-items:center; justify-content:center; font-weight: 900}
.num{height: 44px; text-align:center; font-weight: 900}
</style>
