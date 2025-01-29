const express = require("express");
const router = express.Router();
const pool = require("../config/db.js");

// add a new profile
router.post("/", async (req, res) => {
    const {username, password, age, playerLevel, clubLockerURL} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO profiles (username, password, age, player_level, club_locker_url)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [username, password, age, playerLevel, clubLockerURL]
        );
        console.log("adding new profile: ", username, password, age, playerLevel, clubLockerURL);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505"){
            res.status(400).json({error: "Username already exists. Please choose a different one."});
        } else {
            console.error(error);
            res.status(500).json({error: "failed to add profile"});
        }
        
    }
});

module.exports = router;