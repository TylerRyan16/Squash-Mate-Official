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
            const isLengthValid = value.length >= 8;
            const isNumbersValid = numberRegex.test(value);
            const isSpecialValid = specialCharacterRegex.test(value);

            // Update validation states
            setLengthValid(isLengthValid);
            setNumbersValid(isNumbersValid);
            setSpecialValid(isSpecialValid);

            setPasswordValid(isLengthValid && isNumbersValid && isSpecialValid)
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
        <div className="container">
            <div className="horizontal-flex">
                <div className="main-area">
                    <h1 className="header">Create Profile</h1>
                    <div className="first-last-name-area">
                        {/* FIRST NAME */}
                        <div className="column-flexbox">
                            <label htmlFor="first-name-input">First Name: </label>
                            <input
                                type="text"
                                name="firstName"
                                id="first-name"
                                className={`input-field ${invalidFields.firstName && touchedFields.firstName ? "invalid" : ""}`}
                                placeholder="First name..."
                                value={formValues.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="column-flexbox">

                            <label htmlFor="last-name-input">Last Name: </label>
                            <input
                                type="text"
                                name="lastName"
                                id="last-name"
                                className={`input-field ${invalidFields.lastName && touchedFields.lastName ? "invalid" : ""}`}
                                placeholder="Last name..."
                                value={formValues.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                    {/* EMAIL */}
                    <label htmlFor="email-input">Email: </label>
                    <input
                        type="text"
                        name="email"
                        className={`input-field ${invalidFields.email && touchedFields.email ? "invalid" : ""}`}
                        placeholder="email..."
                        value={formValues.email}
                        onChange={handleInputChange}
                    />

                    {/* USERNAME */}
                    <label htmlFor="username-input">Username: </label>
                    <input
                        type="text"
                        name="username"
                        className={`input-field ${invalidFields.username && touchedFields.username ? "invalid" : ""}`}
                        placeholder="username..."
                        value={formValues.username}
                        onChange={handleInputChange}
                    />
                    {/* PASSWORD */}
                    <label htmlFor="password-input">Password: </label>
                    <input
                        type="password"
                        name="password"
                        className={`input-field ${invalidFields.password && touchedFields.password ? "invalid" : ""}`}
                        placeholder="password..."
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                    {/* AGE */}
                    <label htmlFor="age-input">Age: </label>
                    <input
                        type="text"
                        name="age"
                        className={`input-field ${invalidFields.age && touchedFields.age ? "invalid" : ""}`}
                        placeholder="age..."
                        value={formValues.age}
                        onChange={handleInputChange}
                    />
                    {/* PLAYER LEVEL */}
                    <label htmlFor="player-level-input">Player Level: </label>
                    <input
                        type="text"
                        name="playerLevel"
                        className={`input-field ${invalidFields.playerLevel && touchedFields.playerLevel ? "invalid" : ""}`}
                        placeholder="player level..."
                        value={formValues.playerLevel}
                        onChange={handleInputChange}
                    />
                    {/* CLUB LOCKER URL */}
                    <label htmlFor="club-locker-url-input">Club Locker URL: </label>
                    <input
                        type="text"
                        name="clubLockerURL"
                        className={`input-field ${invalidFields.clubLockerURL && touchedFields.clubLockerURL ? "invalid" : ""}`}
                        placeholder="URL..."
                        value={formValues.clubLockerURL}
                        onChange={handleInputChange}
                    />
                    {/* CLUB LOCKER URL */}
                    <label htmlFor="country">Country: </label>
                    <input
                        type="text"
                        name="country"
                        className={`input-field ${invalidFields.country && touchedFields.country ? "invalid" : ""}`}
                        placeholder="Country..."
                        value={formValues.country}
                        onChange={handleInputChange}
                    />

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