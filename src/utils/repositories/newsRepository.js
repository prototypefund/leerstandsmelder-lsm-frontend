import api from "@/utils/api.js";
import { v4 as uuidv4 } from "uuid";

export default {
  get(filter) {
    let filter_query = "";
    if (filter) {
      filter_query = "?filter=" + filter;
    }

    let url = "/news/" + filter_query;
    return api.get(url);
  },

  getNews(newsId) {
    let url = "/news/" + newsId;
    return api.get(url);
  },

  // create(params) {
  //   if (!params.id) {
  //     params.id = uuidv4();
  //   }
  //   let url = "/news/";
  //   return api.post(url, { news params });
  // },
  // update(slug, params) {
  //   return api.put(`news/${slug}`, { news: params });
  // },
};
