<template>
  <div class="card" style="padding: 24px">
    <div class="grid" style="grid-template-columns: 1.2fr 0.8fr; align-items: center">
      <div>
        <div class="badge" style="margin-bottom: 10px">Fast • Safe • Discreet</div>
        <h1 style="margin: 0 0 10px; font-size: 34px; line-height: 1.1">
          Teamfight Tactics Boosting
        </h1>
        <p style="margin: 0 0 18px; color: var(--muted)">
          Đặt đơn nhanh, theo dõi tiến độ, chọn booster phù hợp. Kiến trúc module để mở rộng sang game khác.
        </p>
        <div class="row">
          <NuxtLink to="/order/new" class="btn primary" style="text-align: center">Create Order</NuxtLink>
          <NuxtLink to="/boosters" class="btn" style="text-align: center">Browse Boosters</NuxtLink>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1fr; gap: 12px">
        <div class="card">
          <div class="kpi">
            <div class="help">Avg. delivery</div>
            <div class="v">1-3 days</div>
          </div>
        </div>
        <div class="card">
          <div class="kpi">
            <div class="help">Support</div>
            <div class="v">24/7</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
