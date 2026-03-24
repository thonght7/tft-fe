import { defineStore } from 'pinia'
import type { Tokens, UserMe } from '~/types/domain'

const ACCESS = 'tft.access'
const REFRESH = 'tft.refresh'
const USER = 'tft.user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
    refreshToken: '' as string,
    me: null as UserMe | null
  }),
  getters: {
    isAuthed: (s) => Boolean(s.accessToken),
    role: (s) => s.me?.role
  },
  actions: {
    hydrateFromStorage() {
      if (import.meta.server) return
      this.accessToken = localStorage.getItem(ACCESS) ?? ''
      this.refreshToken = localStorage.getItem(REFRESH) ?? ''
      const raw = localStorage.getItem(USER)
      this.me = raw ? (JSON.parse(raw) as UserMe) : null
    },
    setTokens(tokens: Tokens) {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
      if (import.meta.client) {
        localStorage.setItem(ACCESS, this.accessToken)
        localStorage.setItem(REFRESH, this.refreshToken)
      }
    },
    setMe(me: UserMe | null) {
      this.me = me
      if (import.meta.client) {
        if (me) localStorage.setItem(USER, JSON.stringify(me))
        else localStorage.removeItem(USER)
      }
    },
    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.me = null
      if (import.meta.client) {
        localStorage.removeItem(ACCESS)
        localStorage.removeItem(REFRESH)
        localStorage.removeItem(USER)
      }
    }
  }
})
