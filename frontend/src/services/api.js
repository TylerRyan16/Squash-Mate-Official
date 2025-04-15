import axios from "axios";

const API_BASE_URL = "https://squash-mates.onrender.com/api";

// enable cookies for requests
axios.defaults.withCredentials = true;

// create API instance
const api = axios.create({
    baseURL: API_BASE_URL,
    header: { "Content-Type": "application/json" },
    withCredentials: true
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

// get all users
export const getAllUsers = async () => {
    try {
        const response = await api.get("/profiles/all-users");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch user data";
    }
}

// get profile pic for user
export const getProfilePicForPoster = async (poster) => {
    console.log("poster: ", poster);
    try {
        const response = await api.get(`/profiles/pic?username=${encodeURIComponent(poster)}`);
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to get poster profile picture.";
    }
}

export const updateProfileRequest = async (changes) => {
    try {
        const response = await api.patch("/profiles/update", changes, {withCredentials: true});
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to update profile.";
    }
}

export const checkLoggedIn = async () => {
    try {
        const response = await api.get("/profiles/logged-in");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to check if user was logged in.";
    }
}


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
        const response = await api.post("/videos", videoDetails);        
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

export const deleteVideoRequest = async (video) => {
    try {
        const response = await api.delete(`/videos/delete`, {
            data: video,
        });
        return response.data;
    } catch (error){
        console.error("error deleting video: ", error);
        alert("An error occurred while deleting the video. Please try again.");
    }
}

export const shareVideo = async (shareDetails) => {
    try {
        const response = await api.post("/shared", shareDetails);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                alert("This video has already been shared with that user.");
            } else if (error.response.data.error) {
                alert(error.response.data.error);
            }
        } else {
            console.error("error sharing video: ", error);
            alert("An error occurred while sharing the video. Please try again.");
        }

    }
}

export const getSharedVideos = async () => {
    try {
        const response = await api.get("/shared/shared-videos");
        return response.data;
    } catch (error){
        throw error.response?.data || "Failed to fetch user data";
    }
}