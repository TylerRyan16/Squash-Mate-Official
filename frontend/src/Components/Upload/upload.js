import './upload.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { uploadVideo } from "../../services/api";
import { getMyUsername } from "../../services/api";


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
        player1_name: "",
        player2_name: "",
        player1_color: "#000000",
        player2_color: "#000000",
        poster: "",
        thumbnail: "",
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

        setVideoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        if (name === "url") {
            const videoId = extractYouTubeID(value);
            if (videoId) {
                setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
                setVideoDetails((prevDetails) => ({
                    ...prevDetails,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`
                }))
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
        
        try {
            const uploader = await getMyUsername();
            console.log("uploader name: ", uploader);

            videoDetails.poster = uploader.username;

            const response = await uploadVideo(videoDetails);
            console.log("reponse: ", response);

            const databaseVideoId = response.id;
            navigate(`/video/${databaseVideoId}`);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-header">Upload a Video</h1>


            {/* PAGE ONE */}
            {!continuePressed && <div className="page-one">
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
            </div>}


            {/* PAGE TWO */}
            {continuePressed && <div className="page-two">
                {/* <button className="back-button"
                    onClick={() => setContinuePressed(prevState => !prevState)}
                >Back</button> */}

                <div className="left-vertical-upload">
                    <div className="upload-input-2">
                        <div className="left-upload-input-section">
                            {/* MORE DETAILS */}

                            {/* LENGTH: TYPE = MATCH */}
                            <div className="best-of-area">
                                <p>Best Of</p>
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
                            </div>

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
                                <label className="floating-label">Date of Play (optional)</label>
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
                                <label className="floating-label">Tournament Name (optional)</label>
                                <input
                                    type="text"
                                    className="input-zone tournament-input"
                                    name="tournament_name"
                                    value={videoDetails.tournament_name}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>
                            <div className="input-container">
                                <label className="floating-label">Tournament Location (optional)</label>
                                <input
                                    type="text"
                                    className="input-zone tournament-input"
                                    name="tournament_location"
                                    value={videoDetails.tournament_location}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>

                            {/* PLAYER INFO */}
                            <div className="player-info">
                                <div className="player-row">
                                    <div className="input-container name-input">
                                        <label className="floating-label">Player 1 Name</label>
                                        <input
                                            type="text"
                                            className="input-zone tournament-input"
                                            name="player1_name"
                                            value={videoDetails.player1_name}
                                            onChange={handleVideoInput}
                                        />
                                    </div>
                                    <div className="input-container color-input">
                                        <label className="floating-label">Player 1 Jersey Color</label>
                                        <input
                                            type="color"
                                            className="input-zone"
                                            name="player1_color"
                                            value={videoDetails.player1_color}
                                            onChange={handleVideoInput}
                                        />
                                    </div>
                                </div>

                                <div className="player-row">
                                    <div className="input-container name-input">
                                        <label className="floating-label">Player 2 Name</label>
                                        <input
                                            type="text"
                                            className="input-zone tournament-input"
                                            name="player2_name"
                                            value={videoDetails.player2_name}
                                            onChange={handleVideoInput}
                                        />
                                    </div>
                                    <div className="input-container color-input">
                                        <label className="floating-label">Player 2 Jersey Color</label>
                                        <input
                                            type="color"
                                            className="input-zone"
                                            name="player2_color"
                                            value={videoDetails.player2_color}
                                            onChange={handleVideoInput}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="right-upload-input-section">

                            <div className="input-container">
                                <label className="floating-label">Description (optional)</label>
                                <input
                                    type="text"
                                    className="input-zone description"
                                    name="description"
                                    value={videoDetails.description}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>

                        </div>
                    </div>

                    <button className="upload-button" onClick={handleVideoUpload}>Upload</button>

                </div>



                {/* RIGHT */}
                <div className="right-area">
                    <h1>Preview</h1>
                    <img src={thumbnail} className="page-two-thumbnail" alt="video thumbnail"></img>
                    <div className="detail-display-background">
                        <h4> {videoDetails.title}</h4>
                        <p> {videoDetails.type}</p>
                    </div>

                </div>
            </div>}
        </div>
    );
}

export default Upload;