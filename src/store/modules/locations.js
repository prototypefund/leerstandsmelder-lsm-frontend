import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const MapsRepository = RepositoryFactory.get("maps");
import grouper from "@/utils/grouper.js";
import { toRaw } from "vue";

export const locations = {
  namespaced: true,
  state: {
    status: "initial",
    locations: [],
    startDate: "2010-01",
    endDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1),
    dateField: "created_at",
    filterField: "",
    filterValue: "",
    // field => value list
    filters: {
      //owner: ["city"],
    },
  },
  mutations: {
    locations_request(state) {
      state.status = "loading";
    },
    locations_success(state, payload) {
      state.status = "loaded";
      state.locations = payload.locations;
    },
    locations_error(state) {
      state.status = "error";
    },
    clear(state) {
      state.status = "";
      state.locations = [];
    },
    add_filter(state, filter) {
      state.filters[filter.key] = filter.value;
    },
    set_start_date(state, dateValue) {
      state.startDate = dateValue;
    },
    set_end_date(state, dateValue) {
      state.endDate = dateValue;
    },
    set_date_field(state, dateField) {
      state.dateField = dateField;
    },
    set_date_filter(state, payload) {
      state.startDate = payload.startDate;
      state.endDate = payload.endDate;
      state.dateField = payload.dateField;
    },
  },
  actions: {
    load({ dispatch, commit, state }) {
      if (state.status == "initial" || state.status == undefined) {
        dispatch("fetchLocations");
      }
    },
    fetchLocations({ commit }, data) {
      return new Promise((resolve, reject) => {
        if (
          this.state.region.regionData != "" &&
          this.state.region.regionData.id != undefined
        ) {
          MapsRepository.getLayerGeoJson(
            this.state.region.regionData.id,
            this.state.region.regionData.default_layer
          )
            .then((resp) => {
              console.log("fetchLocations layer geojson resp", resp);
              var geojson = resp;

              commit("locations_success", {
                locations: geojson,
              });
              resolve(geojson);
            })
            .catch((err) => {
              commit("error");
              reject(err);
            });
        } else {
          commit("locations_error");
          reject("No locations found");
        }
      });
    },
    setDateFilter({ commit }, data) {
      commit("set_date_filter", data);
    },
    setDateField({ commit }, data) {
      commit("set_date_field", data);
    },
    setStartDate({ commit }, data) {
      commit("set_start_date", data);
    },
    setEndDate({ commit }, data) {
      commit("set_end_date", data);
    },
    clear({ commit }) {
      return new Promise((resolve, reject) => {
        commit("clear");
        this.state.locations = {};

        resolve("locattions cleared");
      });
    },
    addFilter({ commit }, filter) {
      commit("add_filter", filter);
    },
  },
  getters: {
    locationsStatus: (state) => state.status,
    getLocations: (state) => state.locations,
    locations: (state) => state.locations,
    filteredLocations: (state) => {
      let calculatedLocs = [];
      if (state.locations && state.locations.features) {
        let copyLocations = [...state.locations.features];
        // console.log("getter Filtered copyLocations:", copyLocations);
        // var datedLocs = filterDates(
        //   copyLocations,
        //   state.startDate,
        //   state.endDate,
        //   state.dateField
        // );
        // console.log("getter Filtered datedLocs:", datedLocs);
        // if (Object.keys(state.filters).length) {
        //   for (const [filter_field, filter_values] of Object.entries(
        //     state.filters
        //   )) {
        //     calculatedLocs = datedLocs.filter((item) => {
        //       if (item.properties[filter_field]) {
        //         if (Array.isArray(item.properties[filter_field])) {
        //           return item.properties[filter_field].some((r) =>
        //             filter_values.includes(r)
        //           );
        //         } else {
        //           return filter_values.includes(item.properties[filter_field]);
        //         }
        //       } else {
        //         return true;
        //       }
        //     });
        //   }
        // } else {
        //   calculatedLocs = datedLocs;
        // }
        calculatedLocs = copyLocations;
      }
      return calculatedLocs;
    },
    datedLocations: (state) => {
      let datedLocs = [];
      if (state.locations && state.locations.features) {
        let copyLocations = [...state.locations.features];
        datedLocs = filterDates(
          copyLocations,
          state.startDate,
          state.endDate,
          state.dateField
        );
      }
      return datedLocs;
    },
    // geoJsonSource: (state) => {
    //   return {
    //     show: true,
    //     data: {
    //       type: "FeatureCollection",
    //       features: state.filteredLocations,
    //     },
    //     paint: {},
    //   };
    // },
  },
};

function filterDates(locs, start, end, field) {
  var datedLocs = [];
  if (start != "" && end != "" && field != "") {
    datedLocs = grouper.groupInBetween(locs, start, end, field);
  } else {
    console.log("dates not set");
    datedLocs = [];
  }
  return datedLocs;
}
