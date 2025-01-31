import "./profileIcon.scss"

import {Link} from 'react-router-dom';

const ProfileIcon = () => {
    return (
        <div className="icon-area">
            <Link to="/profile"><img src="/assets/icons/profile-icon.png" alt="profile" className="profile-icon"></img></Link>
        </div>
    );
};

export default ProfileIcon;