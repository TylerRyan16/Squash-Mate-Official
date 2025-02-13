import './upload.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";


const Upload = () => {
    const navigate = useNavigate();

    const [thumbnail, setThumbnail] = useState('');
    const [continuePressed, setContinuePressed] = useState(false);
    const [videoDetails, setVideoDetails] = useState({
        title: "",
        description: "",
        url: "",
        type: "",
        length: "",
        tournament_date: "",
        tournament_name: "",
        tournament_location: "",
        poster: ""
    });

    useEffect(() => {
        if (videoDetails.type === "Game") {
            setVideoDetails((prevDetails) => ({
                ...prevDetails,
                length: "Single"
            }));
        }
    }, [videoDetails.type]);

    // HANDLE VIDEO INPUT
    const handleVideoInput = (e) => {
        const { name, value } = e.target;
        console.log("name: ", name);
        console.log("value: ", value);

        setVideoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        if (name === "url") {
            const videoId = extractYouTubeID(value);
            if (videoId) {
                setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
            } else {
                setThumbnail('');
            }
        }
    };

    const handleContinuePressed = () => {
        if (videoDetails.title && videoDetails.url && videoDetails.type) {
            setContinuePressed(true);
        } else {
            alert("Please fill in all fields!");
        }
    };

    const extractYouTubeID = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // VIDEO UPLOAD
    const handleVideoUpload = async () => {
        //  SEND POST REQUEST TO DATABASE
        try {
            const response = await axios.post("http://localhost:5000/api/videos", videoDetails);

            console.log("Video uploaded: ", response.data);

            navigate("/video");
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                console.error("error creating profile: ", error);
                alert("An error occurred while creating your profile. Please try again.");
            }

        }

        navigate("/video");

    };

    return (
        <div className="page-container">
            <h1 className="page-header">Upload a Video</h1>

            {/* PAGE ONE */}
            {!continuePressed && <div className="page-one">
                <div className="original-details">
                    {/* LINK */}
                    <div className="input-container">
                        <label className="floating-label">URL (required)</label>
                        <input
                            type="text"
                            className="input-zone url"
                            name="url"
                            value={videoDetails.url}
                            onChange={handleVideoInput}
                        ></input>
                    </div>


                    {/* VIDEO DISPLAY */}
                    {thumbnail && <img src={thumbnail} alt="thumbnail" className="video-thumbnail"></img>}

                    {/* TITLE / TYPE AREA */}
                    <div className="title-type-area">
                        <div className="vertical-flex">
                            {/* TITLE */}
                            <div className="input-container">
                                <label className="floating-label">Title (required)</label>
                                <input
                                    type="text"
                                    className="input-zone title"
                                    name="title"
                                    value={videoDetails.title}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>
                        </div>

                        {/* MATCH TYPE */}
                        <div className="match-type-area">
                            <button
                                className={`match-type-button ${videoDetails.type === 'Match' ? 'selected' : ''}`}
                                name="type"
                                value="Match"
                                onClick={handleVideoInput}
                            >Match</button>
                            <button
                                className={`match-type-button ${videoDetails.type === 'Game' ? 'selected' : ''}`}
                                name="type"
                                value="Game"
                                onClick={handleVideoInput}

                            >Game</button>
                            <button
                                className={`match-type-button ${videoDetails.type === 'Casual' ? 'selected' : ''}`}
                                name="type"
                                value="Casual"
                                onClick={handleVideoInput}
                            >Casual</button>
                        </div>
                    </div>
                    {/* CONTINUE BUTTON */}
                    <button
                        className="continue-button"
                        onClick={() => handleContinuePressed()}
                    >Continue</button>
                </div>
            </div>}

            {/* PAGE TWO */}
            {continuePressed && <div className="page-two">
                {/* LEFT */}
                <div className='left-area'>
                    <button className="back-button"
                        onClick={() => setContinuePressed(prevState => !prevState)}
                    >Back</button>
                    <div className="detail-display-background">
                        <div className='detail-row'>
                            <h2>Title: </h2>
                            <p> {videoDetails.title}</p>
                        </div>
                        <div className='detail-row'>
                            <h2>Link: </h2>
                            <p> {videoDetails.url}</p>
                        </div>
                        <div className='detail-row'>
                            <h2>Type: </h2>
                            <p> {videoDetails.type}</p>
                        </div>
                    </div>

                    {/* MORE DETAILS */}
                    <div className="more-details">

                        {/* LENGTH: TYPE = MATCH */}
                        {videoDetails.type === "Match" &&
                            <div className='match-length-area'>
                                <button
                                    className={`match-length-button ${videoDetails.length === 'Five' ? 'selected' : ''}`}
                                    name="length"
                                    value="Five"
                                    onClick={handleVideoInput}
                                >Five</button>
                                <button
                                    className={`match-length-button ${videoDetails.length === 'Seven' ? 'selected' : ''}`}
                                    name="length"
                                    value="Seven"
                                    onClick={handleVideoInput}

                                >Seven</button>
                            </div>
                        }

                        {/* LENGTH: TYPE = GAME */}
                        {videoDetails.type === "Game" &&
                            <div className='match-length-area'>
                                <button
                                    className={`match-length-button ${videoDetails.length === 'Single' ? 'selected' : ''}`}
                                    name="length"
                                    value="Single"
                                    onClick={handleVideoInput}
                                >Single Game</button>
                            </div>
                        }

                        {/* LENGTH: TYPE = GAME */}
                        {videoDetails.type === "Casual" &&
                            <div className='match-length-area'>
                                <button
                                    className={`match-length-button three ${videoDetails.length === 'Single' ? 'selected' : ''}`}
                                    name="length"
                                    value="Single"
                                    onClick={handleVideoInput}
                                >Single Game</button>
                                <button
                                    className={`match-length-button three ${videoDetails.length === 'Five' ? 'selected' : ''}`}
                                    name="length"
                                    value="Five"
                                    onClick={handleVideoInput}
                                >Five</button>
                                <button
                                    className={`match-length-button three ${videoDetails.length === 'Seven' ? 'selected' : ''}`}
                                    name="length"
                                    value="Seven"
                                    onClick={handleVideoInput}

                                >Seven</button>
                            </div>
                        }

                        {/* DATE ETC */}
                        <div className="input-container">
                            <label className="floating-label">Date of Play (not required)</label>
                            <input
                                type="date"
                                className="input-zone date"
                                name="tournament_date"
                                value={videoDetails.tournament_date}
                                onChange={handleVideoInput}
                            ></input>

                        </div>


                        {/* TOURNAMENT NAME */}
                        <div className="input-container">
                            <label className="floating-label">Tournament Name (not required)</label>
                            <input
                                type="text"
                                className="input-zone tournament-input"
                                name="tournament_name"
                                value={videoDetails.tournament_name}
                                onChange={handleVideoInput}
                            ></input>
                        </div>
                        <div className="input-container">
                            <label className="floating-label">Tournament Location (not required)</label>
                            <input
                                type="text"
                                className="input-zone tournament-input"
                                name="tournament_location"
                                value={videoDetails.tournament_location}
                                onChange={handleVideoInput}
                            ></input>

                        </div>
                        <div className="input-container">
                            <label className="floating-label">Description (not required)</label>
                            <input
                                type="text"
                                className="input-zone description"
                                name="description"
                                value={videoDetails.description}
                                onChange={handleVideoInput}
                            ></input>
                        </div>
                        <button className="upload-button" onClick={handleVideoUpload}>Upload</button>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="right-area">
                    <div className="right-background">
                        <h1>Preview</h1>
                        <img src={thumbnail} className="page-two-thumbnail" alt="video thumbnail"></img>
                        <p id="video-title">{videoDetails.title}</p>
                        <p id="uploader">Uploader Name</p>
                    </div>
                </div>
            </div>}




        </div>

    );
}

export default Upload;