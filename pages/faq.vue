<script setup lang="ts">
const { t } = useI18nLite()

const items = computed(() => [
  { q: t('home.faq.q1'), a: t('home.faq.a1') },
  { q: t('home.faq.q2'), a: t('home.faq.a2') },
  { q: t('home.faq.q3'), a: t('home.faq.a3') }
])
</script>

<template>
  <div class="grid" style="gap: 14px">
    <h1 style="margin: 0">{{ t('faq.title') }}</h1>
    <p class="help" style="margin: 0">{{ t('faq.subtitle') }}</p>

    <UiFaq :items="items" />
  </div>
</template>
