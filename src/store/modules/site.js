import i18n from "@/i18n";

export const site = {
  namespaced: true,
  state: {
    language: "de",
    themeColor: "lsmLightTheme",
    siteName: "site.name",
  },
  getters: {
    language: (state) => state.language,
    themeColor: (state) => state.themeColor,
  },
  actions: {
    setLanguage({ dispatch, commit }, data) {
      commit("setLanguage", data);
      dispatch("setName");
    },
    setTheme({ commit }, theme) {
      commit("setTheme", theme);
    },
    setName({ commit }) {
      let name = "site.name";
      if (/((^|\.)leerstandsmelder\.in)$/.test(location.hostname)) {
        name = "site.name_neutral";
      }
      commit("setName", name);
    },
  },
  mutations: {
    setLanguage(state, code) {
      i18n.global.locale.value = code;
      i18n.locale = code;
      state.language = code;
      document.querySelector("html").setAttribute("lang", code);
    },
    setTheme(state, theme) {
      state.themeColor = theme;
    },
    setName(state, name) {
      state.siteName = name;
    },
    setShortName(state, name) {
      state.siteNameShort = name;
    },
  },
};
