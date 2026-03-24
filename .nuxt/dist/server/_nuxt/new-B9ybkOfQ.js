import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { R as RANKS } from "./ranks-v3qqfw9s.js";
import { u as useApi } from "./useApi-D_63GCJA.js";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/unctx/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ufo/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/klona/dist/index.mjs";
const GAME = "tft_ranked";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetch } = useApi();
    const currentRank = ref("Bạc I");
    const targetRank = ref("Vàng IV");
    const price = ref(null);
    const loadingPrice = ref(false);
    const creating = ref(false);
    const errorMsg = ref(null);
    watch([currentRank, targetRank], async () => {
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
        errorMsg.value = err?.data?.message ?? "Failed to calculate price";
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
        _push(`<span>Calculating…</span>`);
      } else if (unref(price) != null) {
        _push(`<span>${ssrInterpolate(unref(price).toLocaleString())} VND</span>`);
      } else {
        _push(`<span>—</span>`);
      }
      _push(`</div></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "margin-top": "12px", "border-color": "rgba(255,77,77,.4)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn primary" style="${ssrRenderStyle({ "margin-top": "12px" })}"${ssrIncludeBooleanAttr(unref(creating) || unref(loadingPrice) || unref(price) == null) ? " disabled" : ""}>${ssrInterpolate(unref(creating) ? "Creating…" : "Create order")}</button><div class="help" style="${ssrRenderStyle({ "margin-top": "10px" })}"> Order create backend: <code>POST /api/orders</code> (requires price). </div></div><div class="grid"><div class="card"><div class="badge">Add-ons (coming)</div><h3 style="${ssrRenderStyle({ "margin": "10px 0 6px" })}">Queue priority</h3><p class="help">Mô phỏng gói add-on như các site boost: ưu tiên, stream, duo…</p></div><div class="card"><div class="badge">Guarantees</div><ul style="${ssrRenderStyle({ "margin": "10px 0 0", "padding-left": "18px", "color": "var(--muted)" })}"><li>Không chia sẻ account ra bên ngoài</li><li>Chủ động cập nhật tiến độ</li><li>Hoàn tiền nếu không thực hiện</li></ul></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/order/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=new-B9ybkOfQ.js.map
