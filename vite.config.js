// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

//import eslint from "vite-plugin-eslint";
import svgLoader from "vite-svg-loader";
import Markdown from "vite-plugin-vue-markdown";
import Pages from "vite-plugin-pages";
import anchor from "markdown-it-anchor";

import { VitePWA } from "vite-plugin-pwa";
import replace from "@rollup/plugin-replace";

import Layouts from "vite-plugin-vue-layouts";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import { resolve, dirname } from "node:path";

// pwa CONFIG

const pwaOptions = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.ico"],
  manifest: {
    name: "Leerstandsmelder",
    short_name: "Leer",
    theme_color: "#FF336A",
    background_color: "#ffffff",
    id: "/?source=pwa",
    scope: "/",
    start_url: "/?source=pwa",
    icons: [
      {
        src: "icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Leerstand melden",
        short_name: "Meldung",
        description: "Formular um Leerstand zu melden",
        url: "/form?source=pwa",
      },
    ],
    workbox: {
      cleanupOutdatedCaches: true,
    },
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
};

const replaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
};
// const claims = process.env.CLAIMS === "true";
// const reload = process.env.RELOAD_SW === "true";
// const selfDestroying = process.env.SW_DESTROY === "true";

// if (process.env.SW === "true") {
//   pwaOptions.srcDir = "src";
//   pwaOptions.filename = claims ? "claims-sw.ts" : "prompt-sw.ts";
//   pwaOptions.strategies = "injectManifest";
//   pwaOptions.manifest.name = "LSM Inject Manifest";
//   pwaOptions.manifest.short_name = "LSM Inject";
// }

// if (claims) pwaOptions.registerType = "autoUpdate";

// if (reload) {
//   // @ts-expect-error overrides
//   replaceOptions.__RELOAD_SW__ = "true";
// }

// if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: { configFile: "src/styles/settings.scss" },
    }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./src/locales/**"
      ),
    }),
    VitePWA(pwaOptions),
    replace(replaceOptions),
    Layouts({
      defaultLayout: "SiteContent",
    }),
    svgLoader(),
    Markdown({
      // default options passed to markdown-it
      // see: https://markdown-it.github.io/markdown-it/
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItUses: [anchor],
      // A function providing the Markdown It instance gets the ability to apply custom settings/plugins
      // markdownItSetup(md) {
      //   // for example
      //   md.use(require("markdown-it-anchor"));

      // },
      // Class names for the wrapper div
      wrapperClasses: "markdown-body",
    }),
    Pages({
      dirs: [{ dir: "src/assets/md", baseRoute: "site" }],
      extensions: ["md"],
      extendRoute(route, parent) {
        if (route.path === "/") {
          // Index is unauthenticated.
          return route;
        }

        // Augment the route with meta that indicates that the route requires authentication.
        return {
          ...route,
          meta: { requiresAuth: false, content: true },
        };
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        //includePaths: ["node_modules"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      //"@": fileURLToPath(new URL("./src", import.meta.url)),
      //"~": fileURLToPath(new URL("./node_modules", import.meta.url)),
      //vue: "@vue/compat/dist/vue.esm-bundler.js",
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue",
      ".scss",
    ],
  },
  server: {
    port: 8080,
  },
});
