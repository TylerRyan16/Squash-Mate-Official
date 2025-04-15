import './profile.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, updateProfileRequest } from "../../services/api";

const Profile = () => {
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        level: '',
        club_locker_url: '',
        country: '',
        date_of_birth: '',
        profile_pic: '',
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

    useEffect(() => {
        console.log("selected color: ", selectedColor);
        console.log("original data: ", originalData);
    }, [originalData, selectedColor])

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
                    first_name: formattedFirst || '',
                    last_name: formattedLast || '',
                    level: data.player_level || '',
                    club_locker_url: data.club_locker_url || '',
                    country: data.country || '',
                    date_of_birth: data.date_of_birth || '',
                    profile_pic: data.profile_pic,
                });

                setOriginalData({
                    username: data.username || '',
                    email: data.email || '',
                    first_name: formattedFirst || '',
                    last_name: formattedLast || '',
                    level: data.player_level || '',
                    club_locker_url: data.club_locker_url || '',
                    country: data.country || '',
                    date_of_birth: data.date_of_birth || '',
                    profile_pic: data.profile_pic,
                })

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
        const changes = {};
        for (const key in userData) {
            if (userData[key] !== originalData[key]) {
                changes[key] = userData[key];
            }
        }

        if (selectedColor !== originalData.profile_pic) {
            changes.profile_pic = selectedColor;
        }

        if (Object.keys(changes).length === 0) {
            setEditProfileEnabled(false);
            return;
        }



        try {
            await updateProfileRequest(changes);

            // Update local state to reflect saved changes
            const updated = {
                ...userData,
                profile_pic: selectedColor,
            };


            setUserData(updated);
            setOriginalData(updated);
            setEditProfileEnabled(false);
        } catch (error) {
            console.log(error);
            alert("Failed to update profile.");
            setEditProfileEnabled(false);
        }
    }

    return (
        <div className="profile-page">
            <div className="left-area">
                <div className="tooltip-wrapper">
                    <img
                        onClick={() => {
                            // set data back to original if not pressed save changes
                            if (editProfileEnabled) {
                                setUserData(originalData);
                                setSelectedColor(originalData.profile_pic);
                            }
                            setEditProfileEnabled(!editProfileEnabled);
                        }}
                        src="/assets/icons/edit profile.png"
                        alt="edit-profile"
                        className={`edit-profile-button ${editProfileEnabled ? "enabled" : ""}`}
                    />
                    <span className="tooltip-text">Edit Profile</span>

                </div>

                <h1 className="my-profile">My Profile</h1>



                <div className="profile-picture-zone">
                    {editProfileEnabled && <img className='pic-switch-left' src='assets\icons\right-arrow.png' alt='change pic left' onClick={() => switchProfileColor("left")} />}
                    {!editProfileEnabled && <img src={`/assets/characters/${userData.profile_pic}.png`} alt='profile cover' className="profile-pic"></img>}

                    {editProfileEnabled && <img src={`/assets/characters/${selectedColor}.png`} alt='profile cover' className="profile-pic"></img>}

                    {editProfileEnabled && <img className='pic-switch-right' src='assets\icons\right-arrow.png' alt='change pic right' onClick={() => switchProfileColor("right")} />}
                </div>

                <h1 className="profile-username">{userData.username}</h1>


                <div className="club-locker-area" onClick={() => window.open(userData.club_locker_url, '_blank')}>
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
                            value={userData.first_name}
                            readOnly={!editProfileEnabled}
                            onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}


                        />
                    </div>


                    {/* last name */}
                    <div className="input-container">
                        <label className="floating-label">Last Name</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="last-name"
                            value={userData.last_name}
                            readOnly={!editProfileEnabled}
                            onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}


                        />
                    </div>


                    {/* date of birth */}
                    <div className="input-container">
                        <label className="floating-label">Date of Birth</label>
                        <input
                            className="input-zone"
                            type="text"
                            name="date-of-birth"
                            value={userData.date_of_birth || 'N/A'}
                            readOnly={!editProfileEnabled}
                            onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}


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
                            onChange={(e) => setUserData({ ...userData, country: e.target.value })}


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
                        readOnly={true}
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