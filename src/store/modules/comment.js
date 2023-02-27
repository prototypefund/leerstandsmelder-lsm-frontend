import { v4 as uuidv4 } from "uuid";

import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const PlaceRepository = RepositoryFactory.get("place");
const ImagesRepository = RepositoryFactory.get("images");
const CommentsRepository = RepositoryFactory.get("comments");

const initialState = {
  status: "initial",

  comment: {
    title: "",
    text: "",
    status: "",
    images: [],
  },
};

export const comment = {
  namespaced: true,
  state: { ...initialState },
  actions: {
    async fetchComment(context, commentId) {
      const { data } = await CommentsRepository.get(commentId);
      context.commit("setComment", data);
      return data;
    },
    //async createComment(context, payload) {
    //   await CommentsRepository.post(payload.slug, payload.comment);
    //   context.dispatch("fetchComments", payload.slug);
    // },
    async destroyComment(context, payload) {
      await CommentsRepository.destroy(payload.slug, payload.commentId);
      // context.dispatch("fetchComments", payload.slug);
    },
    upload(context, payload) {
      const { file, event } = payload;
      console.log(
        "upload",
        context.rootState.place.id,
        context.state.comment.id,
        file,
        event
      );
      const params = {
        title: "",
        source: "lsm-frontend",
        place_id: context.rootState.place.id,
        file: file,
        imageable_type: "Annotation",
        imageable_id: context.state.comment.id,
      };

      return ImagesRepository.upload(params, event).then((new_image) => {
        context.commit("pushImage", new_image);
        return new_image;
      });
    },

    createComment({ commit, state }) {
      return new Promise((resolve, reject) => {
        CommentsRepository.create(state.comment)
          .then((data) => {
            console.log("create comment store", data);
            commit("setComment", data);
            resolve(data);
          })
          .catch((err) => {
            commit("errorComment", err);
            reject(err);
          });
      });
    },
    reset({ commit }) {
      commit("resetState");
    },
  },

  mutations: {
    pushImage(state, image) {
      console.log("pushImage", state, initialState);
      if (!state.comment.images) {
        state.comment.images = [];
      }
      state.comment.images[state.comment.images.length] = image;
    },
    setComment(state, comment) {
      state.comment = comment;
    },
    resetComment(state) {
      state.comment = {};
    },
    resetState(state) {
      state.comment = {};
      console.log("resetState", state, initialState);
      // for (let f in state) {
      //   state[f] = initialState[f];
      // }
      // console.log("resetState", state, initialState);
    },
    errorComment(state, error) {
      state.status = "error";
      console.log("TODO: errorComment mutation", error);
    },
  },
  getters: {
    comment: (state) => state.comment,
  },
};
