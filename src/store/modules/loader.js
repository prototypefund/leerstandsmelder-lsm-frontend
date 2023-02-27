export const loader = {
  namespaced: true,
  state: {
    loading: false,
  },
  actions: {
    show({ commit }) {
      commit("show");
    },
    hide({ commit }) {
      setTimeout(() => {
        commit("hide");
      }, 1000);
    },
  },
  mutations: {
    show(state) {
      state.loading = true;
    },
    hide(state) {
      state.loading = false;
    },
  },
};
