// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Vue void elements should be self-closing; Nuxt default here was warning in this repo setup.
      // We disable it to avoid conflicts and keep templates valid.
      'vue/html-self-closing': 'off'
    }
  }
)
