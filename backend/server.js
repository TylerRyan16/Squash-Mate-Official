const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const profilesRoute = require("./routes/profiles");
const videosRoute = require("./routes/videos");
const commentsRoute = require("./routes/comments");
const sharedRoute = require("./routes/shared");

require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

// middleware
app.use(cors({
    origin: ["https://squash-mates.onrender.com", "http://localhost:3000", "https://squashmate.vercel.app", "https://squashmate.club", "https://www.squashmate.club", "https://api.squashmate.club"],
    credentials: true
}));
app.use(bodyParser.json());

// routes
app.use("/api/profiles", profilesRoute);
app.use("/api/videos", videosRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/shared", sharedRoute);


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});