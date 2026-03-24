<template>
  <div class="grid" style="gap: 16px">
    <AppHero />

    <div class="grid" style="grid-template-columns: repeat(3, 1fr)">
      <div class="card">
        <div class="badge">Step 1</div>
        <h3 style="margin: 10px 0 6px">Chọn rank</h3>
        <p class="help">Chọn current/target rank để tính giá.</p>
      </div>
      <div class="card">
        <div class="badge">Step 2</div>
        <h3 style="margin: 10px 0 6px">Thanh toán</h3>
        <p class="help">Mock payment trước, dễ thay bằng cổng thật.</p>
      </div>
      <div class="card">
        <div class="badge">Step 3</div>
        <h3 style="margin: 10px 0 6px">Theo dõi</h3>
        <p class="help">Tracking đơn + realtime (module WebSocket).</p>
      </div>
    </div>
  </div>
</template>
