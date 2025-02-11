import './profile.scss';



const Profile = () => {
    return (
        <div className="page-container">
            <div className="horizontal-flex">
                <div className="left-area">
                    <h1 className="my-profile">My Profile</h1>
                    <img src='/assets/icons/profile-icon.png' alt='profile cover'></img>
                    <h1 className="username">Username</h1>

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

                    <div className="left-column">

                        <div className="horizontal-flexbox">
                            {/* first name */}
                            <div className="vertical-flexbox">
                                <label for="first-name">First Name</label>
                                <input
                                    className="profile-input-field first-name"
                                    type="text"
                                    name="first-name"
                                    readOnly="true"
                                    value="First Name"
                                >
                                </input>
                            </div>


                            {/* last name */}
                            <div className="vertical-flexbox">
                                <label for="last-name">Last Name</label>
                                <input
                                    className="profile-input-field last-name"
                                    type="text"
                                    name="last-name"
                                    readOnly="true"
                                    value="Last Name"
                                >
                                </input>
                            </div>

                        </div>


                        {/* date of birth */}
                        <label for="birth-date">Date of Birth</label>
                        <input
                            className="profile-input-field date-of-birth"
                            type="text"
                            name="birth-date"
                            readOnly="true"
                            value="01/01/2001"
                        ></input>

                        {/* country */}
                        <label for="country">Country</label>
                        <input
                            className="profile-input-field country"
                            type="text"
                            name="country"
                            readOnly="true"
                            value="United States"
                        >
                        </input>

                        <h1>Security</h1>


                        <div className="horizontal-flexbox">
                            {/* email */}
                            <div className="vertical-flexbox">
                                <label for="email">Email</label>
                                <input
                                    className="profile-input-field email"
                                    type="text"
                                    name="email"
                                    readOnly="true"
                                    value="squashmate@squashmate.gov"
                                >
                                </input>
                            </div>

                            <input type="checkbox" id="show-age"></input>
                            <label for="show-age" id="show-age-label">Publicly display my age on my profile</label>

                        </div>


                        {/* password */}
                        <label for="password">Password</label>
                        <input
                            className="profile-input-field password"
                            type="text"
                            name="password"
                            readOnly="true"
                            value="************"
                        >
                        </input>
                        <button className="change-password-button">Change Password</button>


                    </div>







                </div>
            </div>



        </div >
    );
}

export default Profile;