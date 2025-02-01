import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/sidebar";
import ProfileIcon from "../ProfileIcon/profileIcon";
import "./layout.scss";

const Layout = ({children}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);




    return (
        <div className="layout-container">
            {!isMobile && <Sidebar/>}
            <ProfileIcon />
            <main className="main-content">{children}</main>
        </div>
    );
};

export default Layout;