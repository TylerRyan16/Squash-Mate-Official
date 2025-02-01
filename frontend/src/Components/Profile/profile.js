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
                        <h3>Rating: </h3>
                        <h3>League: </h3>
                        <h3>W/L Ratio: </h3>
                    </div>
                </div>


                <div className="right-area">

                    <div className="horizontal-flexbox name-area">
                        {/* First name */}
                        <input
                            className="profile-input-field first-name"
                            type="text"
                            name="first-name"
                            readOnly="true"
                            value="First Name"
                        >
                        </input>

                        {/* last name */}
                        <input
                            className="profile-input-field last-name"
                            type="text"
                            name="last-name"
                            readOnly="true"
                            value="Last Name"
                        >
                        </input>

                        {/* experience level */}
                        <h2 className="experience">Professional Player</h2>
                    </div>

                    {/* date of birth */}
                    <input
                        className="profile-input-field date-of-birth"
                        type="text"
                        name="birth-date"
                        readOnly="true"
                        value="01/01/2001"
                    >
                    </input>




                </div>
            </div>



        </div >
    );
}

export default Profile;