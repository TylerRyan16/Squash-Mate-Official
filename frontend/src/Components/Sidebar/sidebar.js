import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./sidebar.scss";

// Sidebar component is responsible for displaying the nav menu
const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    const hiddenRoutes = ["/login", "/create-profile"];

    const [selectedRoute, setSelectedRoute] = useState(location.pathname);

    useEffect(() => {
        setSelectedRoute(location.pathname);
    }, [location]);

    if (hiddenRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <div className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
            {/* upload button */}
            <Link
                to="/upload"
                className={`nav-button ${selectedRoute === '/upload' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/white-upload.png" alt="upload" className="nav-icon"></img>
                <span className="tooltip">Upload</span>
            </Link>

            {/* home button */}
            <Link
                to="/"
                className={`nav-button ${selectedRoute === '/' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/white-home.png" alt="upload" className="nav-icon"></img>
                <span className="tooltip">Home</span>
            </Link>

            {/* my videos button */}
            <Link
                to="/my-videos"
                className={`nav-button ${selectedRoute === '/my-videos' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/my-videos.png" alt="upload" className="nav-icon my-videos"></img>
                <span className="tooltip">My Videos</span>
            </Link>

            {/* shared with me button */}
            <Link
                to="/shared-with-me"
                className={`nav-button ${selectedRoute === '/shared-with-me' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/shared-with-me.png" alt="upload" className="nav-icon shared-with-me"></img>
                <span className="tooltip">Shared With Me</span>
            </Link>


            {/* explore button */}
            <Link
                to="/explore"
                className={`nav-button ${selectedRoute === '/explore' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/explore.png" alt="upload" className="nav-icon explore"></img>
                <span className="tooltip">Explore</span>
            </Link>

            {/* camps button */}
            <Link
                to="/camps"
                className={`nav-button ${selectedRoute === '/camps' ? 'selected' : ''}`}
            >
                <img src="/assets/icons/camps.png" alt="upload" className="nav-icon camps"></img>
                <span className="tooltip">Camps</span>
            </Link>

        </div>

    );
}

// export the name of the class to be able to use it in other components.
export default Sidebar;