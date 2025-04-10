const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");


// get all shared videos for the user
router.get("/shared-videos", async (req, res) => {
    try {
        const authToken = req.cookies.authToken;
        console.log("authtoken: ", authToken);

        if (!authToken) {
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        // get user id
        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        console.log("decoded: ", decoded);

        const result = await pool.query("SELECT id, video_id, shared_at, shared_by FROM shared_videos WHERE user_id = $1", [decoded.username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

// add a new share to database
router.post("/", async (req, res) => {
    const {video_id, shared_at, shared_by} = req.body;
    const authToken = req.cookies.authToken;
    
            if (!authToken){
                return res.status(401).json({ error: "Unauthorized. No token provided."});
            }
    
            // get user id
            const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
            const userId = decoded.userId;
    try {
        const result = await pool.query(
            `INSERT INTO shared_videos (video_id, user_id, shared_at, shared_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [video_id, userId, shared_at, shared_by]
        );


        if (result.rows.length === 0){
            return res.status(500).json({error: "Failed to add video"});
        }

        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to add video"});
    }
});

module.exports = router;