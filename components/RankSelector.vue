<script setup lang="ts">
import type { Rank } from '~/types/domain'
import { RANKS } from '~/utils/ranks'
import { tierOf } from '~/utils/boostRanks'
import { emblemUrlForRank } from '~/utils/rankEmblems'
import { TIER_OPTIONS } from '~/utils/rankTiers'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  modelValue: Rank
  disabledBelowTier?: number | null
  hideDivisions?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Rank): void
}>()

function isDisabled(rank: Rank): boolean {
  if (props.disabledBelowTier == null) return false
  return tierOf(rank) <= props.disabledBelowTier
}

// When hideDivisions is true, show one representative rank per tier (e.g. 'Đồng IV' for Bronze)
const displayRanks = computed(() => {
  if (!props.hideDivisions) return RANKS

  return TIER_OPTIONS.map((t) => {
    if (!t.hasDivisions) {
      const r = RANKS.find((x) => x.key === (t.backendPrefix as Rank))
      if (r) return r
    }
    const key = `${t.backendPrefix} IV` as Rank
    const r = RANKS.find((x) => x.key === key)
    if (r) return r
    // fallback: first match of backendPrefix (guard when backendPrefix may be undefined)
    const prefix = t.backendPrefix ?? ''
    const fallback = prefix ? RANKS.find((x) => x.key.startsWith(prefix)) : undefined
    return fallback ?? RANKS[0]
  })
})

// Normalize incoming modelValue to the representative key when hideDivisions is true
const selectedKey = computed<Rank>(() => {
  if (!props.hideDivisions) return props.modelValue
  // If modelValue already matches a representative entry, return it
  const rep = displayRanks.value.find((r) => r.key === props.modelValue)
  if (rep) return rep.key

  // Map divisional ranks like 'Đồng I' -> representative 'Đồng IV'
  const match = String(props.modelValue).match(/^(Sắt|Đồng|Bạc|Vàng|Bạch Kim|Kim Cương|Cao Thủ|Đại Cao Thủ|Thách Đấu)/)
  if (match) {
    const vi = match[1]
    const tierOpt = TIER_OPTIONS.find((t) => t.backendPrefix === vi)
    if (tierOpt) {
      if (!tierOpt.hasDivisions) return (tierOpt.backendPrefix as Rank)
      return (`${tierOpt.backendPrefix} IV` as Rank)
    }
  }

  return props.modelValue
})
</script>

<template>
  <div class="card">
    <div class="top">
      <h3 style="margin: 0">{{ props.title }}</h3>
      <div class="help">Click to select</div>
    </div>

    <div class="gridRanks">
      <button
        v-for="r in displayRanks"
        :key="r.key"
        class="rank"
        type="button"
        :disabled="isDisabled(r.key)"
        :class="{ active: r.key === selectedKey, disabled: isDisabled(r.key) }"
        @click="emit('update:modelValue', r.key)"
        :title="r.label.replace(/ IV$| III$| II$| I$/, '')"
        :aria-label="r.label.replace(/ IV$| III$| II$| I$/, '')"
      >
        <img class="emblem" :src="emblemUrlForRank(r.key)" alt="" loading="lazy" />
        <span class="label">{{ r.label.replace(/ IV$| III$| II$| I$/, '') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.top{display:flex; align-items:flex-end; justify-content:space-between; gap:12px; margin-bottom: 12px}
.gridRanks{display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:10px}
@media (max-width: 900px){
  .gridRanks{grid-template-columns: repeat(2, minmax(0,1fr))}
}
.rank{display:flex; align-items:center; justify-content:center; gap:10px; padding: 12px; border-radius: 14px; border:1px solid var(--border); background: rgba(255,255,255,.03); color: var(--muted); cursor:pointer; text-align:center; transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease; position:relative}
.rank:hover{transform: translateY(-1px); border-color: rgba(255,255,255,.20); color: var(--text)}
.rank.active{color: var(--text); border-color: rgba(109,94,252,.55); box-shadow: 0 0 0 4px rgba(109,94,252,.12), 0 10px 26px rgba(109,94,252,.10)}
.rank.disabled{opacity:.42; cursor:not-allowed}
.rank:disabled:hover{transform:none; border-color: var(--border); color: var(--muted)}

/* center image, no persistent text */
.emblem{width: 40px; height: 40px; object-fit: contain; display:block}
.label{display:none}

/* show label as tooltip on hover */
.rank:hover .label{display:block; position:absolute; left:50%; transform:translateX(-50%); bottom: calc(100% + 8px); background: rgba(0,0,0,0.9); color: #fff; padding:6px 10px; border-radius:6px; white-space:nowrap; font-weight:700; font-size:12px}
</style>
