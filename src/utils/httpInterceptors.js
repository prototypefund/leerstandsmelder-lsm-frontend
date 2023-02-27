import httpClient from "./api";
import store from "@/store/";
import i18n from "@/i18n";

const actionScope = `loader`;

export function setupInterceptors({ dispatch }) {
  let requestsPending = 0;

  const req = {
    pending: () => {
      requestsPending++;
      dispatch(`${actionScope}/show`);
    },
    done: () => {
      requestsPending--;

      if (requestsPending <= 0) {
        dispatch(`${actionScope}/hide`);
      }
    },
  };

  httpClient.interceptors.request.use(
    (config) => {
      req.pending();
      var lang = i18n.global.locale;
      var locale = store.getters["site/language"];
      //console.log("intercept", lang, locale);
      config.params = {
        ...config.params,
        locale: store.getters["site/language"],
      };
      //TODO: use store instead of localstorage
      config.headers.client = window.localStorage.getItem("client");
      config.headers["access-token"] =
        window.localStorage.getItem("access-token");
      config.headers.uid = window.localStorage.getItem("uid");
      config.headers["token-type"] = window.localStorage.getItem("token-type");
      //config.headers["access-control-allow-origin"] = "*";

      return config;
    },
    (error) => {
      requestsPending--;

      req.done();

      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(
    ({ data, headers }) => {
      req.done();
      if (headers.client) {
        localStorage.setItem("access-token", headers["access-token"]);
        localStorage.setItem("client", headers.client);
        localStorage.setItem("uid", headers.uid);
        localStorage.setItem("token-type", headers["token-type"]);
      }

      return Promise.resolve(data);
    },
    (error) => {
      req.done();

      return Promise.reject(error);
    }
  );
}
