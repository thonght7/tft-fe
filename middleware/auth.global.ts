export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const publicPaths = ['/', '/login', '/register', '/boosters']
  const isPublic = publicPaths.includes(to.path)

  if (!isPublic && !auth.isAuthed) {
    return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)
  }
})
