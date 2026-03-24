import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useApi } from './useApi-D_63GCJA.mjs';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "boosters",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    const loading = ref(true);
    const boosters = ref([]);
    const errorMsg = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Boosters</h2><p class="help">Danh s\xE1ch booster public (backend: <code>/api/boosters</code>).</p></div>`);
      if (unref(loading)) {
        _push(`<div class="card">Loading\u2026</div>`);
      } else if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "border-color": "rgba(255,77,77,.4)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<div class="grid" style="${ssrRenderStyle({ "grid-template-columns": "repeat(3, 1fr)" })}"><!--[-->`);
        ssrRenderList(unref(boosters), (b) => {
          _push(`<div class="card"><div class="badge">${ssrInterpolate(b.status)}</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">${ssrInterpolate(b.email)}</h3><p class="help" style="${ssrRenderStyle({ "margin": "0" })}">Rank: ${ssrInterpolate(b.currentRank)}</p><p class="help" style="${ssrRenderStyle({ "margin": "6px 0 0" })}">Winrate: ${ssrInterpolate(Number(b.winrate).toFixed(2))}%</p></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/boosters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=boosters-DF3lNzz9.mjs.map
