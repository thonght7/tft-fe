import { _ as __nuxt_component_0 } from "./nuxt-link-kQD5iWy9.js";
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { z } from "zod";
import { u as useAuthStore } from "../server.mjs";
import { u as useApi } from "./useApi-D_63GCJA.js";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/hookable/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ufo/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/defu/dist/defu.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/unctx/dist/index.mjs";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "/Users/thonght/Documents/dtcl/tft-frontend/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useApi();
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      password2: z.string().min(8)
    }).refine((v) => v.password === v.password2, { message: "Passwords do not match", path: ["password2"] });
    const form = reactive({
      email: "",
      password: "",
      password2: ""
    });
    const loading = ref(false);
    const errorMsg = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "card",
        style: { "max-width": "520px", "margin": "0 auto" }
      }, _attrs))}><h2 style="${ssrRenderStyle({ "margin-top": "0" })}">Register</h2><div class="grid"><div><div class="label">Email</div><input${ssrRenderAttr("value", unref(form).email)} class="input" type="email"></div><div><div class="label">Password</div><input${ssrRenderAttr("value", unref(form).password)} class="input" type="password"></div><div><div class="label">Re-type password</div><input${ssrRenderAttr("value", unref(form).password2)} class="input" type="password"></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="card" style="${ssrRenderStyle({ "border-color": "rgba(255,77,77,.4)", "background": "rgba(255,77,77,.1)" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn primary"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Creating…" : "Create account")}</button><div class="help"> Đã có tài khoản? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        style: { "text-decoration": "underline" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Đăng nhập`);
          } else {
            return [
              createTextVNode("Đăng nhập")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=register-CoKD0fbn.js.map
