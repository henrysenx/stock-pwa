// src/services/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ replace with your actual API
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
