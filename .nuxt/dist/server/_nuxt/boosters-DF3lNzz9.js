import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { u as useApi } from "./useApi-D_63GCJA.js";
import "../server.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/hookable/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/unctx/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ufo/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "boosters",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    const loading = ref(true);
    const boosters = ref([]);
    const errorMsg = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs))}><div class="card"><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Boosters</h2><p class="help">Danh sách booster public (backend: <code>/api/boosters</code>).</p></div>`);
      if (unref(loading)) {
        _push(`<div class="card">Loading…</div>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=boosters-DF3lNzz9.js.map
