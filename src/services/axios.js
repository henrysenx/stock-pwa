// // src/services/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ replace with your actual API
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

// src/services/axios.js
import axios from "axios";

export const finHubAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const alphaVantageApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL2,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
