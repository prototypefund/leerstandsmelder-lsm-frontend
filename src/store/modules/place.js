import { v4 as uuidv4 } from "uuid";

import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const PlaceRepository = RepositoryFactory.get("place");
const ImagesRepository = RepositoryFactory.get("images");
const CommentsRepository = RepositoryFactory.get("comments");

import router from "@/router";

const initialState = {
  status: "initial",
  place: {
    id: uuidv4(),
    published: true,
    title: "",
    teaser: "",
    lat: "",
    lon: "",
    city: "",
    postcode: "",
    borough: "",
    suburb: "",
    road: "",
    house_number: "",
    country: "",
    country_code: "",
    user: {
      nickname: "",
      email: "",
    },
    buildingType: [],
    building_type: [],
    owner: [],
  },

  images: [],
  comments: [],
};

export const place = {
  namespaced: true,
  state: { ...initialState },
  actions: {
    fetchPlace(context, placeId, prevPlace) {
      return new Promise((resolve, reject) => {
        if (prevPlace !== undefined) {
          context.commit("setPlace", prevPlace);
          resolve(prevPlace);
        }
        PlaceRepository.get(placeId)
          .then((data) => {
            context.commit("setPlace", data);
            if (data.images) {
              context.commit("setImages", data.images);
            }
            if (data.comments) {
              context.commit("setComments", data.comments);
            }
            resolve(data);
          })
          .catch((err) => {
            context.commit("errorPlace");
            reject(err);
          });
      });
    },
    fetchPlaceAdmin(context, placeId, prevPlace) {
      return new Promise((resolve, reject) => {
        if (prevPlace !== undefined) {
          context.commit("setPlace", prevPlace);
          resolve(prevPlace);
        }
        PlaceRepository.get(placeId, true)
          .then((data) => {
            context.commit("setPlace", data);
            if (data.images) {
              context.commit("setImages", data.images);
            }
            if (data.comments) {
              context.commit("setComments", data.comments);
            }
            if (data.versions) {
              context.commit("setVersions", data.versions);
            }
            resolve(data);
          })
          .catch((err) => {
            context.commit("errorPlace");
            reject(err);
          });
      });
    },

    setPlace({ commit }, data) {
      commit("setPlace", data.place);
      if (data.images) {
        commit("setImages", data.images);
      }
      return data.place;
    },

    selectPlace({ commit }, data) {
      // console.log("selectPlace", data.properties);
      router
        .push({
          name: "region-place",
          params: {
            region: data.region,
            slug: data.slug,
          },
        })
        .then((result) => {
          console.log("router result", result);
          //return false;
        })
        .catch((err) => {
          console.log("router catch", err);
        });
    },

    setPlaceFromLookup({ commit }, data) {
      commit("setPlaceFromLookup", data.place);
    },
    createPlace({ state }) {
      return PlaceRepository.create(state.place);
    },
    deletePlace(context, slug) {
      return PlaceRepository.destroy(slug);
    },
    updatePlace({ state }) {
      return PlaceRepository.update(state.place.id, state.place);
    },
    updateImage({ state }, payload) {
      return ImagesRepository.update(payload);
    },
    deleteImage(context, slug) {
      return ImagesRepository.delete(slug);
    },
    upload({ commit, state }, payload) {
      const { file, event } = payload;
      const params = {
        title: "",
        source: "lsm-frontend",
        place_id: state.place.id,
        file: file,
        imageable_type: "Place",
        imageable_id: state.place.id,
      };

      return ImagesRepository.upload(params, event).then((new_image) => {
        commit("pushImage", new_image);
        return new_image;
      });
    },
    fetchImages({ commit, state }) {
      return new Promise((resolve, reject) => {
        ImagesRepository.get(state.place.id)
          .then((data) => {
            commit("setImages", data);
            resolve(data);
          })
          .catch((err) => {
            commit("errorImages");
            reject(err);
          });
      });
    },

    fetchComments({ commit, state }) {
      return new Promise((resolve, reject) => {
        CommentsRepository.fetch(state.place.id)
          .then((data) => {
            commit("setComments", data);
            resolve(data);
          })
          .catch((err) => {
            commit("errorComments", err);
            reject(err);
          });
      });
    },
    reset({ commit }) {
      commit("resetState");
      commit("resetImages");
    },
    resetStatePlace({ commit }) {
      commit("resetState");
    },
    resetImages({ commit }) {
      commit("resetImages");
    },
  },

  mutations: {
    setPlace(state, place) {
      state.status = "loaded";
      //state.place = place;
      state.place = { ...state.place, ...place };
    },
    setPlaceFromLookup(state, place) {
      //console.log("setPlaceFromLookup", place);
      state.place.lookup = place;
      if (place.address) {
        state.place.city = place.address.city;
        state.place.suburb = place.address.suburb;
        state.place.zip = place.address.postcode;
        state.place.borough = place.address.borough;
        state.place.country = place.address.country;
        state.place.country_code = place.address.country_code;
        state.place.road = place.address.road;
        state.place.house_number = place.address.house_number;
        if (state.place.title == "") {
          state.place.title = place.display_name;
        }
      } else {
        state.place.lon = place.lon;
        state.place.lat = place.lat;
        state.place.city = place.city;
        state.place.suburb = place.suburb;
        state.place.zip = place.postcode;
        //state.place.borough = place.address.borough;
        state.place.country = place.country;
        state.place.country_code = place.country_code;
        state.place.road = place.street;
        state.place.house_number = place.housenumber;
        if (
          !state.place.id ||
          state.place.id == "" ||
          state.place.title == "" ||
          state.status != "loaded"
        ) {
          // only set for new places
          state.place.title = place.address_line1;
        }
      }
    },
    pushImage(state, image) {
      //Vue.set(state.images, state.images.length, image);
      state.images[state.images.length] = image;
    },
    setImages(state, images) {
      state.images = images;
      //Vue.set(state.place, 'images', images);
    },
    setVersions(state, versions) {
      state.versions = versions;
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    resetImages(state) {
      state.images = {};
    },
    resetState(state) {
      state = { ...initialState };
      console.log("resetState", state);
      // for (let f in state) {
      //   state[f] = initialState[f];
      // }
    },
    errorPlace(state) {
      state.status = "error";
      console.log("TODO: errorPlace mutation");
    },
    errorImages(state) {
      state.status = "error";
      console.log("TODO: errorImages mutation");
    },
    errorComments(state, error) {
      state.status = "error";
      console.log("TODO: errorComments mutation", error);
    },
  },
  getters: {
    place: (state) => state.place,
    status: (state) => state.status,
    images: (state) => state.images,
    comments: (state) => state.comments,
    placeId: (state) => state.place.id,
  },
};
