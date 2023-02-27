import api from "@/utils/api.js";
import { v4 as uuidv4 } from "uuid";

export default {
  getAllMaps(filter) {
    let filter_query = "";
    if (filter) {
      filter_query = "?filter=" + filter;
    }

    let url = "/maps/" + filter_query;
    return api.get(url);
  },

  getMap(mapId) {
    let url = "/maps/" + mapId;
    return api.get(url);
  },
  getLayerGeoJson(mapId, layerId) {
    let url = "/maps/" + mapId + "/layers/" + layerId + ".geojson";
    // console.log("in getLayerGeoJson", url);
    return api.get(url);
  },

  create(params) {
    if (!params.id) {
      params.id = uuidv4();
    }
    let url = "/maps/";
    return api.post(url, { map: params });
  },
  update(slug, params) {
    return api.put(`maps/${slug}`, { map: params });
  },
};
