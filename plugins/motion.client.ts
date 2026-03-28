// Nuxt auto-registers plugins in /plugins. This file intentionally exports a default plugin.
export {}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (reduceMotion) return

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          ;(e.target as HTMLElement).classList.add('in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.12 }
  )

  // Observe elements that opt-in.
  for (const el of document.querySelectorAll<HTMLElement>('[data-animate]')) {
    io.observe(el)
  }

  // If new nodes get added (Nuxt navigation), re-scan.
  const mo = new MutationObserver(() => {
    for (const el of document.querySelectorAll<HTMLElement>('[data-animate]:not(.in)')) {
      io.observe(el)
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })
})
