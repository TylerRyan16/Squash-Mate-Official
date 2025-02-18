import './profile.scss';
import { useEffect, useState } from 'react';
import { getUserData } from "../../services/api";



const Profile = () => {
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

    const [editProfileEnabled, setEditProfileEnabled] = useState(false);

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
                })
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserData();
    }, []);

    return (
        <div className="page-container">
            <div className="horizontal-flex">
                <div className="left-area">
                    <h1 className="my-profile">My Profile</h1>
                    <img src='/assets/squash-guy.jpg' alt='profile cover' className="profile-pic"></img>
                    <h1 className="profile-username">{userData.username}</h1>

                    <div className="club-locker-area">
                        <a href='https://clublocker.com/organizations/10000/home' target="_blank" rel="noreferrer"><h1 className="club-locker-link">Club Locker Profile</h1></a>
                        {/* experience level */}
                        <h2 className="experience">Professional Player</h2>
                        <h3>Rating: </h3>
                        <h3>League: </h3>
                        <h3>W/L Ratio: </h3>
                    </div>
                </div>


                <div className="right-area">


                    <div className="name-area">
                        {/* first name */}
                        <div className="input-container">
                            <label className="floating-label">First Name</label>
                            <input
                                className="input-zone first-name"
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
                                className="input-zone last-name"
                                type="text"
                                name="last-name"
                                value={userData.lastName}
                                readOnly={!editProfileEnabled}

                            />
                        </div>
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
                    <button className="change-password-button">Change Password</button>

                    {/* CHECKBOXES */}
                    <input type="checkbox" id="show-age"></input>
                    <label htmlFor="show-age" className="show-age-label">Publicly display my age on my profile</label>
                </div>
            </div>
        </div >
    );
}

export default Profile;