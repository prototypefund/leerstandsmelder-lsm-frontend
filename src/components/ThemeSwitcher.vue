<template>
  <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
</template>

<script>
// Restore locale from state/localStorage, if it was set
import { useStore } from "vuex";
import { useTheme } from "vuetify";
import { ref, computed } from "vue";

export default {
  name: "ThemeSwitcher",
  setup() {
    const theme = useTheme();
    const store = useStore();

    theme.global.name.value = store.getters["site/themeColor"];

    function toggleTheme() {
      let themePack =
        theme.global.name.value == "lsmLightTheme"
          ? "lsmDarkTheme"
          : "lsmLightTheme";
      theme.global.name.value = themePack;
      store.dispatch("site/setTheme", themePack);
    }
    return {
      theme,
      toggleTheme,
    };
  },
};
</script>
