import { Link } from "react-router-dom";

const TopNavbar = () => {
    return (
        <>
            {/* TOP NAV BAR (PROFILE & NOTIFS) */}
            <div className={`${isSidebarOpen ? 'ml-24 content-area-navbar' : 'w-full'} flex flex-col z-1000`}>


                <div className="flex w-full h-32 bg-green-500 justify-between items-center px-4 py-4">
                    {/* menu button - for smaller screens */}
                    {displayTopNav && <img src="/assets/icons/hamburger icon.png" alt="close sidebar button" className="w-8 h-8 cursor-pointer z-100"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                    </img>}

                    {/* TOP RIGHT ICONS */}
                    {displayTopNav &&
                        <div className="flex gap-2 items-center justify-center">

                            {/* Notification Bell & Dropdown*/}
                            <div className="relative w-8 h-auto flex gap-2 items-center" ref={dropdownRef}>
                                <img
                                    src="/assets/icons/notification-bell.png" alt="bell" className="cursor-pointer"
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
                                <img src="/assets/icons/profile-icon.png" alt="profile" className="w-5 h-auto cursor-pointer" />
                            </Link>

                        </div>
                    }
                </div>


            </div >
        </>
    );

}

// export the name of the class to be able to use it in other components.
export default Sidebar;