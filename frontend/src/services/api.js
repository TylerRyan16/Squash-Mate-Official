import axios from "axios";

const API_BASE_URL = "https://squash-mates.onrender.com/api";

// enable cookies for requests
axios.defaults.withCredentials = true;

// create API instance
const api = axios.create({
    baseURL: API_BASE_URL,
    header: { "Content-Type": "application/json" },
});

// PROFILES

// CREATE ACCOUNT
export const createAccount = async (userData) => {
    try {
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


// VIDEOS

// GET ALL VIDEOS
export const getAllVideos = async () => {
    try {
        const response = await api.get("/videos/all-videos");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch video data";
    }
}

// GET MY VIDEOS
export const getMyVideos = async () => {
    console.log("trying to get videos in API");
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
    console.log("HEREE");
    console.log(videoDetails);
    try {
        const response = await api.post("/videos", videoDetails);

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

// COMMENTS

// COMMENT ON VIDEO
export const commentOnVideo = async (data) => {
    try {
        console.log("commenting on video with data: ", data);
        const response = await api.post("/comments", data);        
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
        const response = await api.get(`/comments/for-video/${videoID}`)
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

// DELETE COMMENT
export const deleteCommentRequest = async (comment) => {
    try {
        const response = await api.delete(`/comments/delete`, {
            data: comment,
        });
        return response.data;
    } catch (error){
        console.error("error deleting comment: ", error);
        alert("An error occurred while deleting the comment. Please try again.");
    }
}