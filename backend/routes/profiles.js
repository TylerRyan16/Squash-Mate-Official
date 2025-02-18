const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");

// add a new profile
router.post("/", async (req, res) => {
    const {username, password, playerLevel, clubLockerURL, firstName, lastName, country, email, dateOfBirth} = req.body;

    const SECRET_KEY = process.env.SECRET_KEY;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO profiles (username, password, player_level, club_locker_url, first_name, last_name, country, email, date_of_birth)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, username, email, first_name, last_name, player_level, club_locker_url, country, date_of_birth`,
            [username, hashedPassword, playerLevel, clubLockerURL || null, firstName, lastName, country ||  null, email, dateOfBirth]
        );

        // create secure token
        const token = jwt.sign({ userId: result.rows[0].id, username: username}, SECRET_KEY, {expiresIn: "7d"});

        // Save a cookie that keeps logged in for 7 days
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]); 

        console.log("adding new profile in backend: ", username, password, playerLevel, clubLockerURL, firstName, lastName, country, dateOfBirth);
        res.status(201).json( {message: "User created successfully", user: result.rows[0]});
    } catch (error) {
        if (error.code === "23505"){
            res.status(400).json({error: "Username already exists. Please choose a different one."});
        } else {
            console.error(error);
            res.status(500).json({error: "failed to add profile"});
        }
        
    }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const SECRET_KEY = process.env.SECRET_KEY;

    try {
        const result = await pool.query("SELECT * FROM profiles WHERE email = $1", [email]);

        // if no result, invalid
        if (result.rows.length === 0){
            return res.status(400).json({error: "Invalid email or password"});
        }
        // get user from result
        const user = result.rows[0];

        // check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({ error: "Invalid email or password"});
        }

        // generate JWT Token
        const token = jwt.sign({userId: user.id, username: user.username}, SECRET_KEY, {expiresIn: "7d"});

        // set token in http-only cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        // json response
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                playerLevel: user.playerLevel,
                clubLockerURL: user.club_locker_url,
                country: user.country,
                dateOfBirth: user.date_of_birth,
            },
        });

        console.log("signed user in: ", user);
        
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch videos."});
    }
});

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.json({message: "Logged out successfully!"});
});

// GET MY PROFILE
router.get("/me", async (req, res) => {
    try {
        const authToken = req.cookies.authToken;

        if (!authToken){
            return res.status(401).json({ error: "Unauthorized. No token provided."});
        }

        // get user id
        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const result = await pool.query("SELECT username, email, first_name, last_name, player_level, club_locker_url, country, date_of_birth FROM profiles WHERE id = $1", [userId]);

        if (result.rows.length === 0){
            return res.status(401).json({error: "User not found"});
        }

        res.json(result.rows[0]);
        console.log(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch user data."});
    }
});

// GET MY PROFILE
router.get("/my-username", async (req, res) => {
    try {
        const authToken = req.cookies.authToken;

        if (!authToken){
            return res.status(401).json({ error: "Unauthorized. No token provided."});
        }

        // get user id
        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const result = await pool.query("SELECT username FROM profiles WHERE id = $1", [userId]);

        if (result.rows.length === 0){
            return res.status(401).json({error: "User not found"});
        }

        res.json(result.rows[0]);
        console.log(result.rows[0]);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch user data."});
    }
});

module.exports = router;