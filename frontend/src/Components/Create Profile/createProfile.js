import { useNavigate, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createAccount } from "../../services/api";
import "./createProfile.scss";
import axios from "axios";

const CreateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // extract email and pass from the landing page if they typed it
    const initialEmail = location.state?.email || "";
    const initialPassword = location.state?.password || "";

    // State to store form values
    const [profileDetails, setProfileDetails] = useState({
        username: "",
        password: initialPassword,
        playerLevel: "",
        clubLockerURL: "",
        firstName: "",
        lastName: "",
        country: "",
        email: initialEmail,
        dateOfBirth: "",
    });

    // state for checking if the password user types is a valid password
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        numbers: false,
        specialCharacters: false
    });

    const specialCharacterRegex = /[!@#$%&+]/;
    const numberRegex = /[0-9]/;

    // Handle input changes in form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // update profile details from form values
        setProfileDetails({
            ...profileDetails,
            [name]: value,
        });

        // if we are typing in the password field -> check if valid
        if (name === "password") {
            setPasswordValid({
                length: value.length >= 8,
                numbers: numberRegex.test(value),
                specialCharacters: specialCharacterRegex.test(value)
            })
        }
    };

    // invalid fields on input
    const [invalidFields, setInvalidFields] = useState([]);

    // create the profile
    const handleCreateProfile = async () => {
        const missingFields = highlightInvalidFields();

        // check all required fields are input
        if (missingFields.length > 0){
            return;
        }

        // try to create account thru api
        try {
            const userData = await createAccount(profileDetails);
            console.log("profile created: ", userData);
            navigate("/");
        } catch (error) {
            //alert(error || "failed to create profile!");
            console.error("Error creating your profile!");
        }
    };

    // highlight invalid fields of input
    const highlightInvalidFields = () => {
        const missingFields = [];

        // check required fields
        if (!profileDetails.firstName) missingFields.push("firstName");
        if (!profileDetails.lastName) missingFields.push("lastName");
        if (!profileDetails.username) missingFields.push("username");
        if (!profileDetails.email) missingFields.push("email");
        if (!profileDetails.password) missingFields.push("password");
        if (!profileDetails.dateOfBirth) missingFields.push("dateOfBirth");
    
        // flash effect: add class and remove it after .2 seconds
        console.log("missing fields in flash loop: ", missingFields);
        missingFields.forEach((field) => {
            const element = document.querySelector(`[name="${field}"]`);
            if (element){
                element.classList.remove("flash");
                void element.offsetWidth; 
                element.classList.add("flash");
            }
        });


        setInvalidFields(missingFields);

        return missingFields;
    };

    // Validate initialize password if coming from landing page
    useEffect(() => {
        if (initialPassword) {
            setPasswordValid({
                length: initialPassword.length >= 8,
                numbers: numberRegex.test(initialPassword),
                specialCharacters: specialCharacterRegex.test(initialPassword)
            });
        }
    }, [initialPassword])


    return (
        <div className="create-display-area">
            <div className="create-account-left-area">
                <img 
                    src="/assets/back-arrow.png" 
                    alt="back arrow" 
                    className="back-arrow"
                    onClick={() => navigate("/login", {state: {email: profileDetails.email, password: profileDetails.password}})}
                    ></img>

            </div>
            <div className="create-account-form-area">
                <h1 className="header">Create Profile</h1>
                <form>
                    <div className="first-last-name-area">

                        {/* FIRST NAME */}
                        <div className="input-container">
                            <label className="floating-label profile-label">First (required)</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`input-zone zone-profile first-name ${invalidFields.includes("firstName") ? "invalid" : ""}`}
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
                                className={`input-zone zone-profile last-name ${invalidFields.includes("lastName") ? "invalid" : ""} `}
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
                            className={`input-zone zone-profile ${invalidFields.includes("username") ? "invalid" : ""} `}
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
                            className={`input-zone zone-profile ${invalidFields.includes("email") ? "invalid" : ""} `}
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
                            className={`input-zone zone-profile ${invalidFields.includes("password") ? "invalid" : ""} `}
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
                            className={`input-zone zone-profile ${invalidFields.includes("dateOfBirth") ? "invalid" : ""} `}
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


            <div className="create-account-right-area">
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