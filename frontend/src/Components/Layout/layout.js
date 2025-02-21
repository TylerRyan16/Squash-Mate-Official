import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Sidebar from "../Sidebar/sidebar";
import "./layout.scss";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="layout-container">
            {<Sidebar isOpen={isSidebarOpen} />}

            {/* TOP NAV BAR (PROFILE & NOTIFS) */}
            <div className={`content-area-with-top-navbar ${isSidebarOpen ? "sidebar-open" : 'sidebar-closed'}`}>
                <div className="top-nav-bar">
                    {/* menu button - for smaller screens */}
                    <img src="/assets/icons/hamburger icon.png" alt="close sidebar button" className="menu-button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                    </img>
                    <div className="icon-area">
                        <img src="/assets/icons/notification-bell.png" alt="bell" className="bell-icon"></img>
                        <Link to="/profile"><img src="/assets/icons/profile-icon.png" alt="profile" className="profile-icon"></img></Link>
                    </div>
                </div>

                <main className="main-content">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default Layout;