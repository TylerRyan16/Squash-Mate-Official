const express = require('express');
const router = express.Router();
const pool = require("../config/db.js");

// get all comments for specific video

router.get("/for-video/:id", async (req, res) => {
    const {id} = req.params;
    const videoID = parseInt(id, 10);
    if (isNaN(videoID)) {
        return res.status(400).json({ error: "VIDEO ID NOT A NUMBER FOR SOME FUCKING REASON" });
    }

    try {
       const result = await pool.query('SELECT * FROM comments WHERE video_id = $1', [id]);
       res.json(result.rows);
    } catch (error){
       console.error(error);
       res.status(500).json({ error: "Failed to load comments."});
    }
});

// post a comment
router.post("/", async (req, res) => {
    const {video_id, commenter_name, comment, date_posted, parent_comment_id} = req.body;
    console.log("in backend route: ", video_id, commenter_name, comment, date_posted, parent_comment_id);
    try {
        const result = await pool.query(
            `INSERT INTO comments (video_id, commenter_name, comment, date_posted, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [video_id, commenter_name, comment, date_posted, parent_comment_id || null]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to post comment."});
    }
});


module.exports = router;