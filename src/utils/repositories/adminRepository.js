import api from "@/utils/api.js";
import store from "@/store";

export default {
  getUsers(options) {
    let url = `users?page[number]=${options.page}&page[size]=${options.itemsPerPage}&sort=${options.sortBy}&sort_dir=${options.sortDesc}`;
    if (options.query != "") {
      url = url + "&query=" + options.query;
    }

    return api.get(`${url}`);
  },
  getVersions(options) {
    let url = `versions?page[number]=${options.page}&page[size]=${options.itemsPerPage}&sort=${options.sortBy}&sort_dir=${options.sortDesc}`;
    if (options.query != "") {
      url = url + "&query=" + options.query;
    }

    return api.get(`${url}`);
  },
};
