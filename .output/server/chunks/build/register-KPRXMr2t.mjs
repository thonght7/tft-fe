import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
import { z } from 'zod';
import { R as RANKS } from './ranks-v3qqfw9s.mjs';
import { u as useApi } from './useApi-D_63GCJA.mjs';
import { u as useAuthStore } from './server.mjs';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    useAuthStore();
    z.object({
      currentRank: z.string().min(2),
      winrate: z.number().min(0).max(100)
    });
    const form = reactive({
      currentRank: "GOLD",
      winrate: 55
    });
    const loading = ref(false);
    const errorMsg = ref(null);
    const result = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "grid-template-columns": "1fr 1fr" }
      }, _attrs))}><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Become a Booster</h2><p class="help">Backend: <code>POST /api/boosters/register</code></p><div class="grid" style="${ssrRenderStyle({ "margin-top": "12px" })}"><div><div class="label">Current rank</div><select class="input"><!--[-->`);
      ssrRenderList(unref(RANKS), (r) => {
        _push(`<option${ssrRenderAttr("value", r.key)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).currentRank) ? ssrLooseContain(unref(form).currentRank, r.key) : ssrLooseEqual(unref(form).currentRank, r.key)) ? " selected" : ""}>${ssrInterpolate(r.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><div class="label">Winrate (%)</div><input${ssrRenderAttr("value", unref(form).winrate)} class="input" type="number" min="0" max="100" step="0.01"><div class="help" style="${ssrRenderStyle({ "margin-top": "6px" })}">0 \u2192 100 (BigDecimal \u1EDF backend)</div></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "border-color": "rgba(255,77,77,.4)", "background": "rgba(255,77,77,.1)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn primary"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Submitting\u2026" : "Register as Booster")}</button></div></div><div class="card"><h3 style="${ssrRenderStyle({ "margin-top": "0" })}">Result</h3>`);
      if (!unref(result)) {
        _push(`<div class="help">Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u.</div>`);
      } else {
        _push(`<div class="grid" style="${ssrRenderStyle({ "gap": "8px" })}"><div class="badge">${ssrInterpolate(unref(result).status)}</div><div><b>Email:</b> ${ssrInterpolate(unref(result).email)}</div><div><b>Rank:</b> ${ssrInterpolate(unref(result).currentRank)}</div><div><b>Winrate:</b> ${ssrInterpolate(Number(unref(result).winrate).toFixed(2))}%</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/booster/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-KPRXMr2t.mjs.map
