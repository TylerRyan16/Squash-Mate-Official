import "./login.scss";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import { login } from "../../services/api";


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

                    {/* EMAIL */}
                    <div className="input-container">
                        <label className="floating-label">Email</label>
                        <input
                            className="input-zone email"
                            type="text"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            autoComplete="email"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-container">
                        <label className="floating-label">Password</label>
                        <input
                            className="input-zone password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button className="forgot-password">Forgot Password?</button>
                    <p
                        className={`invalid-info-text ${showErrorMessage ? "visible" : ""}`}
                    >
                        The username or password you entered is incorrect.
                    </p>
                    <button className="login-button" type="submit">Login</button>

                    <p className="or">Or</p>
                    <button 
                        type="button" 
                        className="create-profile-button"
                        onClick={() => navigate("/create-profile", {state: {email, password}})}
                        onMouseDown={(e) => e.preventDefault()}
                    >Sign Up</button>

                </form>




            </div>

        </div>
    );

}

export default Landing;