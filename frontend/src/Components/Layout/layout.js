import React from 'react';
import Sidebar from "../Sidebar/sidebar";
import "./layout.scss";

const Layout = ({children}) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;