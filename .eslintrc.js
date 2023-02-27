module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  ignorePatterns: [
    "Map_leaflet.vue",
    "Map_setup.vue",
    "Map_ref.vue",
    "Map_option_api_running.vue",
    "ImageCropper.vue",
    "**/vendor/*.js",
  ],
  rules: {
    // override/add rules settings here, such as:
    "vue/no-unused-vars": "off",
    "vue/multi-word-component-names": "off",

    // TODO: fix
    "vue/no-unused-components": "off",
    "vue/valid-v-slot": "off",
    "vue/order-in-components": "off",
    "vue/no-v-html": "off",

    "no-unused-vars": "off",
  },
};
