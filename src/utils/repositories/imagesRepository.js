import api from "@/utils/api.js";
import store from "@/store";

export default {
  getApiImageUrl(containerId, fileName) {
    return (
      import.meta.env.VITE_API_URL +
      "/api/Attachments/" +
      containerId +
      "/download/" +
      fileName
    );
  },

  get(placeId) {
    let url = `places/${placeId}/images`;
    return api.get(`${url}`);
  },
  update(image) {
    console.log("repo update image", image);
    let placeId = store.getters["place/placeId"];
    let imageId = image.id;
    let url = `places/${placeId}/images/${imageId}`;

    return api.put(`${url}`, image);
  },

  upload(params, onUploadProgress) {
    let placeId = store.getters["place/placeId"];
    let formData = new FormData();

    Object.entries(params).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const config = {
      onUploadProgress: onUploadProgress,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    return api.post(`places/${placeId}/images`, formData, config);
  },
  delete(image) {
    let placeId = store.getters["place/placeId"];
    let imageId = image.id;
    let url = `places/${placeId}/images/${imageId}`;
    return api.delete(`${url}`);
  },
};
