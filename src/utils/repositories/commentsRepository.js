import api from "@/utils/api.js";
import store from "@/store";

export default {
  query(type, params) {
    return api.query("annotations" + (type === "filter" ? "/filter" : ""), {
      params: params,
    });
  },
  fetch(placeId = "") {
    let place = store.getters["place/place"];
    let url = `places/${place.id}/annotations`;
    return api.get(url);
  },
  get(commentId) {
    let place = store.getters["place/place"];
    let url = `places/${place.id}/annotations/${commentId}`;
    return api.get(url);
  },
  create(params) {
    let place = store.getters["place/place"];
    params["place_id"] = place.id;
    let url = `places/${place.id}/annotations/`;
    return api.post(url, { annotation: params });
  },
  update(slug, params) {
    let place = store.getters["place/place"];
    let url = `places/${place.id}/annotations/${slug}`;
    return api.put(url, { place: params });
  },
  destroy(slug) {
    let place = store.getters["place/place"];
    let url = `places/${place.id}/annotations/${slug}`;
    return api.delete(url);
  },
};
