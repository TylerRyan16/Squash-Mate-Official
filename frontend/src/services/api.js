import axios from "axios";

const API_BASE_URL = "https://squash-mates.onrender.com/api";

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
        console.log("attempting to create account in api.js");
        console.log("userData in api.js: ", userData);

        const response = await api.post("/profiles/", userData);
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


// GET LOGGED IN USER NAME
export const getMyUsername = async () => {
    try {
        const response = await api.get("/profiles/my-username");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch username.";
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

// GET SPECIFIC VIDEO
export const getSpecificVideo = async (videoID) => {
    try {
        const response = await api.get(`/videos/${videoID}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch video."
    }
}

// UPLOAD VIDEO
export const uploadVideo = async (videoDetails) => {
    try {
        const response = await axios.post("/videos", videoDetails);

        console.log("Video uploaded: ", response.data);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.error) {
            alert(error.response.data.error);
        } else {
            console.error("error creating profile: ", error);
            alert("An error occurred while creating your profile. Please try again.");
        }

    }
}


// COMMENT ON VIDEO
export const commentOnVideo = async (videoDetails) => {
    try {
        const response = await axios.post("/videos", videoDetails);

        console.log("Video uploaded: ", response.data);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.error) {
            alert(error.response.data.error);
        } else {
            console.error("error commenting on video: ", error);
            alert("An error occurred while commenting on this video.");
        }

    }
}

// GET COMMETNS ON VIDEO
export const getCommentsForVideo = async (videoID) => {
    try {
        console.log("SAW VIDEO ID: ", videoID);
        const response = await axios.get(`/comments/${videoID}`)
        console.log("response: ", response);
        return response.data;
    } catch (error){
        if (error.response && error.response.data.error){
            alert(error.response.data.error);
        } else {
            console.error("error grabbing comments: ", error);
            alert("An error occurred while grabbing the comments. Please try again.");
        }
    }
}