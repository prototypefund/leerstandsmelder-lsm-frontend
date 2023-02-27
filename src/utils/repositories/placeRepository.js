import api from "@/utils/api.js";
import store from "@/store";

export default {
  query(type, params) {
    return api.query("places" + (type === "filter" ? "/filter" : ""), {
      params: params,
    });
  },
  get(slug, adminCall = false) {
    let queryString = "";
    if (adminCall) {
      queryString = "?versions=1";
    }
    return api.get(`places/${slug}${queryString}`);
  },
  create(params) {
    let region = store.getters["region/getregionData"];
    params["layer_id"] = region.default_layer;
    let url =
      "/maps/" + region.id + "/layers/" + region.default_layer + "/places/";
    return api.post(url, { place: params });
  },
  update(slug, params) {
    return api.put(`places/${slug}`, { place: params });
  },
  destroy(slug) {
    return api.delete(`places/${slug}`);
  },
};
