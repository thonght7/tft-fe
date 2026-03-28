<template>
  <div class="card hero" style="padding: 26px" data-animate>
    <div class="grid" style="grid-template-columns: 1.25fr 0.75fr; align-items: center">
      <div>
        <div class="badge" style="margin-bottom: 10px">{{ t('home.trustLabel') }}</div>
        <h1 class="h1" style="margin: 0 0 10px">
          {{ t('home.heroTitle') }}
        </h1>
        <p style="margin: 0 0 18px; color: var(--muted); max-width: 58ch">
          {{ t('home.heroDesc') }}
        </p>
        <div class="row">
          <NuxtLink to="/order/new" class="btn primary" style="text-align: center">{{ t('home.ctaCreateOrder') }}</NuxtLink>
          <NuxtLink to="/boosters" class="btn" style="text-align: center">{{ t('home.ctaBrowseBoosters') }}</NuxtLink>
        </div>

        <div class="row" style="margin-top: 14px; gap: 10px">
          <span class="badge">Không queue</span>
          <span class="badge">Hỗ trợ 24/7</span>
          <span class="badge">Theo dõi realtime</span>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1fr; gap: 12px">
        <div class="card">
          <div class="kpi">
            <div class="help">{{ t('home.kpiAvgDeliveryLabel') }}</div>
            <div class="v">{{ t('home.kpiAvgDeliveryValue') }}</div>
          </div>
        </div>
        <div class="card">
          <div class="kpi">
            <div class="help">{{ t('home.kpiSupportLabel') }}</div>
            <div class="v">{{ t('home.kpiSupportValue') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18nLite()
</script>
