import { createApp } from "vue";

//import "./plugins/axios";

import vuetify from "./plugins/vuetify";
import api from "./utils/api.js";

import VueApexCharts from "vue3-apexcharts";

import { setupInterceptors } from "./utils/httpInterceptors";
import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
//import "vue-toastification/dist/index.css";

import "@/styles/fonts.scss";
//import "@/styles/settings.scss";
import "@/styles/main.scss";

import router from "./router";

import App from "./App.vue";

import i18n from "./i18n";

import store from "./store";

import VueMaplibreGl from "vue-maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

setupInterceptors(store);

const app = createApp(App);

app.directive("splitting", {
  beforeMount: (el, binding) => {
    let text = null;
    text = el.innerText;

    el.setAttribute("data-original", text);
    const tagName = "span";

    const characters = text.trim().split("");
    el.innerHTML = "";

    let i = 0;
    for (let c of characters) {
      const node = document.createElement(tagName);
      node.innerText = c;
      node.setAttribute("data-index", i);
      el.appendChild(node);
      i++;
    }
    let max = binding.arg == "max" ? binding.value : 6;
    let min = 1;
    let rand_version = Math.floor(Math.random() * (max - min + 1) + min);
    el.className = el.className + " logo_v" + rand_version;
    el.setAttribute("data-splited", "true");
  },
});

app.use(VueMaplibreGl);

app.use(Toast, {
  position: POSITION.BOTTOM_LEFT,
});

// TODO: configure VitePWA(),
//import "./registerServiceWorker";

import filters from "@/filters";

app.config.globalProperties.$filters = filters;

app.use(vuetify);
app.use(router);
app.use(store);
app.use(i18n);
app.use(VueApexCharts);

app.mount("#app");

import { registerSW } from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}
