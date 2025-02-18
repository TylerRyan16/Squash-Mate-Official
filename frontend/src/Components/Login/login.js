import "./login.scss";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { login } from "../../services/api";


const Landing = () => {
    const navigate = useNavigate();

    // store email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="container">
            <div className="landing-header-area">
                <h1 className="app-title">SquashMate</h1>
                <h3 className="slogan">Elevate Your Game</h3>
            </div>

            <div className="items">
                <h1>Welcome</h1>
                <form onSubmit={validateUserLogin}>
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
                    <Link to="/create-profile" className="create-profile-button">Sign Up</Link>

                </form>


            </div>

        </div>
    );

}

export default Landing;