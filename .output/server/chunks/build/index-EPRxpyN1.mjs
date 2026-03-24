import { _ as __nuxt_component_0$1 } from './nuxt-link-kQD5iWy9.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "card",
    style: { "padding": "24px" }
  }, _attrs))}><div class="grid" style="${ssrRenderStyle({ "grid-template-columns": "1.2fr 0.8fr", "align-items": "center" })}"><div><div class="badge" style="${ssrRenderStyle({ "margin-bottom": "10px" })}">Fast \u2022 Safe \u2022 Discreet</div><h1 style="${ssrRenderStyle({ "margin": "0 0 10px", "font-size": "34px", "line-height": "1.1" })}"> Teamfight Tactics Boosting </h1><p style="${ssrRenderStyle({ "margin": "0 0 18px", "color": "var(--muted)" })}"> \u0110\u1EB7t \u0111\u01A1n nhanh, theo d\xF5i ti\u1EBFn \u0111\u1ED9, ch\u1ECDn booster ph\xF9 h\u1EE3p. Ki\u1EBFn tr\xFAc module \u0111\u1EC3 m\u1EDF r\u1ED9ng sang game kh\xE1c. </p><div class="row">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/order/new",
    class: "btn primary",
    style: { "text-align": "center" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Create Order`);
      } else {
        return [
          createTextVNode("Create Order")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/boosters",
    class: "btn",
    style: { "text-align": "center" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Browse Boosters`);
      } else {
        return [
          createTextVNode("Browse Boosters")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="grid" style="${ssrRenderStyle({ "grid-template-columns": "1fr", "gap": "12px" })}"><div class="card"><div class="kpi"><div class="help">Avg. delivery</div><div class="v">1-3 days</div></div></div><div class="card"><div class="kpi"><div class="help">Support</div><div class="v">24/7</div></div></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHero.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppHero = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "grid",
    style: { "gap": "16px" }
  }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppHero, null, null, _parent));
  _push(`<div class="grid" style="${ssrRenderStyle({ "grid-template-columns": "repeat(3, 1fr)" })}"><div class="card"><div class="badge">Step 1</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">Ch\u1ECDn rank</h3><p class="help">Ch\u1ECDn current/target rank \u0111\u1EC3 t\xEDnh gi\xE1.</p></div><div class="card"><div class="badge">Step 2</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">Thanh to\xE1n</h3><p class="help">Mock payment tr\u01B0\u1EDBc, d\u1EC5 thay b\u1EB1ng c\u1ED5ng th\u1EADt.</p></div><div class="card"><div class="badge">Step 3</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">Theo d\xF5i</h3><p class="help">Tracking \u0111\u01A1n + realtime (module WebSocket).</p></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-EPRxpyN1.mjs.map
