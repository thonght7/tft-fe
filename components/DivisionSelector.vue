<script setup lang="ts">
const DIVS = ['IV', 'III', 'II', 'I'] as const
export type Division = (typeof DIVS)[number]

const props = defineProps<{
  modelValue: Division
  disabled?: boolean
  isDisabled?: (d: Division) => boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Division): void
}>()
</script>

<template>
  <div class="divs" role="group" aria-label="Division selector">
    <button
      v-for="d in DIVS"
      :key="d"
      class="div"
      type="button"
      :disabled="props.disabled || props.isDisabled?.(d)"
      :class="{ active: d === props.modelValue }"
      @click="emit('update:modelValue', d)"
    >
      {{ d }}
    </button>
  </div>
</template>

<style scoped>
.divs{display:flex; gap:10px}
.div{flex:1; padding:10px 10px; border-radius: 12px; border:1px solid var(--border); background: rgba(255,255,255,.04); color: var(--muted); cursor:pointer; transition: transform .08s ease, border-color .12s ease, box-shadow .12s ease}
.div:hover{transform: translateY(-1px); border-color: rgba(255,255,255,.22); color: var(--text)}
.div.active{color: var(--text); border-color: rgba(46,204,113,.45); box-shadow: 0 0 0 4px rgba(46,204,113,.10)}
.div:disabled{opacity:.55; cursor:not-allowed}
</style>
