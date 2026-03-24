import { defineComponent, computed, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useRoute, u as useAuthStore } from './server.mjs';
import { u as useApi } from './useApi-D_63GCJA.mjs';
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

function formatDateTime(value) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useApi();
    const auth = useAuthStore();
    computed(() => String(route.params.id));
    const order = ref(null);
    const payment = ref(null);
    const progress = ref([]);
    const loading = ref(true);
    const errorMsg = ref(null);
    const canUpdateProgress = computed(() => auth.role === "BOOSTER");
    const newProgress = reactive({
      message: "",
      percent: 0
    });
    const paying = ref(false);
    const adding = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "grid",
        style: { "grid-template-columns": "1.1fr 0.9fr" }
      }, _attrs))}><div class="grid"><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Order details</h2>`);
      if (unref(loading)) {
        _push(`<div>Loading\u2026</div>`);
      } else if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "border-color": "rgba(255,77,77,.4)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else if (unref(order)) {
        _push(`<div class="grid" style="${ssrRenderStyle({ "gap": "10px" })}"><div class="row"><div class="card"><div class="help">From</div><div style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800" })}">${ssrInterpolate(unref(order).currentRank)}</div></div><div class="card"><div class="help">To</div><div style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800" })}">${ssrInterpolate(unref(order).targetRank)}</div></div></div><div class="row"><div class="card"><div class="help">Status</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700" })}"><span class="badge">${ssrInterpolate(unref(order).status)}</span></div></div><div class="card"><div class="help">Price</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700" })}">${ssrInterpolate(Number(unref(order).price).toLocaleString())} VND</div></div></div>`);
        if (unref(payment)) {
          _push(`<div class="card"><div class="help">Payment</div><div style="${ssrRenderStyle({ "margin-top": "8px" })}" class="row"><div><div class="help">Status</div><div class="badge">${ssrInterpolate(unref(payment).status)}</div></div><div><div class="help">Provider</div><div class="badge">${ssrInterpolate(unref(payment).provider)}</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card"><div class="help">Progress</div>`);
        if (unref(progress).length === 0) {
          _push(`<div class="help" style="${ssrRenderStyle({ "margin-top": "6px" })}">Ch\u01B0a c\xF3 c\u1EADp nh\u1EADt.</div>`);
        } else {
          _push(`<div class="grid" style="${ssrRenderStyle({ "gap": "10px", "margin-top": "10px" })}"><!--[-->`);
          ssrRenderList(unref(progress), (p) => {
            _push(`<div class="card" style="${ssrRenderStyle({ "padding": "12px" })}"><div class="row" style="${ssrRenderStyle({ "align-items": "center" })}"><div class="badge">${ssrInterpolate(p.percent)}%</div><div class="help">${ssrInterpolate(unref(formatDateTime)(p.createdAt))}</div></div><div style="${ssrRenderStyle({ "margin-top": "8px" })}">${ssrInterpolate(p.message)}</div><div class="help" style="${ssrRenderStyle({ "margin-top": "6px", "font-family": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" })}"> boosterUserId: ${ssrInterpolate(p.boosterUserId.slice(0, 8))}\u2026 </div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        if (unref(canUpdateProgress)) {
          _push(`<div class="card" style="${ssrRenderStyle({ "margin-top": "12px" })}"><div class="badge">Booster update</div><div class="grid" style="${ssrRenderStyle({ "margin-top": "10px" })}"><div><div class="label">Message</div><input${ssrRenderAttr("value", unref(newProgress).message)} class="input" type="text" maxlength="500"></div><div><div class="label">Percent (0..100)</div><input${ssrRenderAttr("value", unref(newProgress).percent)} class="input" type="number" min="0" max="100" step="1"></div><button class="btn primary"${ssrIncludeBooleanAttr(unref(adding)) ? " disabled" : ""}>${ssrInterpolate(unref(adding) ? "Saving\u2026" : "Add progress update")}</button><div class="help">Ch\u1EC9 booster \u0111\u01B0\u1EE3c assign m\u1EDBi c\xF3 quy\u1EC1n update (backend check).</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid"><div class="card"><h3 style="${ssrRenderStyle({ "margin-top": "0" })}">Checkout (mock)</h3><p class="help">Backend: <code>POST /api/payments/orders/{orderId}/mock</code></p><div class="row"><button class="btn primary"${ssrIncludeBooleanAttr(unref(paying) || unref(loading) || !unref(order)) ? " disabled" : ""}>${ssrInterpolate(unref(paying) ? "Paying\u2026" : "Mock success")}</button><button class="btn danger"${ssrIncludeBooleanAttr(unref(paying) || unref(loading) || !unref(order)) ? " disabled" : ""}> Mock fail </button></div></div><div class="card"><div class="badge">Admin/Booster tools (later)</div><p class="help" style="${ssrRenderStyle({ "margin": "10px 0 0" })}"> Admin assign booster: <code>POST /api/orders/{orderId}/assign</code>. Booster/user update status: <code>POST /api/orders/{orderId}/status</code>. </p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BLMVcaZz.mjs.map
