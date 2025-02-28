const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const profilesRoute = require("./routes/profiles");
const videosRoute = require("./routes/videos");
const commentsRoute = require("./routes/comments");

require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

// middlewar
app.use(cors({
    origin: "https://squash-mates.onrender.com",
    credentials: true
}));
app.use(bodyParser.json());

// routes
app.use("/api/profiles", profilesRoute);
app.use("/api/videos", videosRoute);
app.use("/api/comments", commentsRoute);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on https://squash-mates.onrender.com:${PORT}`);
});