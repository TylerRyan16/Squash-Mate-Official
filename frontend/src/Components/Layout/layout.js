import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar/sidebar";
import "./layout.scss";

const Layout = ({ children }) => {
    const location = useLocation();
    const [displayTopNav, setDisplayTopNav] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("/login") || location.pathname.includes("/create-profile")){
            setDisplayTopNav(false);
        };
    }, [location])

    return (
        <div className="layout-container">
            {<Sidebar isOpen={isSidebarOpen} />}

            {/* TOP NAV BAR (PROFILE & NOTIFS) */}
            <div className={`content-area-with-top-navbar ${isSidebarOpen ? "sidebar-open" : 'sidebar-closed'}`}>
                <div className="top-nav-bar">
                    {/* menu button - for smaller screens */}
                    {displayTopNav && <img src="/assets/icons/hamburger icon.png" alt="close sidebar button" className="menu-button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    ></img>}
                    {displayTopNav && <div className="icon-area">
                        <Link to="/profile"><img src="/assets/icons/profile-icon.png" alt="profile" className="profile-icon"></img></Link>
                    </div>}
                </div>

                <main className="main-content">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default Layout;