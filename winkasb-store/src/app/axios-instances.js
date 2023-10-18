import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

const http = {
  get: request.get,
  post: request.post,
  patch: request.patch,
  delete: request.delete,
  put: request.put,
};

export default http;
