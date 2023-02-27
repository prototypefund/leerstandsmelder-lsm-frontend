import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  key: "lsm",
  modules: ["site", "auth", "regions", "region"],
  storage: window.localStorage,
});

import { site } from "./modules/site";
import { loader } from "./modules/loader";
import { auth } from "./modules/auth";
import { region } from "./modules/region";
import { regions } from "./modules/regions";
import { locations } from "./modules/locations";
import { place } from "./modules/place";
import { comment } from "./modules/comment";
import { users } from "./modules/users";
import { news } from "./modules/news";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    site,
    loader,
    auth,
    region,
    regions,
    locations,
    place,
    comment,
    users,
    news,
  },
  plugins: [vuexLocal.plugin],
});
