
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const AppHero: typeof import("../components/AppHero.vue")['default']
export const CheckoutPanel: typeof import("../components/CheckoutPanel.vue")['default']
export const DivisionSelector: typeof import("../components/DivisionSelector.vue")['default']
export const GamesSlider: typeof import("../components/GamesSlider.vue")['default']
export const LpStepper: typeof import("../components/LpStepper.vue")['default']
export const NormalsSlider: typeof import("../components/NormalsSlider.vue")['default']
export const PriceSummary: typeof import("../components/PriceSummary.vue")['default']
export const PurchaseTabs: typeof import("../components/PurchaseTabs.vue")['default']
export const RankSelector: typeof import("../components/RankSelector.vue")['default']
export const TierSelect: typeof import("../components/TierSelect.vue")['default']
export const ToggleSwitch: typeof import("../components/ToggleSwitch.vue")['default']
export const UiFaq: typeof import("../components/UiFaq.vue")['default']
export const UiFeatureCard: typeof import("../components/UiFeatureCard.vue")['default']
export const UiFooter: typeof import("../components/UiFooter.vue")['default']
export const UiReviewCard: typeof import("../components/UiReviewCard.vue")['default']
export const UiSection: typeof import("../components/UiSection.vue")['default']
export const UiStars: typeof import("../components/UiStars.vue")['default']
export const UiTopbar: typeof import("../components/UiTopbar.vue")['default']
export const WinsSlider: typeof import("../components/WinsSlider.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppHero: LazyComponent<typeof import("../components/AppHero.vue")['default']>
export const LazyCheckoutPanel: LazyComponent<typeof import("../components/CheckoutPanel.vue")['default']>
export const LazyDivisionSelector: LazyComponent<typeof import("../components/DivisionSelector.vue")['default']>
export const LazyGamesSlider: LazyComponent<typeof import("../components/GamesSlider.vue")['default']>
export const LazyLpStepper: LazyComponent<typeof import("../components/LpStepper.vue")['default']>
export const LazyNormalsSlider: LazyComponent<typeof import("../components/NormalsSlider.vue")['default']>
export const LazyPriceSummary: LazyComponent<typeof import("../components/PriceSummary.vue")['default']>
export const LazyPurchaseTabs: LazyComponent<typeof import("../components/PurchaseTabs.vue")['default']>
export const LazyRankSelector: LazyComponent<typeof import("../components/RankSelector.vue")['default']>
export const LazyTierSelect: LazyComponent<typeof import("../components/TierSelect.vue")['default']>
export const LazyToggleSwitch: LazyComponent<typeof import("../components/ToggleSwitch.vue")['default']>
export const LazyUiFaq: LazyComponent<typeof import("../components/UiFaq.vue")['default']>
export const LazyUiFeatureCard: LazyComponent<typeof import("../components/UiFeatureCard.vue")['default']>
export const LazyUiFooter: LazyComponent<typeof import("../components/UiFooter.vue")['default']>
export const LazyUiReviewCard: LazyComponent<typeof import("../components/UiReviewCard.vue")['default']>
export const LazyUiSection: LazyComponent<typeof import("../components/UiSection.vue")['default']>
export const LazyUiStars: LazyComponent<typeof import("../components/UiStars.vue")['default']>
export const LazyUiTopbar: LazyComponent<typeof import("../components/UiTopbar.vue")['default']>
export const LazyWinsSlider: LazyComponent<typeof import("../components/WinsSlider.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
