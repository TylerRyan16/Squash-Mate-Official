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
    const {url, poster, title, description} = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO videos (url, poster, title, description, date_posted)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [url, poster, title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to add video"});
    }
});

module.exports = router;