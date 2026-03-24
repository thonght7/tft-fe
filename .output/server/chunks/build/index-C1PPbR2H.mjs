import { _ as __nuxt_component_0 } from './nuxt-link-kQD5iWy9.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    const loading = ref(true);
    const orders = ref([]);
    const errorMsg = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">My Orders</h2></div>`);
      if (unref(loading)) {
        _push(`<div class="card">Loading\u2026</div>`);
      } else if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "border-color": "rgba(255,77,77,.4)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<div class="card" style="${ssrRenderStyle({ "padding": "0" })}"><table class="table"><thead><tr><th>ID</th><th>From \u2192 To</th><th>Status</th><th>Price</th><th></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(orders), (o) => {
          _push(`<tr><td style="${ssrRenderStyle({ "font-family": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" })}">${ssrInterpolate(o.id.slice(0, 8))}\u2026 </td><td>${ssrInterpolate(o.currentRank)} \u2192 ${ssrInterpolate(o.targetRank)}</td><td><span class="badge">${ssrInterpolate(o.status)}</span></td><td>${ssrInterpolate(Number(o.price).toLocaleString())} VND</td><td>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "btn",
            to: `/orders/${o.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open`);
              } else {
                return [
                  createTextVNode("Open")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C1PPbR2H.mjs.map
