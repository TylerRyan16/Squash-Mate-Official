import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { createAccount } from "../../services/api";
import "./createProfile.scss";

const CreateProfile = () => {
    const navigate = useNavigate();

    // State to store form values
    const [profileDetails, setProfileDetails] = useState({
        username: "",
        password: "",
        playerLevel: "",
        clubLockerURL: "",
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        dateOfBirth: "",
    });

    const [passwordValid, setPasswordValid] = useState({
        length: false,
        numbers: false,
        specialCharacters: false
    });

    const specialCharacterRegex = /[!@#$%&+]/;
    const numberRegex = /[0-9]/;


    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // UPDATE FORM VALUES
        setProfileDetails({
            ...profileDetails,
            [name]: value,
        });


        if (name === "password") {
            setPasswordValid({
                length: value.length >= 8,
                numbers: numberRegex.test(value),
                specialCharacters: specialCharacterRegex.test(value)
            })
        }
    };

    // Handle form submission
    const handleCreateProfile = async () => {
        try {
            if (!passwordValid || profileDetails.firstName == ""
                || profileDetails.lastName == ""
                || profileDetails.username == ""
                || profileDetails.email == ""
                || profileDetails.password == ""
                || profileDetails.dateOfBirth == ""
                || profileDetails.playerLevel == ""
            ) {
                alert("error!");
                return;
            }

            const userData = await createAccount(profileDetails);
            console.log("profile created: ", userData);
            navigate("/");
        } catch (error) {
            alert(error || "failed to create profile!");
            console.error("Error creating your profile!");
        }
    };


    return (
        <div className="page-container">
            <div className="create-display-area">
                <div className="create-background">
                    <h1 className="header">Create Profile</h1>
                    <form>
                        <div className="first-last-name-area">

                            {/* FIRST NAME */}
                            <div className="input-container">
                                <label className="floating-label profile-label">First (required)</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className={`input-zone zone-profile first-name`}
                                    value={profileDetails.firstName}
                                    onChange={handleInputChange}
                                />

                            </div>

                            {/* LAST NAME */}
                            <div className="input-container">
                                <label className="floating-label profile-label">Last (required)</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className={`input-zone zone-profile last-name`}
                                    value={profileDetails.lastName}
                                    onChange={handleInputChange}
                                />

                            </div>
                        </div>


                        {/* USERNAME */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Username (required)</label>
                            <input
                                type="text"
                                name="username"
                                autoComplete="username"
                                className={`input-zone zone-profile`}
                                value={profileDetails.username}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Email (required)</label>
                            <input
                                type="text"
                                name="email"
                                className={`input-zone zone-profile`}
                                value={profileDetails.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Password (required)</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                className={`input-zone zone-profile`}
                                value={profileDetails.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* DATE OF BIRTH */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Date of Birth (required)</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className={`input-zone zone-profile `}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* PLAYER LEVEL */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Player Level (required)</label>
                            <select className="level-selection" name="playerLevel" value={profileDetails.playerLevel} onChange={handleInputChange}>
                                <option value="">Select Level</option>
                                <option name="playerLevel" value="Beginner">Beginner</option>
                                <option name="playerLevel" value="Intermediate">Intermediate</option>
                                <option name="playerLevel" value="Pro">Pro</option>
                            </select>
                        </div>

                        {/* CLUB LOCKER URL */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Club Locker URL (optional)</label>
                            <input
                                type="text"
                                name="clubLockerURL"
                                className={`input-zone zone-profile`}
                                value={profileDetails.clubLockerURL}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* COUNTRY */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Country (optional)</label>
                            <input
                                type="text"
                                name="country"
                                className={`input-zone zone-profile`}
                                value={profileDetails.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>

                    <Link to="/"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCreateProfile();
                        }}
                        className="create-profile"
                    >
                        Create Profile
                    </Link>
                </div>


                <div className="password-check-area">
                    <h2>Your password must contain:</h2>
                    <ul className="necessary-password-metrics">
                        <li className={`password-check-item ${passwordValid.length ? "completed" : ""}`}>8 characters</li>
                        <li className={`password-check-item ${passwordValid.numbers ? "completed" : ""}`}>1 number</li>
                        <li className={`password-check-item ${passwordValid.specialCharacters ? "completed" : ""}`}>1 special character (!, @, #, $, %, &, *, +)</li>
                    </ul>
                    <h2 className={`password-confirm ${passwordValid ? "valid" : ""}`}>Password Valid</h2>
                </div>

            </div>




        </div>

    );
}

export default CreateProfile;