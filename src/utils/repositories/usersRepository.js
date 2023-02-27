import api from "@/utils/api.js";
import store from "@/store";

export default {
  get() {
    let url = "/me";
    return api.get(url);
  },
  getPlaces(userId) {
    let url = `users/${userId}/places`;
    return api.get(`${url}`);
  },
  registerUser(payload) {
    let url = "/users";
    return api.post(`${url}`, payload);
  },
  newPassword(payload) {
    let url = "/auth/password";
    payload["redirect_url"] =
      import.meta.env.VITE_API_URL + "/api/v1/auth/sign_in";
    return api.post(`${url}`, payload);
  },
  updatePassword(payload) {
    let url = "/auth/password/";
    //payload['redirect_url'] = import.meta.env.VITE_API_URL + '/api/v1/auth/sign_in';
    return api.put(`${url}`, payload);
  },
  validatePasswordToken(payload) {
    let url = "/auth/password/edit";
    //payload['redirect_url'] = import.meta.env.VITE_API_URL + '/api/v1/auth/sign_in';
    return api.get(`${url}`, payload);
  },
  getAll(filter) {
    let filter_query = "";
    if (filter) {
      filter_query = "?filter=" + filter;
    }

    console.log("in get all users", filter);
    let url = "/users" + filter_query;
    return api.get(url);
  },
  removeUser(userId) {
    console.log("removeUser", userId);
    let url = "/users/" + userId;
    console.log("removeUserUrl", url);
    return api.delete(`${url}`);
  },
  update(userId, payload) {
    console.log("updateUser", payload);
    if (userId || payload.uuid) {
      let url = "/users/" + userId || payload.uuid;
      console.log("updateUser", url);

      return api.put(`${url}`, payload);
    }
  },
};
