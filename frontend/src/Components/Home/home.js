import './home.scss';
import {useNavigate } from 'react-router-dom';
import {useEffect} from 'react';


// MAIN EXPORT
const Home = () => {
    const navigate = useNavigate();

    const isLoggedIn = () => {
        const loggedIn = localStorage.getItem('authToken');
        console.log("logged in: ", loggedIn);
        return !!loggedIn;
    };

    useEffect(() => {
        if (!isLoggedIn()){
            console.log("user not logged in, redirecting to /landing");
            navigate("/landing");
        }
    }, [navigate])

    return (
        <div className="container">
            <h1>Home Page.</h1>
            <p>This is the home page.</p>
        </div>
    );
}

export default Home;