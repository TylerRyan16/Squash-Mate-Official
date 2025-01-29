import "./landing.scss";
import { Link } from 'react-router-dom';


const Landing = () => {
    return (
        <div className="landing-container">
            <h1>LANDING PAGE</h1>
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/create-profile" className="create-profile-button">Create Profile</Link>
        </div>
    );

}

export default Landing;