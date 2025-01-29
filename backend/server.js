const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const profilesRoute = require("./routes/profiles");

require("dotenv").config();

const app = express();

// middlewar
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/profiles", profilesRoute);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});