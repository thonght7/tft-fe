<script setup lang="ts">
import type { PurchaseTab } from '~/utils/boostPricing'

interface TabItem {
  id: PurchaseTab
  label: string
}

const props = defineProps<{
  modelValue: PurchaseTab
  tabs: TabItem[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: PurchaseTab): void
}>()

function setTab(id: PurchaseTab) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="tabsWrap" aria-label="Purchase tabs">
    <button
      v-for="t in props.tabs"
      :key="t.id"
      class="tab"
      :class="{ active: t.id === props.modelValue }"
      type="button"
      @click="setTab(t.id)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

<style scoped>
.tabsWrap{
  display:flex;
  gap:6px;
  overflow-x:auto;
  padding: 6px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}
.tabsWrap::-webkit-scrollbar{height:0}

.tab{
  scroll-snap-align: start;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 10px 14px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: transform .08s ease, background .12s ease, color .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.tab:hover{color: var(--text); background: rgba(255,255,255,.06)}
.tab.active{
  color: var(--text);
  background: rgba(109,94,252,.22);
  border-color: rgba(109,94,252,.35);
  box-shadow: 0 0 0 4px rgba(109,94,252,.10), 0 14px 26px rgba(109,94,252,.10);
}
</style>
