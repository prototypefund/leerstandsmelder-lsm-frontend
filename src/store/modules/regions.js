import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const MapsRepository = RepositoryFactory.get("maps");

const initialState = {
  status: "initial",
  regions: {},
};

export const regions = {
  namespaced: true,
  state: { ...initialState },
  mutations: {
    regions_request(state) {
      state.status = "loading";
    },
    regions_success(state, payload) {
      state.status = "loaded";
      state.regions = payload.regions;
    },
    regions_error(state) {
      state.status = "error";
    },
    clear(state) {
      for (let f in state) {
        state[f] = initialState[f];
      }
    },
  },
  actions: {
    load({ dispatch, commit, state }) {
      if (state.status == "initial" || state.status == undefined) {
        dispatch("fetchRegions");
      }
    },
    fetchRegions({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit("regions_request");
        MapsRepository.getAllMaps()
          .then((resp) => {
            this.state.regions = resp;
            commit("regions_success", { regions: resp });
            resolve(resp);
          })
          .catch((err) => {
            commit("regions_error");
            reject(err);
          });
      });
    },
    clear({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        commit("clear");
        dispatch("location/clear", null, { root: true });
        resolve("cleared");
      });
    },
  },
  getters: {
    regionsStatus: (state) => state.status,
    getRegions: (state) => state.regions,
    getActive: (state) => state.active,
    geoJsonRegions: (state) => {
      let collection = [];
      collection = state.regions.map((x) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [x.mapcenter_lat, x.mapcenter_lon],
        },
        properties: {
          id: x.id,
          titel: x.title,
        },
      }));
      console.log("geoJsonRegions", collection);
      return {
        show: true,
        data: {
          type: "FeatureCollection",
          features: collection,
        },
        paint: {},
      };
    },
  },
};
