const express = require('express');
const router = express.Router();
const pool = require("../config/db.js");

// get all videos
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM videos");
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch videos."});
    }
});

// add a new video to database
router.post("/", async (req, res) => {
    const {title, description, url, type, length, tournament_date, tournament_name, tournament_location, poster} = req.body;
    console.log("TOURNAMENT DATE IN POST: ", tournament_date);

    try {
        const result = await pool.query(
            `INSERT INTO videos (url, poster, title, description, match_type, match_length, tournament_name, tournament_date, tournament_location)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [url, poster, title, description, type, length, tournament_name, tournament_date, tournament_location]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to add video"});
    }
});

module.exports = router;