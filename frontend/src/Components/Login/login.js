import "./login.scss";
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import { login } from "../../services/api";

// MUI
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';

const Landing = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // grab initial email and password if they hit back on create profile
    const initialEmail = location.state?.email || "";
    const initialPassword = location.state?.password || "";

    // store email and password
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
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

    const validateUserLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            if (userData) {
                navigate('/');
            }

        } catch (error) {
            setShowErrorMessage(true);
            console.error("login failed: ", error);
        }
    };

    return (
        <div className="login-container">
            <div className="landing-header-area">
                <h1 className="app-title">SquashMate</h1>
                <h3 className="slogan">Elevate Your Game</h3>
            </div>

            <div className="items">
                <form onSubmit={validateUserLogin}>
                    <h1>Welcome</h1>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        className="login-textfield"
                    />



                    {/* PASSWORD */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                        className="login-textfield"
                    />

                    <div className="login-bottom-row">
                        <button className="forgot-password">Forgot Password?</button>
                        <p
                            className={`invalid-info-text ${showErrorMessage ? "visible" : ""}`}
                        >
                            The username or password you entered is incorrect.
                        </p>
                    </div>

                    <div className="login-buttons-area">
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            className="login-button"
                            sx={{
                                width: "75%",
                                padding: "10px 0px",
                                fontSize: "18px",
                                fontWeight: 600,
                            }}

                        >Login</Button>

                        <p className="or">Or</p>
                        <Button
                            variant="contained"
                            fullWidth
                            type="button"
                            className="login-button"
                            onClick={() => navigate("/create-profile", { state: { email, password } })}
                            onMouseDown={(e) => e.preventDefault()}
                            sx={{
                                width: "75%",
                                padding: "10px 0px",
                                fontSize: "18px",
                                fontWeight: 600,
                            }}
                        >
                            Sign Up
                        </Button>
                    </div>

                </form>




            </div>

        </div>
    );

}

export default Landing;