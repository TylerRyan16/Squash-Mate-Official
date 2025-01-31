import "./landing.scss";
import { Link } from 'react-router-dom';


const Landing = () => {
    return (
        <div className="landing-page-container">
            <div className="centered-container">
                <div className="items">
                    <h1>LANDING PAGE</h1>
                    <label htmlFor="email">Email </label>
                    <input
                        className="login-input"
                        type="text"
                        name="email"
                        placeholder="Email..."
                    />
                    <label htmlFor="password">Email </label>
                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        placeholder="Password..."
                    />
                    <Link to="/login" className="login-button">Login</Link>
                    <span className="or">Or</span>
                    <Link to="/create-profile" className="create-profile-button">Create Profile</Link>
                </div>

            </div>

        </div>
    );

}

export default Landing;