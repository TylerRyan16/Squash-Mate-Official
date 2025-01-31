import "./login.scss";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";


const Landing = () => {
    const navigate = useNavigate();

    // store email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginValid, setLoginValid] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShowErrorMessage(false);

        if (name === "email") {
            setEmail(value);
        }

        if (name === "password") {
            setPassword(value);
        }

    };

    const validateUserLogin = (e) => {
        e.preventDefault();

        console.log("validating...");
        if (loginValid) {
            console.log("login valid. redirecting to home page");
            setShowErrorMessage(false);
            navigate("/");
        } else {
            setShowErrorMessage(true);
            console.log("login invalid. staying on this page and setting invalid text to visible");

            // here we need to add visible class to invalid-info-text
        }

    };


    return (
        <div className="container">
            <h1 className="app-title">SquashMate</h1>
            <h3 className="slogan">Elevate Your Game</h3>
            <div className="centered-container">
                <div className="items">
                    <h1>Welcome</h1>
                    <form onSubmit={validateUserLogin}>
                        <input
                            className="login-input"
                            type="text"
                            name="email"
                            placeholder="Email address"
                            value={email}
                            onChange={handleInputChange}
                            autoComplete="email"
                        />
                        <input
                            className="login-input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                        />
                        <p
                            className={`invalid-info-text ${showErrorMessage ? "visible" : ""}`}
                        >
                            The username or password you entered is incorrect.
                        </p>
                        <button className="login-button" type="submit">Login</button>
                    </form>

                    <span className="or">Or</span>
                    <button to="/create-profile" className="create-profile-button">Sign Up</button>
                    <button className="forgot-password">Forgot Password?</button>
                </div>

            </div>

        </div>
    );

}

export default Landing;