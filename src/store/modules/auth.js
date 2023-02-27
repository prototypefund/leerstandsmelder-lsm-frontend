import api from "@/utils/api";

const baseDomain = import.meta.env.VITE_API_URL;

export const auth = {
  namespaced: true,
  state: {
    status: "",
    token: localStorage.getItem("access-token") || "",
    email: localStorage.getItem("uid") || "",
    client: localStorage.getItem("client") || "",
    userId: localStorage.getItem("userId") || "",
    scope: localStorage.getItem("scope") || "",
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_register(state, userId) {
      state.status = "registering";
      state.userId = userId;
    },
    auth_success(state, payload) {
      state.status = "success";
      state.token = payload.token;
      state.email = payload.email;
    },
    auth_error(state) {
      state.status = "error";
    },
    credentials_request(state) {
      state.status = "credentials_loading";
    },
    credentials_success(state, payload) {
      state.status = "credentials_success";
      state.userId = payload.userId;
      state.scope = payload.scope;
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.email = "";
      state.userId = "";
      state.scope = "";
    },
  },
  actions: {
    login({ dispatch, commit }, data) {
      let user = {
        email: data.email,
        password: data.password,
      };
      let url = `${baseDomain}/api/v1/auth/sign_in`;
      return new Promise((resolve, reject) => {
        commit("auth_request");
        api({
          url: url,
          data: user,
          method: "POST",
        })
          .then((resp) => {
            const token = localStorage.getItem("access-token");
            const email = localStorage.getItem("uid");
            if (email) {
              this.state.auth.token = token;
              this.state.auth.email = email;
              commit("auth_success", { token: token, email: email });
              dispatch("getCredentials").then((response) => {
                resolve(resp);
              });
            } else {
              reject("No Login");
            }
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("access-token");
            reject(err.response);
          });
      });
    },
    getCredentials({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        dispatch("users/fetchUser", null, { root: true })
          .then((resp) => {
            var attributes = resp.data.attributes || resp.data || resp;

            if (attributes) {
              let scope = attributes.role_keys;
              let userId = attributes.id;
              localStorage.setItem("scope", JSON.stringify(scope));
              localStorage.setItem("userId", userId);
              commit("credentials_success", { userId: userId, scope: scope });
              //commit("users/setUser", attributes, { root: true });
              resolve(resp);
            } else {
              reject("NO KEYS");
            }
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("access-token");
            localStorage.removeItem("userId");
            localStorage.removeItem("scope");
            reject(err);
          });
      });
    },
    init({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("access-token")) {
          commit("auth_success", {
            token: localStorage.getItem("access-token"),
            email: localStorage.getItem("uid"),
          });
          if (localStorage.getItem("userId") && localStorage.getItem("scope")) {
            commit("credentials_success", {
              userId: localStorage.getItem("userId"),
              scope: localStorage.getItem("scope"),
            });
            dispatch("users/fetchUser", null, { root: true });
          } else {
            dispatch("getCredentials").then((response) => {});
          }

          resolve("TOKEN SET");
        } else {
          //TODO: ?redirect to login?
          resolve("NO TOKEN");
        }
      });
    },
    callback({ commit }, data) {
      return new Promise((resolve, reject) => {
        //console.log("auth store callback", data);
        api({
          url: `${baseDomain}/api/v1/auth/validate_token`,
          method: "GET",
        })
          .then((resp) => {
            var attributes = resp.data.attributes || resp.data || resp;
            if (attributes) {
              let scope = attributes.role_keys;
              let userId = attributes.id;
              localStorage.setItem("scope", JSON.stringify(scope));
              localStorage.setItem("userId", userId);
              commit("credentials_success", { userId: userId, scope: scope });
              resolve(resp);
            } else {
              reject("NO KEYS");
            }
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("access-token");
            localStorage.removeItem("userId");
            localStorage.removeItem("scope");
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        api({
          url: `${baseDomain}/api/v1/auth`,
          data: user,
          method: "POST",
        })
          .then((resp) => {
            const userId = resp.id;
            commit("auth_register", userId);
            resolve(resp);
          })
          .catch((err) => {
            var message = "An error occured. Please contact the support team.";
            if (err.response && err.response.data) {
              if (err.response.data.errors.full_messages) {
                err.response.data.errors.full_messages.forEach((element) => {
                  message = element;
                });
              }
            }
            console.log("register catch", message);
            commit("auth_error", message);
            reject(message);
          });
      });
    },
    confirm({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        api({
          url: `${baseDomain}/api/v1/auth/confirmation`,
          data: data,
          method: "POST",
        })
          .then((resp) => {
            const userId = resp.id;
            commit("auth_register", userId);
            resolve(resp);
          })
          .catch((err) => {
            console.log("confirmation catch", err);
            commit("auth_error", err);
            localStorage.removeItem("access-token");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        api({
          url: `${baseDomain}/api/v1/auth/sign_out`,
          method: "DELETE",
        })
          .then((resp) => {
            console.log("logout then", resp);
            localStorage.removeItem("access-token");
            localStorage.removeItem("email");
            localStorage.removeItem("client");
            localStorage.removeItem("uid");
            localStorage.removeItem("scope");
            localStorage.removeItem("userId");
            localStorage.removeItem("token-type");
            localStorage.removeItem("lsm");
            commit("logout");
            commit("users/resetState", null, { root: true });
            resolve("LOGGED_OUT");
          })
          .catch((err) => {
            console.log("logout catch", err);
            localStorage.removeItem("access-token");
            localStorage.removeItem("email");
            localStorage.removeItem("client");
            localStorage.removeItem("uid");
            localStorage.removeItem("scope");
            localStorage.removeItem("userId");
            localStorage.removeItem("token-type");
            localStorage.removeItem("lsm");
            commit("logout");
            commit("auth_error", err);

            //reject(err);
          });
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.scope.includes("admin"),
    authStatus: (state) => state.status,
    getUser: (state) => state.userId,
    getToken: (state) => state.token,
    getRole: (state) => state.scope,
  },
};
