const express = require('express');
const router = express.Router();
const pool = require("../config/db.js");

// get all comments
router.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments');
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to load comments."});
    }
});

// post a comment
router.post("/", async (req, res) => {
    const {video_id, commenter_name, comment, date_posted, parent_comment_id} = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO comments (video_id, commenter_name, comment, date_posted, parent_comment_id)
            VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
            [video_id, commenter_name, comment, parent_comment_id || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to post comment."});
    }
});

module.exports = router;