import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { R as RANKS } from './ranks-v3qqfw9s.mjs';
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

const GAME = "tft_ranked";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetch } = useApi();
    const currentRank = ref("B\u1EA1c I");
    const targetRank = ref("V\xE0ng IV");
    const price = ref(null);
    const loadingPrice = ref(false);
    const creating = ref(false);
    const errorMsg = ref(null);
    watch([currentRank, targetRank], async () => {
      var _a, _b;
      price.value = null;
      errorMsg.value = null;
      loadingPrice.value = true;
      try {
        const res = await fetch("/api/pricing/calculate-price", {
          method: "POST",
          body: {
            game: GAME,
            currentRank: currentRank.value,
            targetRank: targetRank.value
          },
          auth: false
        });
        price.value = Number(res.price);
      } catch (e) {
        const err = e;
        errorMsg.value = (_b = (_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) != null ? _b : "Failed to calculate price";
      } finally {
        loadingPrice.value = false;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "grid-template-columns": "0.9fr 1.1fr" }
      }, _attrs))}><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Create boost order</h2><p class="help">Pricing backend: <code>/api/pricing/calculate-price</code> (game=${ssrInterpolate(GAME)}).</p><div class="row" style="${ssrRenderStyle({ "margin-top": "12px" })}"><div><div class="label">Current rank</div><select class="input"><!--[-->`);
      ssrRenderList(unref(RANKS), (r) => {
        _push(`<option${ssrRenderAttr("value", r.key)}${ssrIncludeBooleanAttr(Array.isArray(unref(currentRank)) ? ssrLooseContain(unref(currentRank), r.key) : ssrLooseEqual(unref(currentRank), r.key)) ? " selected" : ""}>${ssrInterpolate(r.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><div class="label">Target rank</div><select class="input"><!--[-->`);
      ssrRenderList(unref(RANKS), (r) => {
        _push(`<option${ssrRenderAttr("value", r.key)}${ssrIncludeBooleanAttr(Array.isArray(unref(targetRank)) ? ssrLooseContain(unref(targetRank), r.key) : ssrLooseEqual(unref(targetRank), r.key)) ? " selected" : ""}>${ssrInterpolate(r.label)}</option>`);
      });
      _push(`<!--]--></select></div></div><div style="${ssrRenderStyle({ "margin-top": "12px" })}" class="card"><div class="help">Estimated price</div><div style="${ssrRenderStyle({ "font-size": "26px", "font-weight": "800", "margin-top": "6px" })}">`);
      if (unref(loadingPrice)) {
        _push(`<span>Calculating\u2026</span>`);
      } else if (unref(price) != null) {
        _push(`<span>${ssrInterpolate(unref(price).toLocaleString())} VND</span>`);
      } else {
        _push(`<span>\u2014</span>`);
      }
      _push(`</div></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "margin-top": "12px", "border-color": "rgba(255,77,77,.4)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn primary" style="${ssrRenderStyle({ "margin-top": "12px" })}"${ssrIncludeBooleanAttr(unref(creating) || unref(loadingPrice) || unref(price) == null) ? " disabled" : ""}>${ssrInterpolate(unref(creating) ? "Creating\u2026" : "Create order")}</button><div class="help" style="${ssrRenderStyle({ "margin-top": "10px" })}"> Order create backend: <code>POST /api/orders</code> (requires price). </div></div><div class="grid"><div class="card"><div class="badge">Add-ons (coming)</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">Queue priority</h3><p class="help">M\xF4 ph\u1ECFng g\xF3i add-on nh\u01B0 c\xE1c site boost: \u01B0u ti\xEAn, stream, duo\u2026</p></div><div class="card"><div class="badge">Guarantees</div><ul style="${ssrRenderStyle({ "margin": "10px 0 0", "padding-left": "18px", "color": "var(--muted)" })}"><li>Kh\xF4ng chia s\u1EBB account ra b\xEAn ngo\xE0i</li><li>Ch\u1EE7 \u0111\u1ED9ng c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9</li><li>Ho\xE0n ti\u1EC1n n\u1EBFu kh\xF4ng th\u1EF1c hi\u1EC7n</li></ul></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/order/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-B9ybkOfQ.mjs.map
