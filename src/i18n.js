import { nextTick } from "vue";
import { createI18n } from "vue-i18n";

import en from "@/locales/en.json";
import de from "@/locales/de.json";
import nl from "@/locales/nl.json";

export const SUPPORT_LOCALES = ["en", "de", "nl"];

function checkDefaultLanguage() {
  let matched = null;
  let languages = Object.getOwnPropertyNames(loadLocaleMessages());
  languages.forEach((lang) => {
    if (lang === navigator.language) {
      matched = lang;
    }
  });
  if (!matched) {
    languages.forEach((lang) => {
      let languagePartials = navigator.language.split("-")[0];
      if (lang === languagePartials) {
        matched = lang;
      }
    });
  }
  return matched;
}

export function setupI18n(options = { locale: "en" }) {
  //console.log("setupI18n", options);
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html").setAttribute("lang", locale);
}

export async function loadLocaleMessages(i18n, locale) {
  if (locale == undefined) {
    return nextTick();
  }

  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  );

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}

const i18n = setupI18n({
  globalInjection: true,
  legacy: false,
  allowComposition: true,
  locale: checkDefaultLanguage() || import.meta.env.VITE_I18N_LOCALE || "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  messages: {
    en,
    de,
    nl,
  },
});

export default i18n;
