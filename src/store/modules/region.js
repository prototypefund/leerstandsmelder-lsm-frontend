import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const MapsRepository = RepositoryFactory.get("maps");

//import { useRoute, useRouter } from "vue-router";
import router from "@/router";

export const region = {
  namespaced: true,
  state: {
    status: "initial",
    regionId: "",
    regionData: "",
    regionMap: {
      lat: "",
      lon: "",
      zoom: "",
      bounds: [
        [0, 0],
        [0, 0],
      ],
    },
  },
  mutations: {
    request(state) {
      state.status = "loading";
    },
    success(state, payload) {
      // console.log('success',payload);
      state.status = "loaded";
      state.regionId = payload.id;
      state.regionData = payload.regionData;
    },
    editMap(state, payload) {
      state.status = "editing";
      state.regionMap.lat = payload.lat || "";
      state.regionMap.lon = payload.lon || "";
      state.regionMap.zoom = payload.zoom || "";
      state.regionMap.bounds = [
        [payload.boundingbox[0], payload.boundingbox[2]],
        [payload.boundingbox[1], payload.boundingbox[3]],
      ] || [
        [0, 0],
        [0, 0],
      ];
      console.log("editMap", state.regionMap, payload);
    },
    setMap(state, payload) {
      state.regionMap.lat = payload.lat || "";
      state.regionMap.lon = payload.lon || "";
      state.regionMap.zoom = payload.zoom || "";
    },
    error(state) {
      state.status = "error";
    },
    clear(state) {
      state.status = "";
      state.regionId = "";
      state.regionData = "";
      state.regionMap = {
        lat: "",
        lon: "",
        zoom: "",
        bounds: [],
      };
    },
  },
  actions: {
    setEditMap({ commit }, data) {
      commit("editMap", data);
    },
    load({ dispatch, commit, state }) {
      if (state.status == "initial" || state.status == undefined) {
        dispatch("fetchRegion");
      } else if (state.regionData.id) {
        dispatch("locations/load", null, { root: true });
      }
    },
    fetchRegion({ dispatch, commit }, id) {
      console.log("fetchRegion region action", id, router);

      if (id != "" && id != undefined) {
        return new Promise((resolve, reject) => {
          commit("request");
          MapsRepository.getMap(id)
            .then((resp) => {
              console.log("fetchRegion region resp", resp);
              var map = resp.map;
              this.state.region.regionId = map.id;
              this.state.region.regionData = map;
              commit("setMap", {
                lat: map.mapcenter_lat,
                lon: map.mapcenter_lon,
                zoom: map.zoom || 16,
              });

              console.log("push router region", router.currentRoute.value.name);
              let new_route = "region";

              if (
                ["chart", "map", "region-place"].includes(
                  router.currentRoute.value.name
                )
              ) {
                new_route = router.currentRoute.value.name;
              }
              router
                .push({
                  name: new_route,
                  params: { region: map.slug || map.title.toLowerCase() },
                  replace: true,
                })
                .then((result) => {
                  // console.log("router result", result);
                })
                .catch((err) => {
                  console.log("router catch", err);
                });

              commit("success", { regionId: map.id, regionData: map });
              dispatch("locations/fetchLocations", null, { root: true });
              resolve(map);
            })
            .catch((err) => {
              commit("error");
              reject(err);
            });
        });
      }
    },
    setMap({ dispatch, commit }, data) {
      console.log("set map action", data);

      return new Promise((resolve, reject) => {
        if (data.id != "" && data.id != undefined) {
          commit("setMap", {
            lat: data.lat,
            lon: data.lon,
            zoom: data.zoom || 16,
          });
          resolve(data);
        }
      });
    },

    clear({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        commit("clear");
        dispatch("locations/clear", null, { root: true });
        router
          .push({
            name: "home",
            replace: true,
          })
          .then((result) => {
            resolve("cleared");
            // console.log("router result", result);
          })
          .catch((err) => {
            console.log("router catch", err);
          });
      });
    },
  },
  getters: {
    regionStatus: (state) => state.status,
    regionUrl: (state) =>
      state.regionData.slug || state.regionData.title.toLowerCase(),
    getregionData: (state) => state.regionData,
    getregionMap: (state) => state.regionMap,
    mapcenter: (state) => [
      state.regionData.mapcenter_lon,
      state.regionData.mapcenter_lat,
    ],
    mapzoom: (state) => state.regionData.zoom,
    getregionId: (state) => state.regionId,
    getregion: (state) => state.region,
    map_status_entries: (state) => {
      if (state.regionData && state.regionData.status) {
        let collection = [];
        collection = state.regionData.status.map((x) => ({
          title: x.title,
          value: x.id,
        }));
        return collection;
      }
      return [];
    },
  },
};
