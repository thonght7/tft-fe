<script setup lang="ts">
const { t } = useI18nLite()
</script>

<template>
  <div class="grid" style="gap: 14px">
    <h1 style="margin: 0">{{ t('policies.title') }}</h1>
    <p class="help" style="margin: 0">{{ t('policies.subtitle') }}</p>

    <div class="card">
      <h3 style="margin-top: 0">{{ t('policies.securityTitle') }}</h3>
      <ul class="help" style="margin: 0; padding-left: 18px">
        <li>{{ t('policies.security1') }}</li>
        <li>{{ t('policies.security2') }}</li>
        <li>{{ t('policies.security3') }}</li>
      </ul>
    </div>

    <div class="card">
      <h3 style="margin-top: 0">{{ t('policies.refundTitle') }}</h3>
      <ul class="help" style="margin: 0; padding-left: 18px">
        <li>{{ t('policies.refund1') }}</li>
        <li>{{ t('policies.refund2') }}</li>
        <li>{{ t('policies.refund3') }}</li>
      </ul>
    </div>

    <div class="card">
      <h3 style="margin-top: 0">{{ t('policies.fairPlayTitle') }}</h3>
      <p class="help" style="margin: 0">{{ t('policies.fairPlayDesc') }}</p>
    </div>
  </div>
</template>
