import axios from "axios";

const baseDomain = import.meta.env.VITE_API_URL;
const baseURL = `${baseDomain}/api/v1`;
console.log("api", baseURL);

let api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
