import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import "./createProfile.scss";
import axios from "axios";

const CreateProfile = () => {
    const navigate = useNavigate();

    // State to store form values
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
        age: "",
        playerLevel: "",
        clubLockerURL: "",
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        dateOfBirth: "",
    });

    const [lengthValid, setLengthValid] = useState(false);
    const [numbersValid, setNumbersValid] = useState(false);
    const [specialValid, setSpecialValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [invalidFields, setInvalidFields] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const specialCharacterRegex = /[!@#$%&+]/;
    const numberRegex = /[0-9]/;


    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // MARK FIELD AS TOUCHED
        setTouchedFields((prev) => ({
            ...prev,
            [name]: true,
        }));

        // UPDATE FORM VALUES
        setFormValues({
            ...formValues,
            [name]: value,
        });


        if (value.trim() !== "") {
            setInvalidFields((prev) => ({
                ...prev,
                [name]: false,
            }));
        }

        if (name === "password") {
            setLengthValid(value.length >= 8);
            setNumbersValid(numberRegex.test(value));
            setSpecialValid(specialCharacterRegex.test(value));

            setPasswordValid(lengthValid && numbersValid && specialValid)
        }
    };

    // Handle form submission
    const handleCreateProfile = async () => {
        // check if any field is empty
        const newInvalidFields = [];


        // validate each field
        for (const [key, value] of Object.entries(formValues)) {
            if (value.trim() === "") {
                // add the field to invalid fields if its empty
                newInvalidFields[key] = true;
            }
        }

        // set fields we touched
        setTouchedFields(
            Object.keys(formValues).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {})
        );

        // update the state
        setInvalidFields(newInvalidFields);

        // if invalid fields is not empty, stop submission
        if (Object.keys(newInvalidFields).length > 0) {
            console.log(Object.keys(newInvalidFields));
            console.log("Some fields are empty!");
            return;
        }

        if (!passwordValid) {
            console.log("Password invalid!");
            return;
        }

        //  SEND REQUEST TO DATABASE
        try {
            const response = await axios.post("http://localhost:5000/api/profiles", formValues);

            console.log("Profile created: ", response.data);

            // set auth token in local storage
            const authToken = response.data.id;
            localStorage.setItem("authToken", authToken);

            navigate("/");
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                console.error("error creating profile: ", error);
                alert("An error occurred while creating your profile. Please try again.");
            }

        }
    };


    return (
        <div className="page-container">
            <div className="create-display-area">
                <div className="create-background">
                    <h1 className="header">Create Profile</h1>
                    <div className="first-last-name-area">

                        {/* FIRST NAME */}
                        <div className="input-container">
                            <label className="floating-label profile-label">First (required)</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`input-zone zone-profile first-name ${invalidFields.firstName && touchedFields.firstName ? "invalid" : ""}`}
                                value={formValues.firstName}
                                onChange={handleInputChange}
                            />

                        </div>

                        {/* LAST NAME */}
                        <div className="input-container">
                            <label className="floating-label profile-label">Last (required)</label>
                            <input
                                type="text"
                                name="lastName"
                                className={`input-zone zone-profile last-name ${invalidFields.lastName && touchedFields.lastName ? "invalid" : ""}`}
                                value={formValues.lastName}
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>


                    {/* EMAIL */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Email (required)</label>
                        <input
                            type="text"
                            name="email"
                            className={`input-zone zone-profile ${invalidFields.email && touchedFields.email ? "invalid" : ""}`}
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                    </div>


                    {/* USERNAME */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Username (required)</label>
                        <input
                            type="text"
                            name="username"
                            className={`input-zone zone-profile ${invalidFields.username && touchedFields.username ? "invalid" : ""}`}
                            value={formValues.username}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Password (required)</label>
                        <input
                            type="password"
                            name="password"
                            className={`input-zone zone-profile ${invalidFields.password && touchedFields.password ? "invalid" : ""}`}
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* DATE OF BIRTH */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Date of Birth (required)</label>
                        <input
                            type="date"
                            name="birthDate"
                            className={`input-zone zone-profile ${invalidFields.dateOfBirth && touchedFields.dateOfBirth ? "invalid" : ""}`}
                            onChange={handleInputChange}
                        />

                    </div>

                    {/* PLAYER LEVEL */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Player Level (required)</label>
                        <select  className="level-selection" name = "playerLevel">
                            <option name="playerLevel" value="Beginner">Beginner</option>
                            <option name="playerLevel" value="Intermediate">Intermediate</option>
                            <option name="playerLevel" value="Pro">Pro</option>
                        </select>
                    </div>

                    {/* CLUB LOCKER URL */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Club Locker URL (not required)</label>
                        <input
                            type="text"
                            name="clubLockerURL"
                            className={`input-zone zone-profile ${invalidFields.clubLockerURL && touchedFields.clubLockerURL ? "invalid" : ""}`}
                            value={formValues.clubLockerURL}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* COUNTRY */}
                    <div className="input-container">
                        <label className="floating-label profile-label">Country (not required)</label>
                        <input
                            type="text"
                            name="country"
                            className={`input-zone zone-profile ${invalidFields.country && touchedFields.country ? "invalid" : ""}`}
                            value={formValues.country}
                            onChange={handleInputChange}
                        />
                    </div>

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
                        <li className={`password-check-item ${lengthValid ? "completed" : ""}`}>8 characters</li>
                        <li className={`password-check-item ${numbersValid ? "completed" : ""}`}>1 number</li>
                        <li className={`password-check-item ${specialValid ? "completed" : ""}`}>1 special character (!, @, #, $, %, &, *, +)</li>
                    </ul>
                    <h2 className={`password-confirm ${passwordValid ? "valid" : ""}`}>Password Valid</h2>
                </div>

            </div>




        </div>

    );
}

export default CreateProfile;