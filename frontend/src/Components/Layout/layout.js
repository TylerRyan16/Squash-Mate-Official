import React from 'react';
import Sidebar from "../Sidebar/sidebar";
import ProfileIcon from "../ProfileIcon/profileIcon";
import "./layout.scss";

const Layout = ({children}) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <ProfileIcon />
            <main>{children}</main>
        </div>
    );
};

export default Layout;