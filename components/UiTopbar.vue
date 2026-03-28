<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18nLite()

function doLogout() {
  auth.logout()
  return navigateTo('/')
}
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <div class="nav">
        <NuxtLink to="/" class="brand">
          <span class="brand-dot" aria-hidden="true" />
          <span style="font-weight: 800">{{ t('brand') }}</span>
        </NuxtLink>

        <NuxtLink to="/boosters" class="navlink" active-class="navlink active">{{ t('nav.boosters') }}</NuxtLink>
        <NuxtLink to="/faq" class="navlink" active-class="navlink active">FAQ</NuxtLink>
        <NuxtLink to="/policies" class="navlink" active-class="navlink active">{{ t('footer.linkPolicies') }}</NuxtLink>
      </div>

      <div class="nav">
        <NuxtLink to="/order/new" class="btn primary">{{ t('nav.newOrder') }}</NuxtLink>

        <template v-if="!auth.isAuthed">
          <NuxtLink to="/login" class="navlink" active-class="navlink active">{{ t('nav.login') }}</NuxtLink>
          <NuxtLink to="/register" class="navlink" active-class="navlink active">{{ t('nav.register') }}</NuxtLink>
        </template>
        <template v-else>
          <span class="badge" style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ auth.me?.email }}
          </span>
          <NuxtLink to="/orders" class="navlink" active-class="navlink active">{{ t('nav.myOrders') }}</NuxtLink>
          <NuxtLink
            v-if="auth.role === 'USER'"
            to="/booster/register"
            class="navlink"
            active-class="navlink active"
          >
            {{ t('nav.becomeBooster') }}
          </NuxtLink>
          <button class="btn" @click="doLogout">{{ t('nav.logout') }}</button>
        </template>
      </div>
    </div>
  </header>
</template>
