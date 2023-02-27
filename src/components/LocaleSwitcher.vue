<template>
  <div class="locale-switcher">
    <v-btn id="lang-switch">
      <v-icon left>mdi-translate</v-icon>
      {{ $t("site.lang_" + lang) }}
      <v-icon small right>mdi-menu-down</v-icon>
    </v-btn>
    <v-menu
      activator="#lang-switch"
      overflow-y-scroll
      left
      top
      style="z-index: 22224"
    >
      <v-list dense>
        <v-list-item
          v-for="locale in locales"
          :key="locale.id"
          :class="{ 'v-list-item--active': locale === lang }"
          @click="setLocale(locale)"
        >
          <v-list-item-title>
            {{ $t("site.lang_" + locale) }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
// Restore locale from state/localStorage, if it was set
import { useStore } from "vuex";
import { computed } from "vue";
import { useLocale } from "vuetify";

export default {
  name: "LocaleSwitcher",
  props: {
    locales: {
      type: Array,
      default: () => ["en", "de", "nl"],
    },
  },
  setup(props) {
    const store = useStore();
    const lang = computed(() => store.getters["site/language"]);

    const { current } = useLocale();
    current.value = lang.value;

    function setLocale(locale) {
      store.dispatch("site/setLanguage", locale).then(() => {
        // console.log("New locale = " + locale);
        current.value = locale;
      });
    }

    return {
      lang,
      setLocale,
    };
  },
};
</script>
