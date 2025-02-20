import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// enable cookies for requests
axios.defaults.withCredentials = true;

// create API instance
const api = axios.create({
    baseURL: API_BASE_URL,
    header: { "Content-Type": "application/json" },
});

// CREATE ACCOUNT
export const createAccount = async (userData) => {
    try {
        const response = await api.post("/profiles", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error creating account";
    }
};

// LOGIN
export const login = async (email, password) => {
    try {
        const response = await api.post("/profiles/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error logginng in";
    }
}

// LOGOUT
export const logout = async () => {
    try {
        await api.post("/profiles/logout");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// GET USER DATA
export const getUserData = async () => {
    try {
        const response = await api.get("/profiles/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch user data";
    }
};

// GET ALL VIDEOS
export const getAllVideos = async () => {
    try {
        console.log("Getting videos in api");
        const response = await api.get("/videos/all-videos");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch video data";
    }
}

// GET MY VIDEOS
export const getMyVideos = async () => {
    try {
        const response = await api.get("/videos/my-videos");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch video data";
    }
}