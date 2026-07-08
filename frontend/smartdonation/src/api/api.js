import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});


api.interceptors.request.use((config) => {

  // ✅ Skip token for login & public APIs
  if (
    config.url.includes("/login") ||
    //config.url.includes("/donor") ||
    config.url.includes("/register")
  ) {
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;