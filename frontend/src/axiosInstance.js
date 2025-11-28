import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default axiosInstance;
