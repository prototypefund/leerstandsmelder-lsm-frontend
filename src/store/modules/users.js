//import Vue from "vue";
import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const UserRepository = RepositoryFactory.get("users");

const initialState = {
  reset: false,
  reset_token: "",
  user: {
    nickname: "",
    email: "",
    message_me: false,
    notify: false,
    share_email: false,
    accept_terms: false,
  },
  places: [],
};

export const users = {
  namespaced: true,
  state: { ...initialState },
  actions: {
    fetchUser(context) {
      return new Promise((resolve, reject) => {
        UserRepository.get()
          .then((data) => {
            context.commit("setUser", data.data.attributes);
            resolve(data);
          })
          .catch((err) => {
            context.commit("errorUsers");
            reject(err);
          });
      });
    },

    setUser({ commit }, data) {
      commit("setUser", data.user);
      return data.user;
    },
    createUser({ state }) {
      return UserRepository.create(state.user);
    },
    deleteUser(context, slug) {
      return UserRepository.destroy(slug);
    },
    updateUser({ state }) {
      return UserRepository.update(state.user.id, state.user);
    },
    reset({ commit }) {
      commit("resetState");
    },
    newPassword({ state }, email) {
      return UserRepository.newPassword(email);
    },
    updatePassword({ state }, password) {
      return UserRepository.updatePassword(password);
    },
    validatePasswordToken({ state }, token) {
      return UserRepository.validatePasswordToken(token);
    },
    fetchPlaces({ commit, state }) {
      return new Promise((resolve, reject) => {
        UserRepository.getPlaces(this.state.auth.userId)
          .then((data) => {
            commit("setPlaces", data);
            resolve(data);
          })
          .catch((err) => {
            commit("errorPlaces", err);
            reject(err);
          });
      });
    },
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setPlaces(state, places) {
      state.places = places;
    },

    setComments(state, comments) {
      state.comments = comments;
    },
    resetState(state) {
      for (let f in state) {
        //Vue.set(state, f, initialState[f]);
        state[f] = initialState[f];
      }
    },
    errorUsers(state) {
      console.log("TODO: errorUser mutation");
    },
    errorPlaces(state, error) {
      console.log("TODO: errorPlaces mutation", error);
    },
  },
  getters: {
    user: (state) => state.user,
    comments: (state) => state.comments,
    myPlaces: (state) => state.places,
  },
};
