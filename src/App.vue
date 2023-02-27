<template>
  <div id="full_bg" :class="themeColor"></div>
  <v-app :theme="themeColor">
    <v-navigation-drawer
      v-model="sideNav"
      app
      absolute
      temporary
      location="left"
      width="300"
      style="z-index: 11111"
    >
      <v-toolbar flat color="primary">
        <v-list>
          <v-list-item>
            <v-toolbar-title class="headline text-uppercase">
              <span>((</span>
              <span>Leerstand</span>
              <span class="font-weight-light">{{ appName }}</span>
              <span>))</span>
            </v-toolbar-title>
          </v-list-item>
        </v-list>
      </v-toolbar>
      <v-list>
        <div v-for="item in menuItems" :key="item.title">
          <v-list-item v-if="item.component" :to="item.path">
            <template #prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-badge v-if="item.badge" color="red" :content="item.badge" inline>
              <span>{{ $t(item.title) }}</span>
            </v-badge>
            <v-list-item-title v-else>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item.href" :href="item.path">
            <template #prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-badge v-if="item.badge" color="red" :content="item.badge" inline>
              <span>{{ $t(item.title) }}</span>
            </v-badge>
            <v-list-item-title v-else>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>
          <v-divider v-if="!item.component && !item.href"></v-divider>
          <v-list-subheader v-if="!item.component && !item.href">{{
            $t(item.title)
          }}</v-list-subheader>
        </div>

        <v-divider></v-divider>
        <v-list-item>
          <locale-switcher :locales="['en', 'de', 'nl']"></locale-switcher>
          <theme-switcher />
        </v-list-item>
      </v-list>
      <v-footer class="mb-12 text-disabled text-subtitle-2"
        ><small> version: {{ appVersion }} </small></v-footer
      >
    </v-navigation-drawer>
    <Loader :visible="loading" />
    <v-app-bar app color="transparent">
      <v-btn
        variant="outlined"
        icon="mdi-menu"
        size="small"
        class="rounded-xl on-surface ml-5 mr-5"
        @click.stop="sideNav = !sideNav"
      ></v-btn>
      <div
        :class="
          $vuetify.display.smAndDown
            ? 'sm d-flex justify-center align-center text-primary outer1'
            : 'lg d-flex justify-center align-center text-primary outer1'
        "
      >
        <div class="d-flex justify-center align-center text-primary outer2">
          <v-app-bar-title
            color="primary"
            class="d-flex justify-center align-center text-primary"
          >
            <div class="d-inline-flex">
              <router-link
                color="primary"
                to="/"
                class="text-primary d-inline"
                style="text-decoration: none"
              >
                <!--v-img
            alt="Leerstandsmelder"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="./assets/logo_cropped_alt.png"
            width="100"
          /-->
                <h2
                  v-splitting:max="6"
                  color="primary"
                  class="logo logo-lg d-none d-lg-block"
                >
                  {{ $t(siteName) }}
                </h2>
                <h2
                  v-splitting:max="2"
                  color="primary"
                  class="logo logo-md d-lg-none"
                >
                  {{ $t("site.name_short") }}
                </h2>
              </router-link>
              <RegionSelect />
            </div>
          </v-app-bar-title>
        </div>
      </div>

      <v-btn
        v-if="isLoggedIn"
        id="menu-account"
        variant="outlined"
        icon="mdi-account"
        size="small"
        class="rounded-xl ml-5 mr-5 on-surface"
      >
      </v-btn>
      <v-menu activator="#menu-account">
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ user.nickname }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile">
            <template #prepend>
              <v-icon icon="mdi-account"></v-icon>
            </template>
            <v-list-item-title>
              {{ $t("menu.profil") }}
            </v-list-item-title>
          </v-list-item>

          <v-divider v-if="isLoggedIn"></v-divider>

          <v-list-item v-if="isLoggedIn" @click.prevent="logout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title id="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="!isLoggedIn"
        id="menu-public"
        variant="outlined"
        icon="mdi-account-plus"
        size="small"
        class="rounded-xl ml-5 mr-5 on-surface"
      >
      </v-btn>
      <v-menu activator="#menu-public">
        <v-list>
          <v-list-item>
            <v-list-item-title>Hier anmelden</v-list-item-title>
          </v-list-item>
          <v-list-item to="/register">
            <template #prepend>
              <v-icon icon="mdi-login"></v-icon>
            </template>
            <v-list-item-title>{{ $t("users.register") }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-divider></v-divider>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Hier einloggen</v-list-item-title>
          </v-list-item>
          <v-list-item to="/login">
            <template #prepend>
              <v-icon icon="mdi-login"></v-icon>
            </template>
            <v-list-item-title>{{ $t("users.login") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>

      <ReloadPrompt />
    </v-main>

    <v-footer class="d-flex flex-column text-center">
      <v-row justify="center">
        <v-col class="w100">
          <v-btn
            v-for="link in links"
            :key="link"
            :to="getSiteLink(link)"
            variant="text"
            color="surface_invert"
          >
            <span>{{ $t("site.subnav." + link) }}</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <strong>{{ $t("site.copyright_notice") }}</strong>
        </v-col>
      </v-row>
      <v-divider style="margin-bottom: 20px"></v-divider>
      <v-row justify="center">
        <v-col cols="6" class="d-flex child-flex">
          <p class="font-weight-thin text-disabled">
            Gefördert vom
            <a href="https://www.bmbf.de/" target="_blank"
              >Bundesministerium für Bildung und Forschung</a
            >
            von 9'2022 – 2'2023 (Förderkennzeichen 01IS22S36) und unterstützt
            vom
            <a href="https://prototypefund.de/" target="_blank"
              >Protoype Fund</a
            >
          </p>
        </v-col>
      </v-row>
      <v-row justify="center" class="align-center bg-on-dark">
        <v-col cols="12" md="6" class="d-flex">
          <a
            href="https://www.bmbf.de/"
            target="_blank"
            class="d-inline-block mx-auto align-self-center"
          >
            <v-img
              alt="Logo des Bundesministeriums für Bildung und Forschung"
              max-height="190"
              width="350"
              src="/logos/BMBF_Logo.svg"
          /></a> </v-col
        ><v-col cols="12" md="6">
          <a
            href="https://prototypefund.de/"
            target="_blank"
            class="d-inline-block mx-auto align-self-center"
            ><v-img
              alt="Logo des Prototype Funds"
              max-height="130"
              width="250"
              src="/logos/PrototypeFund_Logo.svg"
          /></a>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
  <teleport to="head">
    <meta name="theme-color" :content="themeColor" />
    <!--link rel="icon" :href="logo" type="image/svg+xml" /-->
  </teleport>
</template>

<script>
import { mapState, mapGetters, useStore } from "vuex";
import Loader from "@/components/loader.vue";
import { useToast } from "vue-toastification";
import { useDisplay } from "vuetify";

import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import RegionSelect from "@/components/Region/RegionSelect.vue";

import ReloadPrompt from "@/components/ReloadPrompt.vue";

export default {
  name: "App",
  components: {
    Loader,
    LocaleSwitcher,
    ThemeSwitcher,
    RegionSelect,
    ReloadPrompt,
  },
  data: () => ({
    topBarAbsoulte: false,
    sideNav: false,
    appName: import.meta.env.VITE_TITLE,
    appVersion: window.__APP_VERSION__,
    activeRegion: null,
    bottom_link: true,
    links: ["about", "imprint", "terms", "howto", "press", "dataprotection"],
    theme: "lsmLightTheme",
    selection: null,
    absolute: false,
    loader_visible: "loading",
    content_routes: [
      "about",
      "claim",
      "definition",
      "glossar",
      "participate",
      "press",
      "help",
      "contact",
    ],
  }),
  computed: {
    ...mapState("news", ["news"]),
    ...mapState("loader", ["loading"]),
    ...mapState("site", ["language", "themeDark", "siteName"]),
    ...mapGetters("site", ["themeColor"]),
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("users", ["user"]),
    isLoggedIn: function () {
      return this.$store.getters["auth/isLoggedIn"];
    },
    menuItems: function () {
      var routes = [];
      var mdRoutes = [];
      for (var i in this.$router.options.routes) {
        var route = this.$router.options.routes[i];

        var hasProp = Object.prototype.hasOwnProperty.call(route, "title");
        if (Object.prototype.hasOwnProperty.call(route, "title")) {
          if (
            (Object.prototype.hasOwnProperty.call(route, "meta") &&
              Object.prototype.hasOwnProperty.call(
                route.meta,
                "requiresAuth"
              ) &&
              ((route.meta.requiresAuth === false && !this.isLoggedIn) ||
                (route.meta.requiresAuth === true && this.isLoggedIn))) ||
            Object.prototype.hasOwnProperty.call(route.meta, "content")
          ) {
            if (
              Object.prototype.hasOwnProperty.call(route.meta, "requiresRole")
            ) {
              if (
                this.$store.getters["auth/getRole"].length > 0 &&
                this.$store.getters["auth/getRole"].includes(
                  route.meta.requiresRole
                )
              ) {
                routes.push(route);
              }
            } else {
              routes.push(route);
            }
          }
        } else if (Object.prototype.hasOwnProperty.call(route, "children")) {
          let mdRoute = route.children[0];
          this.content_routes.forEach((rut) => {
            if (mdRoute.name == "site-" + rut + "_" + this.language) {
              mdRoute["title"] = "menu.content_menu." + rut;
              mdRoute["path"] = route.path;
              mdRoute["id"] = rut;
              mdRoute["icon"] = "mdi-text";
              mdRoute["meta"]["title"] = "menu.content_menu." + rut;
              mdRoutes.push(mdRoute);
              return;
            }
          });
        }
      }
      mdRoutes.sort(
        (a, b) =>
          this.content_routes.indexOf(a["id"]) -
          this.content_routes.indexOf(b["id"])
      );
      return [...routes, ...mdRoutes];
    },
  },
  watch: {
    // eslint-disable-next-line
    // activeRegion: function (newState, oldState) {
    //   if (newState != oldState) {
    //     console.log("watch activeRegion", newState, oldState);
    //     if (newState.id != this.regionId) {
    //       this.$store.dispatch("region/fetchRegion", newState).then(() => {
    //         console.log("resolve region/fetchRegion", this.regionId);
    //       });
    //     }
    //   }
    // },
    selection: function (newState, oldState) {
      if (newState != oldState) {
        console.log("watch selection", newState[0], oldState);
        if (newState[0] != this.regionId) {
          this.$store.dispatch("region/fetchRegion", newState[0]).then(() => {
            console.log("resolve region/fetchRegion", this.regionId);
          });
        }
      }
    },
  },
  created() {
    this.init();
    const { width, mobile, name } = useDisplay();
  },
  methods: {
    async init() {
      this.$store.dispatch("site/setLanguage", this.language);
      this.$store.dispatch("site/setName");
      await this.$store.dispatch("auth/init").then((reason) => {
        this.$store.dispatch("regions/load");
        this.$store.dispatch("news/load");
        this.$store.dispatch("region/load").then(() => {
          this.activeRegion = this.$store.state.regionData;
          if (this.activeRegion) {
            this.$store.dispatch("locations/load").then(() => {});
          }
        });
      });
    },
    getSiteLink(link) {
      const lang = this.language;
      return "/site/" + link + "_" + lang;
    },
    setActive: function (region) {
      this.$store.dispatch("loader/show");
      this.$store.dispatch("region/fetchRegion", region).then(() => {
        this.$store.dispatch("loader/hide");
      });
    },
    logout: function () {
      this.$store.dispatch("auth/logout").then(() => {
        const toast = useToast();
        toast.success("You have been successfully logged out");
        this.$router
          .push({
            name: "home",
            replace: true,
          })
          .then((result) => {})
          .catch((err) => {
            console.log("router catch logout", err);
          });
      });
    },
    deselect: function () {
      this.$store.dispatch("region/clear").then(() => {
        this.activeRegion = null;
      });
    },
  },
};
</script>
<style lang="scss">
//import "@/styles/main.scss"
</style>
