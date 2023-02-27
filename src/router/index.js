//import Vue from "vue";
import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/i18n";

import { setI18nLanguage, loadLocaleMessages, SUPPORT_LOCALES } from "@/i18n";

import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const MdRoutes = setupLayouts(generatedRoutes);

import store from "../store";
import routes from "./routes";

//console.log("routes", MdRoutes, routes);

function setupRouter(i18n) {
  const locale =
    i18n.mode === "legacy" ? i18n.global.locale : i18n.global.locale.value;

  // create router instance
  const router = createRouter({
    linkActiveClass: "is-active",
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...routes, ...MdRoutes],
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return { el: to.hash, behavior: "smooth" };
      } else if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    },
  });

  const waitForStorageToBeReady = async (to, from, next) => {
    await store.restored;
    next();
  };
  router.beforeEach(waitForStorageToBeReady);

  router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
      document.title = i18n.global.t(to.meta.title);
    } else {
      document.title = to.name;
    }

    // const paramsLocale = to.params.locale;
    // // use locale if paramsLocale is not in SUPPORT_LOCALES
    // if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    //   return `/${locale}`;
    // }
    // // load locale messages
    // if (!i18n.global.availableLocales.includes(paramsLocale)) {
    //   loadLocaleMessages(i18n, paramsLocale);
    // }
    // // set i18n language
    // setI18nLanguage(i18n, paramsLocale);
    //
    // // If this isn't an initial page load.
    // // if (to.name) {
    // //   // Start the route progress bar.
    // // }
    //console.log("to requiresRole", to, from);
    if (to.meta.requiresRole) {
      if (store.getters["auth/getRole"].includes(to.meta.requiresRole)) {
        next();
        return;
      } else {
        next({
          path: "/login",
          // save the location we were at to come back later
          query: { redirect: to.fullPath },
        });
      }
    } else if (to.meta.requiresAuth && !store.getters["auth/isLoggedIn"]) {
      next({
        path: "/login",
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  });

  return router;
}

const router = setupRouter(i18n);

export default router;
