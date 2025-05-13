import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./sidebar.scss";

// Sidebar component is responsible for displaying the nav menu
const Sidebar = () => {
    const location = useLocation();
    const hiddenRoutes = ["/login", "/create-profile"];
    const [selectedRoute, setSelectedRoute] = useState(location.pathname);
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const savedState = localStorage.getItem("sbstat");
        return savedState === null ? true : JSON.parse(savedState);
    });

    // set selected route
    useEffect(() => {
        setSelectedRoute(location.pathname);
    }, [location]);

    // save sidebar status in local storage
    useEffect(() => {
        localStorage.setItem("sbstat", JSON.stringify(sidebarOpen))
    }, [sidebarOpen]);

    // hide sidebar on certain routes
    if (hiddenRoutes.includes(location.pathname)) {
        return null;
    }




    return (
        <>
            {/* HAMBURGER ICON */}
            < img
                src="/assets/icons/hamburger icon.png"
                alt="menu"
                className="fixed top-4 left-8 w-8 h-8 cursor-pointer z-[1000]"
                onClick={() => setSidebarOpen(prev => !prev)}
            >
            </img >

            {/* sliding sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed w-24 left-0 top-0 transition-transform duration-300 h-screen bg-sidebar flex flex-col justify-center items-center gap-6 md:gap-12 z-50 shadow-2xl`}>
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
        </>
    );
}

// export the name of the class to be able to use it in other components.
export default Sidebar;