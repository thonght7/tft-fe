<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button class="switch" type="button" :disabled="props.disabled" @click="toggle">
    <span v-if="props.label" class="label">{{ props.label }}</span>
    <span class="track" :class="{ on: props.modelValue }" aria-hidden="true">
      <span class="thumb" />
    </span>
  </button>
</template>

<style scoped>
.switch{display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%; padding:10px 12px; border-radius: 12px; border:1px solid var(--border); background: rgba(255,255,255,.04); color: var(--text); cursor:pointer}
.switch:disabled{opacity:.55; cursor:not-allowed}
.label{font-size: 13px; color: var(--muted)}
.track{width: 46px; height: 26px; border-radius: 999px; position: relative; background: rgba(255,255,255,.10); border:1px solid var(--border); transition: background .12s ease, border-color .12s ease}
.track.on{background: rgba(46,204,113,.16); border-color: rgba(46,204,113,.35)}
.thumb{width: 20px; height: 20px; border-radius: 999px; position:absolute; top: 50%; left: 4px; transform: translateY(-50%); background: rgba(255,255,255,.85); transition: left .12s ease, background .12s ease}
.track.on .thumb{left: 22px; background: rgba(255,255,255,.95)}
</style>
