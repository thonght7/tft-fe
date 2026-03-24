import { u as useAuthStore, b as useRuntimeConfig } from './server.mjs';

function useApi() {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  async function rawFetch(path, opts = {}) {
    var _a, _b;
    const url = `${config.public.apiBase}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...(_a = opts.headers) != null ? _a : {}
    };
    if (opts.auth !== false && auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    const method = (_b = opts.method) != null ? _b : "GET";
    const body = method === "GET" || method === "DELETE" ? void 0 : opts.body;
    try {
      return await $fetch(url, {
        method,
        headers,
        body,
        query: opts.query
      });
    } catch (e) {
      const err = e;
      if (opts.retryOn401 !== false && (err == null ? void 0 : err.status) === 401 && auth.refreshToken) {
        const refreshed = await tryRefresh();
        if (refreshed) return rawFetch(path, { ...opts, retryOn401: false });
      }
      throw e;
    }
  }
  async function tryRefresh() {
    try {
      const res = await $fetch(`${config.public.apiBase}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refreshToken: auth.refreshToken }
      });
      auth.setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresInSeconds: res.expiresInSeconds
      });
      auth.setMe(res.me);
      return true;
    } catch {
      auth.logout();
      return false;
    }
  }
  return {
    fetch: rawFetch
  };
}

export { useApi as u };
//# sourceMappingURL=useApi-D_63GCJA.mjs.map
