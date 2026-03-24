<script setup lang="ts">
const auth = useAuthStore()

function doLogout() {
  auth.logout()
  return navigateTo('/')
}
</script>

<template>
  <div class="container">
    <div class="topbar" style="margin-bottom: 16px">
      <div class="nav">
        <NuxtLink to="/" class="badge">TFT Boost</NuxtLink>
        <NuxtLink to="/boosters" class="badge">Boosters</NuxtLink>
        <NuxtLink v-if="auth.isAuthed" to="/order/new" class="badge">New Order</NuxtLink>
        <NuxtLink v-if="auth.isAuthed" to="/orders" class="badge">My Orders</NuxtLink>
        <NuxtLink v-if="auth.isAuthed && auth.role === 'USER'" to="/booster/register" class="badge">Become a Booster</NuxtLink>
      </div>

      <div class="nav">
        <template v-if="!auth.isAuthed">
          <NuxtLink to="/login" class="badge">Login</NuxtLink>
          <NuxtLink to="/register" class="badge">Register</NuxtLink>
        </template>
        <template v-else>
          <span class="badge">{{ auth.me?.email }}</span>
          <button class="btn" @click="doLogout">Logout</button>
        </template>
      </div>
    </div>

    <slot />
  </div>
</template>
