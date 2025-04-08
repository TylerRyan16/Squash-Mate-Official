const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");

// get all videos
router.get("/all-videos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM videos");
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch videos."});
    }
});

// GET MY VIDEOS (WIP)
router.get("/my-videos", async (req, res) => {
    console.log("trying to get my  videos in backend route");
    try {
        const authToken = req.cookies.authToken;
        console.log("authtoken: ", authToken);

        if (!authToken) {
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        // get user id
        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        console.log("decoded: ", decoded);
    
        const userId = decoded.userId;
        console.log("userId: ", userId);

        const result = await pool.query("SELECT id, url, poster, date_posted, title, description, match_type, match_length, tournament_name, tournament_date, tournament_location, thumbnail FROM videos WHERE id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
        console.log(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

// add a new video to database
router.post("/", async (req, res) => {
    const {title, description, url, type, length, tournament_date, tournament_name, tournament_location, poster, thumbnail} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO videos (url, poster, title, description, match_type, match_length, tournament_name, tournament_date, tournament_location, thumbnail)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [url, poster, title, description, type, length, tournament_name, tournament_date, tournament_location, thumbnail]
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

// GET SPECIFIC VIDEO
router.get("/:id", async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing video ID" });
    }

    try {
        const result = await pool.query(`SELECT * FROM videos WHERE id = $1`, [id]);
        
        if (result.rows[0].length === 0){
            return res.status(404).json({ error: "Video not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to load specific video"});
    }

});

module.exports = router;