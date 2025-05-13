import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Navigate } from 'react-router-dom';
import Sidebar from "../Sidebar/sidebar";
import { checkLoggedIn } from "../../services/api";
import "./layout.scss";

const Layout = ({ children }) => {
    const location = useLocation();
    const [displayTopNav, setDisplayTopNav] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(null);
    const dropdownRef = useRef(null);


    // hardcoded notifications
    const notifications = [
        "New comment on your video",
        "Your profile was updated",
        "Your video has finished uploading",
    ];


    // hide topbar
    useEffect(() => {
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

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const loggedInStatus = await checkLoggedIn();
                setLoggedIn(loggedInStatus);
            } catch (error) {
                console.error(error);
                setLoggedIn(false);
            }
        };

        checkAuth();
    }, [])

    const isAuthPage = location.pathname.includes("/login") || location.pathname.includes("/create-profile");

    if (loggedIn === null) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (loggedIn === false && !isAuthPage) {
        return <Navigate to="/login" replace />;
    }


    return (
        <div className="flex flex-col h-screen w-full overflow-y-auto">
            < Sidebar />

            {/* CONTENT & NAV */}
            <div className="flex flex-col">
                {/* TOP NAVBAR */}
                <div className="absolute top-0 left-0 flex w-full h-16 justify-end items-center px-4 py-4 bg-navbar shadow-md z-50 ">
                    {/* TOP RIGHT ICONS */}
                    {displayTopNav &&
                        <div className="flex gap-2 items-center justify-center">

                            {/* Notification Bell & Dropdown*/}
                            <div className="relative h-auto flex gap-2 items-center w-12" ref={dropdownRef}>
                                <img
                                    src="/assets/icons/notification-bell.png" alt="bell" className="h-auto cursor-pointer p-2 rounded-md hover:bg-gray-200"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                />

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-8 right-2 mt-2 w-64 bg-white shadow-lg rounded-lg border z-50">
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
                                <img src="/assets/icons/profile-icon.png" alt="profile" className="w-10 h-auto cursor-pointer p-2 rounded-md hover:bg-gray-200" />
                            </Link>

                        </div>
                    }
                </div>


            </div >

            <main className="main-content mt-16">
                {children}
            </main>
        </div >

    );
};

export default Layout;