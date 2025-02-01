import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./sidebar.scss";

// Sidebar component is responsible for displaying the nav menu
const Sidebar = () => {
    // the 'useLocation' hook from react-router-dom provides the current URL path
    // for example: if you're on "/explore", "location.pathname" will return "/explore"
    const location = useLocation();

    // 'selectedRoute' tracks the current active route
    // we use 'useState' to store this value and update it dynamically 
    const [selectedRoute, setSelectedRoute] = useState(location.pathname);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // the 'useEffect' hook runs whenever the dependencies in its array change
    // here, it updates 'selectedRoute' whenever location changes
    useEffect(() => {
        setSelectedRoute(location.pathname);
    }, [location]); // this only runs when location changes because its in our dependency array

    return (
        <>
            {/* menu button - for smaller screens */}
            <button
                className="menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                ☰
            </button>

            {/* sidebar hidden on small screens */}
            <nav
                className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
            >
                <ul className="list">
                    {/* upload button */}
                    <Link
                        to="/upload"
                        className={`nav-button ${selectedRoute === '/upload' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/white-upload.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">Upload</span>
                    </Link>

                    {/* home button */}
                    <Link
                        to="/"
                        className={`nav-button ${selectedRoute === '/' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/white-home.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">Home</span>
                    </Link>

                    {/* my videos button */}
                    <Link
                        to="/my-videos"
                        className={`nav-button ${selectedRoute === '/my-videos' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/upload.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">My Videos</span>
                    </Link>

                    {/* shared with me button */}
                    <Link
                        to="/shared-with-me"
                        className={`nav-button ${selectedRoute === '/shared-with-me' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/upload.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">Shared With Me</span>
                    </Link>


                    {/* explore button */}
                    <Link
                        to="/explore"
                        className={`nav-button ${selectedRoute === '/explore' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/upload.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">Explore</span>

                    </Link>

                    {/* camps button */}
                    <Link
                        to="/camps"
                        className={`nav-button ${selectedRoute === '/camps' ? 'selected' : ''}`}
                    >
                        <img src="/assets/icons/upload.png" alt="upload" className="nav-icon"></img>
                        <span className="nav-text">Camps</span>
                    </Link>

                </ul>
            </nav>
        </>
    );
}

// export the name of the class to be able to use it in other components.
export default Sidebar;