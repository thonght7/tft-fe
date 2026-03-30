<script setup lang="ts">
import type { TierName, TierOption } from '~/utils/rankTiers'

const props = defineProps<{
  modelValue: TierName
  options: TierOption[]
  isDisabled?: (tier: TierName) => boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: TierName): void
}>()

function emblemSrc(tier: TierName): string {
  // Local assets under /public/emblems
  switch (tier) {
    case 'Iron':
      return '/emblems/iron.png'
    case 'Bronze':
      return '/emblems/bronze.png'
    case 'Silver':
      return '/emblems/silver.png'
    case 'Gold':
      return '/emblems/gold.png'
    case 'Platinum':
      return '/emblems/platinum.png'
    case 'Diamond':
      return '/emblems/diamond.png'
    case 'Master':
      return '/emblems/master.png'
    case 'Grandmaster':
      return '/emblems/grandmaster.png'
    case 'Challenger':
      return '/emblems/challenger.png'
    default:
      return '/emblems/iron.png'
  }
}
</script>

<template>
  <div class="tierGrid">
    <button
      v-for="t in props.options"
      :key="t.id"
      type="button"
      class="tierBtn"
      :disabled="props.isDisabled?.(t.id)"
      :class="{ active: t.id === props.modelValue, disabled: props.isDisabled?.(t.id) }"
      @click="emit('update:modelValue', t.id)"
    >
      <img class="emblem" :src="emblemSrc(t.id)" alt="" loading="lazy" />
      <span class="name">{{ t.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tierGrid{display:grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap:10px}
@media (max-width: 1100px){
  .tierGrid{grid-template-columns: repeat(4, minmax(0,1fr))}
}
@media (max-width: 900px){
  .tierGrid{grid-template-columns: repeat(3, minmax(0,1fr))}
}

.tierBtn{
  position: relative;
  height: 58px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  padding: 10px;
  border-radius: 14px;
  border:1px solid var(--border);
  background: rgba(255,255,255,.03);
  color: var(--muted);
  cursor:pointer;
  text-align:center;
  transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
}
.tierBtn:hover{transform: translateY(-1px); border-color: rgba(255,255,255,.20)}
.tierBtn.active{border-color: rgba(109,94,252,.55); background: rgba(109,94,252,.10); box-shadow: 0 0 0 4px rgba(109,94,252,.10), 0 10px 26px rgba(109,94,252,.10)}
.tierBtn:disabled{opacity:.35; cursor:not-allowed}
.tierBtn:disabled:hover{transform:none; border-color: var(--border)}

.emblem{width: 34px; height: 34px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,.25)); opacity: .95}

/* Show text only on hover / keyboard focus */
.name{
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 10px);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(10, 14, 30, .92);
  color: var(--text);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .01em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .12s ease, transform .12s ease;
  box-shadow: var(--shadow);
  z-index: 5;
}
.tierBtn:hover .name,
.tierBtn:focus-visible .name{opacity: 1; transform: translate(-50%, 6px)}
</style>
