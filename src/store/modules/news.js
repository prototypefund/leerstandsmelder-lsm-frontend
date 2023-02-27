import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const NewsRepository = RepositoryFactory.get("news");
import { useRoute, useRouter } from "vue-router";

const initialState = {
  status: "initial",
  news: {},
  selection: "",
};

export const news = {
  namespaced: true,
  state: { ...initialState },
  mutations: {
    news_request(state) {
      state.status = "loading";
    },
    news_success(state, payload) {
      state.status = "loaded";
      state.news = payload.news;
    },
    news_select(state, id) {
      state.selection = id;
    },
    news_error(state) {
      state.status = "error";
    },
    clear(state) {
      for (let f in state) {
        state[f] = initialState[f];
      }
    },
  },
  actions: {
    load({ dispatch, commit, state }) {
      if (state.status == "initial" || state.status == undefined) {
        dispatch("fetchNews");
      }
    },
    fetchNews({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit("news_request");
        NewsRepository.get()
          .then((resp) => {
            commit("news_success", { news: resp });
            resolve(resp);
          })
          .catch((err) => {
            commit("news_error");
            reject(err);
          });
      });
    },
    select({ commit, state }, id) {
      // return new Promise((resolve) => {
      //   commit("news_select", id);
      //   resolve(id);
      // });
      //let ar = state.news.map((x) => x.id == state.selection);
      commit("news_select", id);
    },
    clear({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        commit("clear");
        resolve("cleared");
      });
    },
  },
  getters: {
    newsStatus: (state) => state.status,
    news: (state) => {
      return state.news;
    },
    //active: (state) => state.news.find((x) => x.id == state.selection),
    article: (state) => {
      const route = useRoute();
      if (state.news.length) {
        if (state.selection || route.params.slug) {
          let ar = state.news.find(
            (x) => x.id == state.selection || x.slug == route.params.slug
          );
          return ar;
        } else {
          return state.news[0];
        }
      } else {
        return {};
      }
    },
  },
};
