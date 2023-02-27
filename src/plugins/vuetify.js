// import "@mdi/font/css/materialdesignicons.css";
// import Vue from "vue";

import { aliases, mdi } from "vuetify/iconsets/mdi";

// import { createI18n, useI18n } from 'vue-i18n'

// For test use. Do not include createVuetify()
// see https://next.vuetifyjs.com/en/features/treeshaking/
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

// Translations provided by Vuetify
import { en, de, nl } from "vuetify/locale";

import "vuetify/styles";

import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";
import { md2 } from "vuetify/blueprints";
//import { VDataTable } from "vuetify/labs/VDataTable";
import * as labs from "vuetify/labs/components";

const lsmLightTheme = {
  dark: false,
  colors: {
    background: "#ffdde3",
    surface: "#FFFFFF",
    surface_invert: "#000000",
    primary: "#FF336A",
    //primary: "#FF3B42",
    "primary-darken-1": "#FC004F",
    "primary-darken-2": "#ec004e",
    "primary-darken-3": "#d6004c",
    "primary-lighten-1": "#FF5C84",
    "primary-lighten-2": "#FF8DA8",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    third: "#000000",
    error: "#9e0047",
    info: "#ff33cf",
    success: "#33ffc9",
    warning: "#ff6333",
    green: "#00ff00",
  },
};

const lsmDarkTheme = {
  dark: true,
  colors: {
    background: "#05181e",
    surface: "#000000",
    surface_invert: "#FFFFFF",
    primary: "#FF3B42",
    "primary-darken-1": "#ff1920",
    "primary-darken-2": "#f60022",
    "primary-darken-3": "#d70014",
    "primary-lighten-1": "#f46669",
    "primary-lighten-2": "#fb9393",
    secondary: "#ff3ba4",
    "secondary-darken-1": "#ff008c",
    third: "#ffffff",
    error: "#B00020",
    info: "#2196F3",
    success: "#FF3B42",
    warning: "#FB8C00",
  },
};

const vuetify = createVuetify({
  // locale: {
  // TODO: i18n vuetify
  // adapter: createVueI18nAdapter({ i18n, useI18n })
  // },
  blueprint: md2,
  components: {
    ...labs,
  },
  defaults: {
    global: {
      rounded: "lg",
    },
    VAppBar: {
      flat: true,
    },
    VCard: {
      variant: "outlined",
    },
    VBtn: {
      // set v-btn default color to primary
      color: "primary",
      //variant: "outlined",
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VDataTable: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  // Internationalization (i18n)
  // https://next.vuetifyjs.com/en/features/internationalization/#internationalization-i18n
  locale: {
    locale: "de",
    fallback: "de",
    messages: { de, en, nl },
  },

  // Theme
  // https://next.vuetifyjs.com/en/features/theme/
  theme: {
    defaultTheme: "lsmLightTheme",
    themes: {
      lsmLightTheme,
      lsmDarkTheme,
    },
  },
});

export default vuetify;
