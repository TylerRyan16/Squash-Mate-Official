const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");


// get all shared videos for the user
router.get("/shared-videos", async (req, res) => {
    try {
        const authToken = req.cookies.authToken;
        if (!authToken) {
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        // get user id
        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);

        const sharedVideoReferences = await pool.query("SELECT video_id FROM shared_videos WHERE user_id = $1", [decoded.userId]);
        console.log("video references: ", sharedVideoReferences);
        console.log("video references rows: ", sharedVideoReferences.rows);

        const sharedVideos = [];

        for (const videoReference of sharedVideoReferences.rows){
            const result = await pool.query("SELECT * FROM videos WHERE id = $1", [videoReference.video_id]);
            if (result.rows.length > 0){
                sharedVideos.push(result.rows[0]);
            }
        }

        console.log("returning videos: ", sharedVideos);
        return res.status(200).json(sharedVideos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No videos shared with user." });
    }
});

// add a new share to database
router.post("/", async (req, res) => {
    const { video_id, user_id, shared_at } = req.body;
    const authToken = req.cookies.authToken;

    if (!authToken) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    // get user id
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
    const shared_by = decoded.userId;

    try {
        const result = await pool.query(
            `INSERT INTO shared_videos (video_id, user_id, shared_at, shared_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [video_id, user_id, shared_at, shared_by]
        );


        if (result.rows.length === 0) {
            return res.status(500).json({ error: "Failed to share video" });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505"){
            return res.status(409).json({ error: "You've already shared this video with this user." });
        }
        res.status(500).json({ error: "Failed to share video." });
    }
});

module.exports = router;