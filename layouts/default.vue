<script setup lang="ts">
// Layout is intentionally thin; auth actions live in UiTopbar.
</script>

<template>
  <div class="container">
    <div class="layout-shell">
      <UiTopbar />
      <main class="layout-main">
        <slot />
      </main>
      <UiFooter />
    </div>
  </div>
</template>
