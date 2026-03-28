<script setup lang="ts">
import type { FaqItem } from '~/components/UiFaq.vue'

const { t } = useI18nLite()

const faqItems = computed<FaqItem[]>(() => [
  { q: t('home.faq.q1'), a: t('home.faq.a1') },
  { q: t('home.faq.q2'), a: t('home.faq.a2') },
  { q: t('home.faq.q3'), a: t('home.faq.a3') }
])

const avgRating = 4.9
const reviewCount = 128

const reviews = computed(() => [
  {
    name: t('home.reviews.r1Name'),
    title: t('home.reviews.r1Title'),
    rating: 5,
    text: t('home.reviews.r1Text')
  },
  {
    name: t('home.reviews.r2Name'),
    title: t('home.reviews.r2Title'),
    rating: 5,
    text: t('home.reviews.r2Text')
  },
  {
    name: t('home.reviews.r3Name'),
    title: t('home.reviews.r3Title'),
    rating: 5,
    text: t('home.reviews.r3Text')
  }
])
</script>

<template>
  <div class="grid" style="gap: 18px">
    <div data-animate>
      <AppHero />
    </div>

    <UiSection :subtitle="t('home.featuresSubtitle')" :title="t('home.featuresTitle')" data-animate>
      <div class="grid grid-3">
        <UiFeatureCard
          icon="🔒"
          :title="t('home.features.safe.title')"
          :desc="t('home.features.safe.desc')"
        />
        <UiFeatureCard
          icon="📈"
          :title="t('home.features.tracking.title')"
          :desc="t('home.features.tracking.desc')"
        />
        <UiFeatureCard
          icon="⚙️"
          :title="t('home.features.flexible.title')"
          :desc="t('home.features.flexible.desc')"
        />
      </div>
    </UiSection>

    <UiSection :subtitle="t('home.howSubtitle')" :title="t('home.howTitle')" data-animate>
      <div class="grid grid-3">
        <div class="card">
          <div class="badge">Bước 1</div>
          <h3 style="margin: 10px 0 6px">{{ t('home.how.step1Title') }}</h3>
          <p class="help" style="margin: 0">{{ t('home.how.step1Desc') }}</p>
        </div>
        <div class="card">
          <div class="badge">Bước 2</div>
          <h3 style="margin: 10px 0 6px">{{ t('home.how.step2Title') }}</h3>
          <p class="help" style="margin: 0">{{ t('home.how.step2Desc') }}</p>
        </div>
        <div class="card">
          <div class="badge">Bước 3</div>
          <h3 style="margin: 10px 0 6px">{{ t('home.how.step3Title') }}</h3>
          <p class="help" style="margin: 0">{{ t('home.how.step3Desc') }}</p>
        </div>
      </div>
    </UiSection>

    <UiSection :subtitle="t('home.pricingSubtitle')" :title="t('home.pricingTitle')" data-animate>
      <div class="card" style="padding: 18px">
        <div class="row" style="align-items: center">
          <div>
            <p class="help" style="margin: 0 0 10px">{{ t('home.pricingDesc') }}</p>
            <NuxtLink to="/order/new" class="btn primary" style="display: inline-block">{{ t('home.pricingCta') }}</NuxtLink>
          </div>
          <div class="card" style="padding: 14px; opacity: .95">
            <div class="help">Ví dụ</div>
            <div style="font-weight: 700; margin-top: 6px">Plat IV → Emerald IV</div>
            <div class="help" style="margin-top: 6px">Giá sẽ hiển thị chi tiết ở trang tạo đơn</div>
          </div>
        </div>
      </div>
    </UiSection>

    <UiSection :subtitle="t('home.faqSubtitle')" :title="t('home.faqTitle')" data-animate>
      <UiFaq :items="faqItems" open-first />
    </UiSection>

    <UiSection :subtitle="t('home.reviewsSubtitle')" :title="t('home.reviewsTitle')" data-animate>
      <div class="card" style="padding: 18px; margin-bottom: 12px">
        <div class="row" style="align-items: center; justify-content: space-between">
          <div>
            <div class="help">{{ t('home.reviewsKpiLabel') }}</div>
            <div class="row" style="align-items: center; gap: 10px; margin-top: 6px">
              <div style="font-size: 28px; font-weight: 800">{{ avgRating.toFixed(1) }}</div>
              <UiStars :value="avgRating" />
              <div class="badge">{{ reviewCount }} {{ t('home.reviewsCountLabel') }}</div>
            </div>
          </div>
          <div class="help" style="max-width: 44ch">{{ t('home.reviewsNote') }}</div>
        </div>
      </div>

      <div class="grid grid-3">
        <UiReviewCard v-for="(r, idx) in reviews" :key="idx" v-bind="r" />
      </div>
    </UiSection>
  </div>
</template>
