import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api",
    headers: {
        "Content-Type": "application/json", 
        Accept: "application/json"
    }
});

// Add auth token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;