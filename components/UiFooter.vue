<script setup lang="ts">
const { t } = useI18nLite()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="card" style="padding: 18px">
      <div class="grid" style="grid-template-columns: 1.2fr .8fr; align-items: start">
        <div>
          <div class="badge" style="margin-bottom: 10px">{{ t('brand') }}</div>
          <p class="help" style="margin: 0; max-width: 60ch">
            {{ t('footer.desc') }}
          </p>
          <div class="help" style="margin-top: 10px">© {{ year }} {{ t('brand') }}.</div>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px">
          <div>
            <div class="label" style="margin-bottom: 8px">{{ t('footer.linksTitle') }}</div>
            <div class="grid" style="gap: 8px">
              <NuxtLink to="/" class="badge">{{ t('footer.linkHome') }}</NuxtLink>
              <NuxtLink to="/boosters" class="badge">{{ t('footer.linkBoosters') }}</NuxtLink>
              <NuxtLink to="/order/new" class="badge">{{ t('footer.linkPricing') }}</NuxtLink>
            </div>
          </div>
          <div>
            <div class="label" style="margin-bottom: 8px">{{ t('footer.policiesTitle') }}</div>
            <div class="grid" style="gap: 8px">
              <NuxtLink to="/policies" class="badge">{{ t('footer.linkPolicies') }}</NuxtLink>
              <NuxtLink to="/faq" class="badge">{{ t('footer.linkFaq') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
