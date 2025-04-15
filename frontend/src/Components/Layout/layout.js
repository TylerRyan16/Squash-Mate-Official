import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar/sidebar";
import "./layout.scss";

const Layout = ({ children }) => {
    const location = useLocation();
    const [displayTopNav, setDisplayTopNav] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        return savedState === null ? true : JSON.parse(savedState);
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // hardcoded notifications
    const notifications = [
        "New comment on your video",
        "Your profile was updated",
        "Your video has finished uploading",
    ];

    useEffect(() => {
        // Save to localStorage whenever it changes
        localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    useEffect(() => {
        // hide topbar if on login or create profile page
        if (location.pathname.includes("/login") || location.pathname.includes("/create-profile")) {
            setDisplayTopNav(false);
        } else {
            setDisplayTopNav(true);
        }

        // open dropdown menu on click notification bell
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [location])

    return (
        <div className="layout-container">
            {<Sidebar isOpen={isSidebarOpen} />}

            {/* TOP NAV BAR (PROFILE & NOTIFS) */}
            <div className={`content-area-with-top-navbar ${isSidebarOpen ? "sidebar-open" : 'sidebar-closed'}`}>
                <div className="top-nav-bar">
                    {/* menu button - for smaller screens */}
                    { displayTopNav && <img src="/assets/icons/hamburger icon.png" alt="close sidebar button" className="menu-button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                    </img>}

                    {/* TOP RIGHT ICONS */}
                    {displayTopNav && <div className="icon-area">
                        {/* Notification Bell */}
                        <div className="relative" ref={dropdownRef}>
                            <img
                                src="/assets/icons/notification-bell.png" alt="bell" className="bell-icon"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border z-50">
                                    <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 border-b">Notifications</h3>
                                    <ul className="py-2">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <li key={index} className="px-3 py-2 hover:bg-gray-100 text-sm">
                                                    {notification}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-3 py-2 text-gray-500 text-sm">No new notifications</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Profile Icon */}
                        <Link to="/profile">
                            <img src="/assets/icons/profile-icon.png" alt="profile" className="profile-icon" />
                        </Link>
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