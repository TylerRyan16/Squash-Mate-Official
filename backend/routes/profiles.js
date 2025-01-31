const express = require("express");
const router = express.Router();
const pool = require("../config/db.js");

// add a new profile
router.post("/", async (req, res) => {
    const {username, password, age, playerLevel, clubLockerURL, firstName, lastName, country, email, dateOfBirth} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO profiles (username, password, age, player_level, club_locker_url, first_name, last_name, country, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [username, password, age ||  null, playerLevel || null, clubLockerURL || null, firstName || null, lastName || null, country ||  null, email, dateOfBirth]
        );
        console.log("adding new profile: ", username, password, age, playerLevel, clubLockerURL, firstName, lastName, country, cateOfBirth);
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