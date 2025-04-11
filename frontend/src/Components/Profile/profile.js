import './profile.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout } from "../../services/api";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        level: '',
        clubLockerUrl: '',
        country: '',
        dateOfBirth: '',
    });
    const [selectedColor, setSelectedColor] = useState("");
    const colors = ["purple", "red", "yellow", "pink", "blue", "green"]
    const [editProfileEnabled, setEditProfileEnabled] = useState(false);

    const switchProfileColor = (direction) => {
        const currentColorIndex = colors.indexOf(selectedColor);

        if (direction === "left") {
            let nextColorIndex = currentColorIndex - 1;
            if (nextColorIndex < 0) {
                nextColorIndex = 5;
            }

            setSelectedColor(colors[nextColorIndex]);
        }

        if (direction === "right") {
            let nextColorIndex = currentColorIndex + 1;
            if (nextColorIndex > 5) {
                nextColorIndex = 0;
            }

            setSelectedColor(colors[nextColorIndex]);
        }
    }

    // ON PAGE LOAD
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();

                const formattedFirst = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1);
                const formattedLast = data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1);

                setUserData({
                    username: data.username || '',
                    email: data.email || '',
                    firstName: formattedFirst || '',
                    lastName: formattedLast || '',
                    level: data.player_level || '',
                    clubLockerUrl: data.club_locker_url || '',
                    country: data.country || '',
                    dateOfBirth: data.date_of_birth || '',
                    profilePic: data.profile_pic,
                });

                console.log("setting selectedColor to: ", data.profile_pic);
                setSelectedColor(data.profile_pic);
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserData();
    }, []);

    const logoutUser = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    const updateProfile = async () => {
        setEditProfileEnabled(false);
    }

    return (
        <div className="profile-page">
            <div className="left-area">
                <div className="tooltip-wrapper">
                    <img
                        onClick={() => setEditProfileEnabled(!editProfileEnabled)}
                        src="/assets/icons/edit profile.png"
                        alt="edit-profile"
                        className={`edit-profile-button ${editProfileEnabled ? "enabled" : ""}`}
                    />
                    <span className="tooltip-text">Edit Profile</span>

                </div>

                <h1 className="my-profile">My Profile</h1>



                <div className="profile-picture-zone">
                    {editProfileEnabled && <img className='pic-switch-left' src='assets\icons\right-arrow.png' alt='change pic left' onClick={() => switchProfileColor("left")} />}
                    {!editProfileEnabled && <img src={`/assets/characters/${userData.profilePic}.png`} alt='profile cover' className="profile-pic"></img>}
                    {editProfileEnabled && <img src={`/assets/characters/${selectedColor}.png`} alt='profile cover' className="profile-pic"></img>}

                    {editProfileEnabled && <img className='pic-switch-right' src='assets\icons\right-arrow.png' alt='change pic right' onClick={() => switchProfileColor("right")} />}
                </div>

                <h1 className="profile-username">{userData.username}</h1>


                <div className="club-locker-area" onClick={() => window.open(userData.clubLockerUrl, '_blank')}>
                    <h3>Club Locker</h3>
                    <img src="/assets/icons/link.png" alt="club locker link"></img>

                    <p>{userData.level}</p>
                </div>
            </div>


            <div className="right-area">


                <div className="profile-fields-div">



                    {/* first name */}
                    <div className="input-container">
                        <label className="floating-label">First Name</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="first-name"
                            value={userData.firstName}
                            readOnly={!editProfileEnabled}

                        />
                    </div>


                    {/* last name */}
                    <div className="input-container">
                        <label className="floating-label">Last Name</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="last-name"
                            value={userData.lastName}
                            readOnly={!editProfileEnabled}

                        />
                    </div>


                    {/* date of birth */}
                    <div className="input-container">
                        <label className="floating-label">Date of Birth</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="date-of-birth"
                            value={userData.dateOfBirth || 'N/A'}
                            readOnly={!editProfileEnabled}

                        />
                    </div>


                    {/* country */}
                    <div className="input-container">
                        <label className="floating-label">Country</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="country"
                            value={userData.country || 'N/A'}
                            readOnly={!editProfileEnabled}

                        />
                    </div>
                </div>

                <h1 id="security-title">Security</h1>
                {/* email */}
                <div className="input-container">
                    <label className="floating-label">Email</label>
                    <input
                        className="input-zone"
                        type="text"
                        name="email"
                        value={userData.email}
                        readOnly={!editProfileEnabled}
                    />
                </div>



                {/* password */}
                <div className="input-container">
                    <label className="floating-label">Password</label>
                    <input
                        className="input-zone"
                        type="text"
                        name="password"
                        value="************"
                        readOnly={!editProfileEnabled}
                    />
                </div>

                <div className="security-button-area">
                    <button
                        className="change-password-button"
                    >Change Password</button>
                    <button
                        className="logout-button"
                        onClick={logoutUser}>Logout</button>
                </div>


                {/* CHECKBOXES */}
                <input type="checkbox" id="show-age"></input>
                <label htmlFor="show-age" className="show-age-label">Publicly display my age on my profile</label>

                {editProfileEnabled && <button className="save-changes-button" onClick={() => updateProfile()}>Save Changes</button>}

            </div>
        </div>
    );
}

export default Profile;