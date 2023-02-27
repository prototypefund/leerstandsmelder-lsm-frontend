//import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = import.meta.env.baseURL || import.meta.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: import.meta.env.baseURL || import.meta.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    config.headers.client = window.localStorage.getItem("client");
    config.headers["access-token"] =
      window.localStorage.getItem("access-token");
    config.headers.uid = window.localStorage.getItem("uid");
    config.headers["token-type"] = window.localStorage.getItem("token-type");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    console.log("AXIOS response", response);
    if (response.headers.client) {
      localStorage.setItem("access-token", response.headers["access-token"]);
      localStorage.setItem("client", response.headers.client);
      localStorage.setItem("uid", response.headers.uid);
      localStorage.setItem("token-type", response.headers["token-type"]);
    }
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// Plugin.install = function (Vue, options) {
//   Vue.axios = _axios;
//   window.axios = _axios;
//   //console.log('options', options)
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get() {
//         return _axios;
//       },
//     },
//     $axios: {
//       get() {
//         return _axios;
//       },
//     },
//   });
// };

// Vue.use(Plugin);

// export default Plugin;
