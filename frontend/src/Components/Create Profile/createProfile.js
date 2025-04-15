import { useNavigate, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createAccount } from "../../services/api";
import "./createProfile.scss";

// MUI
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const CreateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // extract email and pass from the landing page if they typed it
    const initialEmail = location.state?.email || "";
    const initialPassword = location.state?.password || "";

    // PROFILE PIC
    const [selectedColor, setSelectedColor] = useState("purple");
    const colors = ["purple", "red", "yellow", "pink", "blue", "green"]

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
        profile_color: selectedColor,
    });


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
        if (missingFields.length > 0) {
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
        if (!profileDetails.playerLevel) missingFields.push("playerLevel");

        // flash effect: add class and remove it after .2 seconds
        console.log("missing fields in flash loop: ", missingFields);
        missingFields.forEach((field) => {
            const element = document.querySelector(`[name="${field}"]`);
            if (element) {
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

                <h1>Select Profile Color</h1>
                <div className="pic-select-area">
                    <img className='pic-switch-left' src='assets\icons\right-arrow.png' alt='change pic left' onClick={() => switchProfileColor("left")} />
                    <img src={`/assets/characters/${selectedColor}.png`} alt='profile cover' className="profile-pic"></img>
                    <img className='pic-switch-right' src='assets\icons\right-arrow.png' alt='change pic right' onClick={() => switchProfileColor("right")} />
                </div>
                <h1>{selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</h1>
                <img
                    src="/assets/back-arrow.png"
                    alt="back arrow"
                    className="back-arrow"
                    onClick={() => navigate("/login", { state: { email: profileDetails.email, password: profileDetails.password } })}
                ></img>

            </div>
            <div className="create-account-form-area">
                <h1 className="header">Create Profile</h1>
                <form>
                    <div className="first-last-name-area">

                        {/* FIRST NAME */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="First (required)"
                            name="firstName"
                            value={profileDetails.firstName}
                            onChange={handleInputChange}
                            className={`create-profile-input ${invalidFields.includes("firstName") ? "invalid" : ""}`}
                        />

                        {/* LAST NAME */}
                        <TextField
                            fullWidth
                            label="Last (required)"
                            variant="outlined"
                            name="lastName"
                            value={profileDetails.lastName}
                            onChange={handleInputChange}
                            className={`create-profile-input ${invalidFields.includes("lastName") ? "invalid" : ""}`}
                        />
                    </div>


                    {/* USERNAME */}
                    <TextField
                        fullWidth
                        label="Username (required)"
                        name="username"
                        autoComplete="username"
                        variant="outlined"
                        value={profileDetails.username}
                        onChange={handleInputChange}
                        className={`create-profile-input ${invalidFields.includes("username") ? "invalid" : ""}`}
                    />

                    {/* EMAIL */}
                    <TextField
                        fullWidth
                        label="Email (required)"
                        name="email"
                        variant="outlined"
                        value={profileDetails.email}
                        onChange={handleInputChange}
                        className={`create-profile-input ${invalidFields.includes("email") ? "invalid" : ""}`}
                    />

                    {/* PASSWORD */}
                    <TextField
                        fullWidth
                        label="Password (required)"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        value={profileDetails.password}
                        onChange={handleInputChange}
                        className={`create-profile-input ${invalidFields.includes("password") ? "invalid" : ""}`}
                    />

                    {/* DATE OF BIRTH */}
                    <TextField
                        fullWidth
                        label="Date of Birth (required)"
                        name="dateOfBirth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={profileDetails.dateOfBirth}
                        onChange={handleInputChange}
                        className={`create-profile-input ${invalidFields.includes("dateOfBirth") ? "invalid" : ""}`}
                    />


                    {/* PLAYER LEVEL */}
                    <TextField
                        fullWidth
                        select
                        label="Skill Level (Required)"
                        name="playerLevel"
                        value={profileDetails.playerLevel}
                        onChange={handleInputChange}
                        className={`create-profile-input ${invalidFields.includes("playerLevel") ? "invalid" : ""}`}
                    >
                        <MenuItem value="">Select Level</MenuItem>
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Pro">Pro</MenuItem>

                    </TextField>


                    {/* CLUB LOCKER URL */}
                    <TextField
                        fullWidth
                        label="Club Locker URL (optional)"
                        name="clubLockerURL"
                        variant="outlined"
                        value={profileDetails.clubLockerURL}
                        onChange={handleInputChange}
                        className="create-profile-input"
                    />

                    {/* COUNTRY */}
                    <TextField
                        fullWidth
                        label="Country (optional)"
                        name="country"
                        variant="outlined"
                        value={profileDetails.country}
                        onChange={handleInputChange}
                        className="create-profile-input"
                    />
                </form>

                <Button
                    variant="contained"
                    fullWidth
                    className="create-profile"
                    onClick={handleCreateProfile}
                    sx={{
                        padding: "10px 0px",
                        fontSize: "18px",
                        fontWeight: 600,
                    }}
                >
                    Create Profile
                </Button>
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