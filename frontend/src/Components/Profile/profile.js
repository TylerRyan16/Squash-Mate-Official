import './profile.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, updateProfileRequest } from "../../services/api";

//MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


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
        <div className=
            "flex flex-col justify-center items-center"
        >
            {/* PROFILE PIC & EDIT & CLUB LOCKER*/}
            <div className="relative flex flex-col items-center w-full flex-grow-0">
                {/* EDIT PROFILE BUTTON */}
                <div className="absolute top-4 right-4 flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => {
                        // set data back to original if not pressed save changes
                        if (editProfileEnabled) {
                            setUserData(originalData);
                            setSelectedColor(originalData.profile_pic);
                        }
                        setEditProfileEnabled(!editProfileEnabled);
                    }}
                >
                    <img
                        src="/assets/icons/edit profile.png"
                        alt="edit-profile"
                        className={`w-5 h-5 ${editProfileEnabled ? "enabled" : ""}`}
                    />
                    <span className="hover:underline cursor-pointer">Edit Profile</span>

                </div>

                <h1 className="text-xl font-semibold self-start ml-6 pt-1">My Profile</h1>
                {/* PROFILE PICTURE */}
                <div className="flex items-center justify-center gap-4">
                    <img className={`${editProfileEnabled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-8 md:w-16 h-auto rotate-180`} src='assets\icons\right-arrow.png' alt='change pic left' onClick={() => switchProfileColor("left")} />
                    {!editProfileEnabled && <img className="w-20 md:w-32 h-auto" src={`/assets/characters/${userData.profile_pic}.png`} alt='profile cover'></img>}

                    {editProfileEnabled && <img className="w-20 md:w-32 h-auto" src={`/assets/characters/${selectedColor}.png`} alt='profile cover' ></img>}

                    <img className={`${editProfileEnabled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-8 md:w-16 h-auto`} src='assets\icons\right-arrow.png' alt='change pic right' onClick={() => switchProfileColor("right")} />
                </div>

                {/* USERNAME */}
                <h1 className="text-lg font-bold">{userData.username}</h1>

                {/* CLUB LOCKER */}
                <div className="flex gap-2 items-center justify-center" onClick={() => window.open(userData.club_locker_url, '_blank')}>
                    <h3 className="text-base font-bold">Club Locker</h3>
                    <img className="w-4 h-4 text-base" src="/assets/icons/link.png" alt="club locker link"></img>

                    <p className="text-sm font-medium">{userData.level}</p>
                </div>
            </div>

            {/* PROFILE TEXT FIELDS */}
            <div className="flex flex-col gap-3 p-2">


                <div className="profile-fields-div">



                    {/* first name */}
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        className="input-zone"
                        value={userData.first_name}
                        onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                        InputProps={{ readOnly: !editProfileEnabled }}
                        sx={{ mb: 2 }}
                    />


                    {/* last name */}
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        className="input-zone"
                        value={userData.last_name}
                        onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                        InputProps={{ readOnly: !editProfileEnabled }}
                        sx={{ mb: 2 }}
                    />


                    {/* date of birth */}
                    <TextField
                        label="Date of Birth"
                        variant="outlined"
                        fullWidth
                        className="input-zone"
                        value={userData.date_of_birth || 'N/A'}
                        onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
                        InputProps={{ readOnly: !editProfileEnabled }}
                        sx={{ mb: 2 }}
                    />


                    {/* country */}
                    <TextField
                        label="Country"
                        variant="outlined"
                        fullWidth
                        className="input-zone"
                        value={userData.country || 'N/A'}
                        onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                        InputProps={{ readOnly: !editProfileEnabled }}
                        sx={{ mb: 2 }}
                    />
                </div>

                {/* SECURITY AREA */}
                <h1 className="text-lg font-bold">Security</h1>
                {/* email */}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    className="input-zone"
                    value={userData.email}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                />



                {/* password */}
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    className="input-zone"
                    value="************"
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                />

                <div className="w-full flex justify-between gap-4">
                    <button
                        type="button"
                        className="w-1/2 lg:w-1/5 p-2 border-2 border-solid border-red-600 text-red-600 rounded-lg bg-inherit hover:bg-red-100"
                    >Change Password</button>
                    <button
                        type="button"
                        className="w-1/2 lg:w-1/5 p-2 border-2 border-solid border-red-600 text-red-600 rounded-lg bg-inherit hover:bg-red-100"
                        onClick={logoutUser}>Logout</button>
                </div>


                {/* CHECKBOXES */}
                <div className="flex gap-4">
                    <input type="checkbox" id="show-age"></input>
                    <label htmlFor="show-age" >Publicly display my age on my profile</label>
                </div>

                {/* save changes (mobile)*/}
                <div
                    className={`${(editProfileEnabled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} sm:hidden flex bg-navbar shadow-2xl border-t-2 transition-all duration-300 z-50 fixed  items-center justify-center left-0 bottom-0 w-full h-20`}
                >
                    <button className="w-1/2 lg:w-1/5 p-2 border-2 border-solid border-green-600 text-green-600 rounded-lg bg-inherit hover:bg-green-100"
                        onClick={() => updateProfile()}>Save Changes</button>
                </div>

                {/* save changes (desktop) */}
                <button className={`${editProfileEnabled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 hidden md:block w-1/2 lg:w-1/5 p-2 border-2 border-solid border-green-600 text-green-600 rounded-lg bg-inherit hover:bg-green-100 self-end`}
                    onClick={() => updateProfile()}>Save Changes</button>

                {/* Empty space */}
                <div className="w-full h-20 border-b-2 border-b-gray-200">

                </div>
                <div className="w-full h-6">

                </div>


            </div>
        </div>
    );
}

export default Profile;